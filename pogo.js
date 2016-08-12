/*global JS9PM, $ */

// eslint-disable-next-line no-unused-vars
var POGO = (function(){
"use strict";

// module header
var POGO = {};

POGO.NAME = "POGO";		// the name of this namespace
POGO.VERSION = "1.0";		// the version of this namespace
POGO.COPYRIGHT = "Copyright (c) 2012-2016 Smithsonian Institution";

// globals
POGO.pm = null;		/* communication handle */
POGO.el = null;		/* element containing iframe */
POGO.target = null;	/* target host */
POGO.cbs = [];		/* callback array */

// flot plotting options
POGO.plotOpts = {
    zoomStack: true,
    selection: {
        mode: "xy"
    },
    series: {
  	clickable: true,
	hoverable: true,
        lines: { show: true },
        points: { show: false }
    }
};

// init: connect to iframe and add listener
POGO.init = function(el, target){
    // save init args
    POGO.el = el;
    POGO.target = target;
    // can use js9 postMessage or HTML postMessage
    if( window.hasOwnProperty("JS9PM") ){
        POGO.pm = JS9PM.init(el, target);
    } else {
	if( POGO.debug ){
	    // eslint-disable-next-line no-console
	    console.log("postMessage init: %s %s", POGO.el, POGO.target);
	}
        POGO.pm = window.document.getElementById(el).contentWindow;
        window.addEventListener("message", function(ev){
            var msg;
            var data = ev.data;
            if( typeof data === "string" ){
                // json string passed (we hope)
                try{ msg = JSON.parse(data); }
                catch(e){ POGO.error("ERROR: can't parse msg: "+data, e); }
            } else if( typeof data === "object" ){
                // object was passed directly
                msg = data;
            } else {
                POGO.error("ERROR: invalid return msg from postMessage");
            }
            if( POGO.cbs[msg.cmd] && msg.res ){
                POGO.cbs[msg.cmd](msg.res);
                delete POGO.cbs[msg.cmd];
            }
        });
    }
};

// send API command to JS9
POGO.send = function(cmd, args, cb){
    // sanity check
    if( !POGO.pm ){
	POGO.error("postMessage not initialized");
    }
    if( window.hasOwnProperty("JS9PM") ){
        args.unshift(cmd);
        args.unshift(POGO.pm);
        if( cb ){
            args.push(cb);
        }
        JS9PM.send.apply(null, args);
    } else {
        if( cb ){
            POGO.cbs[cmd] = cb;
        }
	if( POGO.debug ){
	    // eslint-disable-next-line no-console
	    console.log("postMessage to %s: %s %s", 
			POGO.target, cmd, JSON.stringify(args));
	}
        try{ POGO.pm.postMessage({cmd: cmd, args: args}, POGO.target); }
        catch(e){ POGO.error("ERROR: sending postMessage: " + e.message); }
        return;
    }
};

// convenience routine to call flot
POGO.plot = function(el, obj, opts){
    var pobj;
    // sanity check
    if( !POGO.pm ){
	POGO.error("ERROR: postMessage not initialized");
    }
    if( !el || !obj ){
        POGO.error("missing arguments to plot");
    }
    // retrieve plot object (should contain a data object)
    if( obj && obj.stdout ){
	pobj = JSON.parse(obj.stdout);
    } else if( obj.data ){
	pobj = obj;
    } else {
        throw new Error("no analysis data for plot");
    }
    // erase previous
    el.innerHTML = "";
    // plot the data
    $.plot(el, [pobj], opts||POGO.plotOpts);
};

// error output
POGO.error = function(s){
    var t = "ERROR: " + s;
    alert(t);
    throw new Error(t);
};

// return namespace
return POGO;
}());
