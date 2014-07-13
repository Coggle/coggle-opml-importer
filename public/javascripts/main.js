// Configure loading modules from the javascripts directory by default
//
// NOTE the "paths" section is completed automatically by bower-requirejs in
// the bower postinstall script hook. To manually update, run:
// ./node_modules/.bin/bower-requirejs -c public/javascripts/main.js
// 
requirejs.config({
    baseUrl: 'javascripts',
    paths: {
        'blueimp-canvas-to-blob': '../bower/blueimp-canvas-to-blob/js/canvas-to-blob',
        'load-image': '../bower/blueimp-load-image/js/load-image',
        'load-image-ios': '../bower/blueimp-load-image/js/load-image-ios',
        'load-image-orientation': '../bower/blueimp-load-image/js/load-image-orientation',
        'load-image-meta': '../bower/blueimp-load-image/js/load-image-meta',
        'load-image-exif': '../bower/blueimp-load-image/js/load-image-exif',
        'load-image-exif-map': '../bower/blueimp-load-image/js/load-image-exif-map',
        'blueimp-tmpl': '../bower/blueimp-tmpl/js/tmpl',
        jquery: '../bower/jquery/dist/jquery',
        underscore: '../bower/underscore/underscore'
    },
    packages: [

    ]
});

requirejs(['jquery', 'underscore'], function($, _){
    console.log('main loaded!');
});


