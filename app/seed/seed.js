// Module dependencies
var path     = require('path');
var fs       = require('fs');
var express  = require('express');
var mongoose = require('mongoose');
var config   = require('../config/config');
var app      = express();
var async = require('async');
var securityCheck = require('../helper/security');
var _ = require('lodash');

app.config = config;

// Database
require('../config/database')(app, mongoose);
require('../models/user');

require('../models/view');

function createDemoWorld(callback) {

    var View = mongoose.model('View');
    var Infowin = mongoose.model('Infowin');

    function readJson(filename, cb) {
      fs.readFile('public/JSONs/' + filename + '.json', 'utf8', function(err, content) {
        cb(err, JSON.parse(content));
      });
    }

    function readAllJsons(w, callback) {
        async.parallel([
            function(cb) {
                readJson('gearMap', cb); 
            },
            function(cb) {
                readJson('gearList2', function(err, content) {
                    var rs = [], gr, r, j = 0;
                    for (var key in content) {
                        r = content[key];
                        gr = new Infowin({
                            name: r.id,
                            title: r.title,                            
                            description: r.description,
                            html: r.html,
                            thumbnail_src: r.thumbnail_src,
                            type: r.type,
                            sortPos: j
                        });
                        j++;
                        rs.push(gr);
                    } 
                   cb(err, rs);
                }); 
            },
            function(cb) {
                readJson('views', function(err, content){
                    var rs = [], r, nv, vs = content;
                    for (var j = 0, lenJ = vs.length; j < lenJ; j += 1) {
                        r = vs[j];
                        nv = new View({
                            title: r.title,                            
                            description: r.description,
                            html: r.html,
                            selected: r.selected,
                            doubleclick: r.doubleclick,
                            screenshot: r.screenshot,
                            keyCode: Number(r.key),
                            cameraPosition: r.cameraPosition,
                            targetPosition: r.targetPosition,
                            sortPos: j,
                            name: r.id
                        });
                        rs.push(nv);
                    }
                    cb(err, rs);
                }); 
            }],
        function(err, results) {
            w.gearMap = results[0];
            w.infowins = results[1];
            w.views = results[2];
            callback(w);
        });
    }

    function mDemo(w, cb) {
        var wUpdate = new World({ title: "Demo" });
        wUpdate.modelInfo =  { 
            baseScene: {
                obj: "baseScene.obj", 
                mtl: "baseScene.mtl", 
                texturesPath: "texturesBase/",
                prefix: "baseSceneobj--"
            }
        };
        readAllJsons(wUpdate, function() {
            w.gearMap = wUpdate.gearMap;
            w.infowins = wUpdate.infowins;
            w.views = wUpdate.views;
            
            cb(w);
        });
    }

    var World = mongoose.model('World');

    World.list({ criteria: { slug: "demo"} },
        function(err, w){
            if (w.length === 0) {
                var world = new World({title: "Demo"});
                mDemo(world, function (worldUpdated){
                    worldUpdated.save(function (err, new_World) {
                        //console.log(new_World);
                        callback();
                    });
                });
            } else {
                var world = w[0];
                console.log("*** Demo already exists");
                mDemo(world, function (worldUpdated){
                    worldUpdated.save(function (err, new_World) {
                        if (err) { console.error(err); }
                        console.log(new_World);
                        //console.log("World-id", new_World.id);
                        callback();
                    });
                });
            }
        });

}

function createUser(email, password, username, securityLevel, callback) {
    var User = mongoose.model('User');

    User.find({ email: email} ).exec(
        function(err, usr){
            if (usr.length === 0) {
                var user = new User({email: email, password: password, username: username });
                user.securityLevel = securityLevel;
                user.save(function (err, new_user) {
                    console.log("User created: " + email);
                    callback();
                });
            } else {
                var user = usr[0];
                user.password = password,
                user.username = username;
                user.securityLevel = securityLevel;
                console.log("*** User already exists", email);
                user.save(function (err, new_user) {
                    console.log("User modified: " + email);
                    callback();
                });
            }
            
        });
}

var roles = securityCheck.ROLES_SECURITY;

async.waterfall([
    //async.apply(createDemoWorld),
    async.apply(createUser, "puwebdev@gmail.com", "TEST", "K", roles.SUPERADMINISTRATOR),
    async.apply(createUser, "test@test.com", "Test", "S", roles.EDITOR)
],
function(err) {
    process.exit();
});

