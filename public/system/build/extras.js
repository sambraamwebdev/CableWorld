/* +++++ *
/* The purpose of this file is to add new logic to the app 
/*
/* References:  window.app3dViewer (main app)
/*              window.app3dInfowWindow (info-window)
/*              window.app3dViewsNav (views-navigator)
/*
/* This will be available in window.app3dExtras
/* +++++ */

var app3dExtras = (function(){

    var node = document.getElementById("app-3d"),
        app3d = window.app3dViewer, //(main app)
		viewsNav = window.app3dViewsNav, //(info-window)
        winInfo = window.app3dInfowWindow; //(views-navigator)

	window.puwebdev = window.puwebdev || {};
	puwebdev.authoringMode = true;

	$.noConflict();
	
	puwebdev.guiReady = jQuery.Deferred();

	jQuery( document ).ready(function( $ ) {
		// Code that uses jQuery's $ can follow here.
		puwebdev.gloss = {};
		$.each(window.config.gearList, function(index, gear) { puwebdev.gloss[gear.title] = gear; });
        //puwebdev.createObjectPicker();
        puwebdev.loadFirstView();
		jQuery.when(puwebdev.guiReady).done(function(){
			console.log('interface is ready');
		});
	});


    puwebdev.createObjectPicker = function(){
    	/*
    	var count = jQuery.map(app3dViewer.renderer3d.objectsByName, function(n, i) { return i; }).length;
    	//console.log(count);
    	if (count<1) {
			setTimeout(function(){puwebdev.createObjectPicker()},500);
			return;
		}
		puwebdev.objectPicker = jQuery('<ul id="ObjectPicker" style="height: 200px; overflow: scroll;"></ul>');
		var counter = -1;
		jQuery.each(app3dViewer.renderer3d.objectsByName,function(key,obj){
		  //console.log(key,obj);
		  counter++;
		  var title = key.replace('baseSceneobj--','');
		  var item = jQuery('<li class="objectID" data-key="'+key+'" data-objglow="'+counter+'">'+title+'</li>');
		  item.data({
		  		"obj":obj,
		  		"key":key
		  });
		  item.appendTo(puwebdev.objectPicker);
		  app3dViewer.createGlowSibling(app3dViewer.renderer3d.objectsByName[key]);
		});

		jQuery(puwebdev.objectPicker).insertBefore('#viewer-nav-thumbs');
		jQuery('#viewer-nav')
			.on('mouseover','#ObjectPicker li.objectID', function(){
				var childrenIndex = Number(jQuery(this).data('objglow'));
				console.log(childrenIndex);
				app3dViewer.renderer3d.objsGlow.children[childrenIndex].visible = true;
			})
			.on('mouseout','#ObjectPicker li.objectID', function(){
				var childrenIndex = Number(jQuery(this).data('objglow'));
				app3dViewer.renderer3d.objsGlow.children[childrenIndex].visible = false;
			});
		*/
	}

	puwebdev.getCurrentView = function() {
		var currentPosition = app3dViewer.viewPosition();
		var viewCoords = {
			"cameraPosition" : {
				"x" : currentPosition[0].x,
				"y" : currentPosition[0].y,
				"z" : currentPosition[0].z
			},			
			"targetPosition" : {
				"x" : currentPosition[1].x,
				"y" : currentPosition[1].y,
				"z" : currentPosition[1].z
			}
		}
		return JSON.stringify(viewCoords, null, '\t');
	}

	//Not used anymore
	puwebdev.flyToViewId = function(viewId) {
		if (!viewId) {return;}
		viewsNav.goToViewId(viewId);
	}

	puwebdev.loadFirstView = function() {
		setTimeout( function () {
			viewsNav.open();
			jQuery('#viewer-nav-thumbs li:visible').first().trigger('click');
			puwebdev.guiReady.resolve();
		}, 5000);
	}

	/*
	Not used anymore
	puwebdev.onClickGloss = function(gloss){
		var $ = jQuery;		
		if (gloss && $(gloss).is('[data-viewid]')) {
			puwebdev.flyToViewId($(gloss).attr('data-viewid'));
		}
	}*/

	puwebdev.onHideIframe = function(){
		var $ = jQuery;
		//console.log('onHideIframe');	
	}
	
	puwebdev.onHideInfoWindow = function(force){
		var $ = jQuery;
		//console.log('onHideInfoWindow');	
	}

    puwebdev.onObjectClick = function (ev) {
        if (!ev || !ev.intersected) {
            return;
        }
        var intersected = ev.intersected,
			objectName = intersected.name || null,
			objectId = window.config.gearMap[objectName] || null,
			objectGear = window.config.gearList[objectId] || null,
			objectTitle = (objectGear && objectGear.title) ? objectGear.title : null,
			objectDescription = (objectGear && objectGear.description) ? objectGear.description : null,
			objectHtml = (objectGear && objectGear.html) ? objectGear.html : null,

        	position = app3dViewer.viewPosition(),
			cameraPosition = position[0],
			targetPosition = position[1],

			currentView = {
				"title": objectTitle,
				"description": objectDescription,
				"html": objectHtml,
				"selected": objectName,
				"key": "",
				"doubleclick": objectName,
				"cameraPosition" : { "x": cameraPosition.x, "y": cameraPosition.y, "z": cameraPosition.z },
				"targetPosition" : { "x": targetPosition.x, "y": targetPosition.y, "z": targetPosition.z },
				"screenshot": null
			} 

        console.log(JSON.stringify(currentView, null,'\t'));

    }

    puwebdev.onObjectDoubleClick = function (ev) {

        var intersected = ev.intersected || null,
			objectName = (intersected) ? intersected.name : null,
			objectId = window.config.gearMap[objectName] || null,
			matchedView;

        console.log(objectName, objectId);

		if (!objectName || !viewsNav.viewsBySelected[objectName]) { return; }
		
		//Exists a view with Selected = objectName
		matchedView = viewsNav.viewsBySelected[objectName];
		//Move camera to View
		viewsNav.goToViewId(matchedView._id);
		//Log to window
		console.log('View "' + matchedView.title + '" matches object ' + objectName + ' ('+objectId+')', matchedView);
	
    }

	puwebdev.onObjectHover = function(ev){
		var intersected = ev.intersected;
		if (intersected) {
        	console.log(intersected);
		}
	}

	puwebdev.onShowIframe = function(src, title, w, h){
		var $ = jQuery;
		//console.log('onShowIframe');	
	}

	puwebdev.onShowInfoWindow = function(info,persist){
		var $ = jQuery;
		//console.log('onShowInfoWindow');	
	}

	puwebdev.onViewChanged = function(ev) {
		//console.log('viewChanged',ev);
	}

	puwebdev.onViewChanging = function(ev) {
		//console.log('viewChanging',ev);
	}

	puwebdev.receiveMessage = function(message) {
		console.log('receiveMessage',message);
	}
	window.receiveMessage = puwebdev.receiveMessage;

    node.addEventListener("clicked", puwebdev.onObjectClick, false);
    node.addEventListener("doubleclicked", puwebdev.onObjectDoubleClick, false);
    node.addEventListener("pointerchanged", puwebdev.onObjectHover, false);
    node.addEventListener("viewChanging", puwebdev.onViewChanging, false);
    node.addEventListener("viewChanged", puwebdev.onViewChanged, false);


    //Use this to return public variables
    return {
        node: node,
        puwebdev: puwebdev
    };

}());
