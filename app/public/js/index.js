require.config({　　　　
    paths: {　　　　　　
        "jquery": "/jquery/dist/jquery.min",
        "bootstrap": "/bootstrap/dist/js/bootstrap.min",
        "underscore": "/underscore/underscore",
        "jquery.lazyload": "/jquery.lazyload/jquery.lazyload.min",
        "scrollup": "/scrollup/js/jquery.scrollUp.min",
        "hotkeys": "/jquery.hotkeys/jquery.hotkeys"
    },
    shim: {　　　　
        'bootstrap': {
            deps: ['jquery']　
        },
        'jquery.lazyload': {　　　　　　
            deps: ['jquery']　
        },
        'scrollup': {　　　　　　
            deps: ['jquery']　
        },
        'hotkeys': {　　　　　　
            deps: ['jquery']　
        },
    }
});

require(["jquery","bootstrap"], function($) {
    $(function() {
       console.log($('body').html());
    });
});
