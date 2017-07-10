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
require('../models/world');
require('../models/user');
require('../models/view');

var mpp = {};
//Mlab
mpp["583ca85c57693644ebdaed3d"]="HFC_Network_Overview_1";
mpp["583ca85c57693644ebdaed3e"]="Powered_Node_1";
mpp["583ca85c57693644ebdaed3f"]="Power_Supply_Cabinet_1";
mpp["583ca85c57693644ebdaed40"]="Power_Supply_1";
mpp["583ca85c57693644ebdaed41"]="Power_Supply_Cabinet_2";
mpp["583ca85c57693644ebdaed42"]="Aerial_Powered_Node_1";
mpp["583ca85c57693644ebdaed43"]="Node_Assembly_1";
mpp["583ca85c57693644ebdaed44"]="Node_1";
mpp["583ca85c57693644ebdaed45"]="Power_Inserter_1";
mpp["583ca85c57693644ebdaed46"]="Power_Inserter_Cable";
mpp["583ca85c57693644ebdaed47"]="Tap_1";
mpp["583ca85c57693644ebdaed48"]="Drop_Cable_1";
mpp["583ca85c57693644ebdaed49"]="Drop_Tag_1";
mpp["583ca85c57693644ebdaed4a"]="Hardline_Cable_2";
mpp["583ca85c57693644ebdaed4b"]="Strand_2";
mpp["583ca85c57693644ebdaed4c"]="Fiberoptic_Cable_1";
mpp["583ca85c57693644ebdaed4d"]="Sno_Shoe_1";
mpp["583ca85c57693644ebdaed4e"]="Sno_Shoe_2";
mpp["583ca85c57693644ebdaed4f"]="Headend_1";
mpp["583ca85c57693644ebdaed50"]="Fiber_Optic_Cable001";
mpp["583ca85c57693644ebdaed51"]="OTA_Antenna_1";
mpp["583ca85c57693644ebdaed52"]="";
mpp["583ca85c57693644ebdaed53"]="";
mpp["583ca85c57693644ebdaed54"]="Headend_Angle_1";
mpp["583ca85c57693644ebdaed55"]="";

//Local
mpp["5839820745b50306db9915bb"]="HFC_Network_Overview_1";
mpp["5839820745b50306db9915bc"]="Powered_Node_1";
mpp["5839820745b50306db9915bd"]="Power_Supply_Cabinet_1";
mpp["5839820745b50306db9915be"]="Power_Supply_1";
mpp["5839820745b50306db9915bf"]="Power_Supply_Cabinet_2";
mpp["5839820745b50306db9915c0"]="Aerial_Powered_Node_1";
mpp["5839820745b50306db9915c1"]="Node_Assembly_1";
mpp["5839820745b50306db9915c2"]="Node_1";
mpp["5839820745b50306db9915c3"]="Power_Inserter_1";
mpp["5839820745b50306db9915c4"]="Power_Inserter_Cable";
mpp["5839820745b50306db9915c5"]="Tap_1";
mpp["5839820745b50306db9915c6"]="Drop_Cable_1";
mpp["5839820745b50306db9915c7"]="Drop_Tag_1";
mpp["5839820745b50306db9915c8"]="Hardline_Cable_2";
mpp["5839820745b50306db9915c9"]="Strand_2";
mpp["5839820745b50306db9915ca"]="Fiberoptic_Cable_1";
mpp["5839820745b50306db9915cb"]="Sno_Shoe_1";
mpp["5839820745b50306db9915cc"]="Sno_Shoe_2";
mpp["5839820745b50306db9915cd"]="Headend_1";
mpp["5839820745b50306db9915ce"]="Fiber_Optic_Cable001";
mpp["5839820745b50306db9915cf"]="OTA_Antenna_1";
mpp["5839820745b50306db9915d0"]="";
mpp["5839820745b50306db9915d1"]="";
mpp["5839820745b50306db9915d2"]="Headend_Angle_1";
mpp["5839820745b50306db9915d3"]="";

var World = mongoose.model('World');

World.list({ criteria: { slug: "demo"} },
    function(err, w){
        var j, lenJ, vv,
            world = w[0];
        console.log("*** Demo found");

        for (j = 0, lenJ = world.views.length; j < lenJ; j += 1) {
            world.views[j].name = mpp[world.views[j]._id];
            console.log(world.views[j]._id, mpp[world.views[j]._id]);
        }
        world.markModified('views');

        world.save(function (err, new_World) {
            if (err) { console.error(err); }
            console.log(new_World.views);
            //console.log("World-id", new_World.id);
            process.exit();
        });
        
        
    });


