//region timing
alert('The amount of time you spend away from this page will be logged and shown to your teacher. Do not leave this tab.');

var timeAway = 0;
var isAway = false;
var startTimeAway = 0;

function onBlur() {
    //called when tab loses focus, starts loggin time away
    isAway = true;
    startTimeAway = new Date().getTime();
}

function onFocus() {
    //called when tab gains focus, logs time away
    if (!isAway) {
        //that's weird, the tab focused but we are in focus? idk just forget it I guess
        return;
    }
    timeAway += new Date().getTime() - startTimeAway;
    isAway = false;
}

window.setTimeout(function () {
    //sets up the onFocus and onUnfocus funtions
    if (/*@cc_on!@*/false) { // check for Internet Explorer
        document.onfocusin = onFocus;
        document.onfocusout = onBlur;
    } else {
        window.onfocus = onFocus;
        window.onblur = onBlur;
    }
}, 10000);  //because Chrome is stupid and treats alerts like a new window. so give them 10 seconds before we start
            //recording. This isn't perfect, but I'm lazy FIXME
//endregion timing

//region console
//let's disable their console
//this doesn't really work in any modern browser, but what the hell
//facebooks method:
Object.defineProperty(window, "console", {
    value: console,
    writable: false,
    configurable: false
});

var i = 0;

function showWarningAndThrow() {
    if (!i) {
        setTimeout(function () {
            console.log("%cWarning message", "font: 2em sans-serif; color: yellow; background-color: red;");
        }, 1);
        i = 1;
    }
    throw "sh go away this isn't for you";
}

var l, n = {
    set: function (o) {
        l = o;
    },
    get: function () {
        showWarningAndThrow();
        return l;
    }
};
Object.defineProperty(console, "_commandLineAPI", n);
Object.defineProperty(console, "__commandLineAPI", n);

//netflix method:
(function() {
    try {
        var $_console$$ = console;
        Object.defineProperty(window, "console", {
            get: function() {
                if ($_console$$._commandLineAPI)
                    throw "Sorry, for security reasons, the script console is deactivated on netflix.com";
                return $_console$$
            },
            set: function($val$$) {
                $_console$$ = $val$$
            }
        })
    } catch ($ignore$$) {
    }
})();

//and let's annoy them a bit, because why not
window.setInterval(
    function() {
        console.log(new Date().getTime())}, 25
);
//endregion

//region right click
//let's disable their right click
if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
} else {
    document.attachEvent('oncontextmenu', function () {
        window.event.returnValue = false;
    });
}
//endregion

//region F12
//let's disable F12
$(window).keydown(function (e) {
    if (e.which === 123) {
        e.preventDefault();
    }
});
//endregion