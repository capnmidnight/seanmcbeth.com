if (document && !document.addEventListener) {
    Object.prototype.addEventListener = function (e, f, t) {
        "use strict";
        this.attachEvent("on" + e, f);
    };
}

var lib = {
    cos_vals: [],
    sin_vals: [],
    cos: function(a){
        a = Math.round(a * 1800 / Math.PI);
        while(a < 0) a += lib.cos_vals.length;
        while(a >= lib.cos_vals.length) a -= lib.cos_vals.length;
        return lib.cos_vals[a];
    },
    sin: function(a){
        a = Math.round(a * 1800 / Math.PI);
        while(a < 0) a += lib.sin_vals.length;
        while(a >= lib.sin_vals.length) a -= lib.sin_vals.length;
        return lib.sin_vals[a];
    }
};

for(var i = 0; i < 3600; ++i){
    lib.cos_vals[i] = Math.cos(i * Math.PI / 1800);
    lib.sin_vals[i] = Math.sin(i * Math.PI / 1800);
}


function makeCanvas(id, width, height) {
    "use strict";
    var canv = document.createElement("canvas");
    canv.id = id;
    canv.width = width;
    canv.height = height;
    canv.style.width = width + "px";
    canv.style.height = height + "px";
    return canv;
}

lib.keyHandler = {
    keys: [],
    keycool: [],
    keyfuncs: [],
    keydown: function (evt) {
        "use strict";
        if (!evt) {
            evt = event;
        }
        lib.keyHandler.keys[evt.keyCode] = true;
        console.log(evt.keyCode);
    },
    keyup: function (evt) {
        "use strict";
        if (!evt) {
            evt = event;
        }
        lib.keyHandler.keys[evt.keyCode] = false;
    },
    setup: function (obj) {
        "use strict";
        obj.addEventListener("keydown", lib.keyHandler.keydown, false);
        obj.addEventListener("keyup", lib.keyHandler.keyup, false);
    },
    add: function (code, cooldown, f) {
        lib.keyHandler.keyfuncs[lib.keyHandler.keyfuncs.length] = function (dt) {
            "use strict";
            if (lib.keyHandler.keys[code]
                    && (!lib.keyHandler.keycool[code]
                    || lib.keyHandler.keycool[code] <= 0)) {
                f(dt);
                lib.keyHandler.keycool[code] = cooldown;
            } else if (lib.keyHandler.keycool[code] > 0) {
                lib.keyHandler.keycool[code] -= dt;
            }
        };
    }
};

lib.pump = {
    lastTime: 0,
    curTime: 0,
    dTime: 0,
    accumTime: 0,
    timer: null,
    i: 0,
    start: function (updateFunc, drawFunc, targetTime) {
        "use strict";
        lib.pump.lastTime = Date.now();
        var tick = function () {
            lib.pump.curTime = Date.now();
            lib.pump.dTime = lib.pump.curTime - lib.pump.lastTime;
            for (lib.pump.accumTime += lib.pump.dTime; lib.pump.accumTime > targetTime; lib.pump.accumTime -= targetTime) {
                for (lib.pump.i = 0; lib.pump.i < lib.keyHandler.keyfuncs.length; lib.pump.i++) {
                    lib.keyHandler.keyfuncs[lib.pump.i](targetTime);
                }
                updateFunc(targetTime);
            }
            drawFunc();
            lib.pump.lastTime = lib.pump.curTime;
            lib.pump.timer = setTimeout(tick, Math.max(targetTime - lib.pump.dTime, 1));
        };
        lib.pump.timer = setTimeout(tick, 1);
    }
};