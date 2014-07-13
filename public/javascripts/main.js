// Configure loading modules from the javascripts directory by default
requirejs.config({
    baseUrl: 'javascripts',
    transitive: true,
    paths: {
        //
        // this section is completed automatically by bower-requirejs in the
        // bower postinstall script hook. To manually update, run:
        //
        // ./node_modules/.bin/bower-requirejs -c public/javascripts/main.js
        //
        'blueimp-canvas-to-blob': '../bower/blueimp-canvas-to-blob/js/canvas-to-blob',
        'load-image': '../bower/blueimp-load-image/js/load-image',
        'load-image-ios': '../bower/blueimp-load-image/js/load-image-ios',
        'load-image-orientation': '../bower/blueimp-load-image/js/load-image-orientation',
        'load-image-meta': '../bower/blueimp-load-image/js/load-image-meta',
        'load-image-exif': '../bower/blueimp-load-image/js/load-image-exif',
        'load-image-exif-map': '../bower/blueimp-load-image/js/load-image-exif-map',
        'blueimp-tmpl': '../bower/blueimp-tmpl/js/tmpl',
        jquery: '../bower/jquery/dist/jquery',
        'jquery.postmessage-transport': '../bower/jquery-file-upload/js/cors/jquery.postmessage-transport',
        'jquery.xdr-transport': '../bower/jquery-file-upload/js/cors/jquery.xdr-transport',
        'jquery.ui.widget': '../bower/jquery-file-upload/js/vendor/jquery.ui.widget',
        'jquery.fileupload': '../bower/jquery-file-upload/js/jquery.fileupload',
        'jquery.fileupload-process': '../bower/jquery-file-upload/js/jquery.fileupload-process',
        'jquery.fileupload-validate': '../bower/jquery-file-upload/js/jquery.fileupload-validate',
        'jquery.fileupload-image': '../bower/jquery-file-upload/js/jquery.fileupload-image',
        'jquery.fileupload-audio': '../bower/jquery-file-upload/js/jquery.fileupload-audio',
        'jquery.fileupload-video': '../bower/jquery-file-upload/js/jquery.fileupload-video',
        'jquery.fileupload-ui': '../bower/jquery-file-upload/js/jquery.fileupload-ui',
        'jquery.fileupload-jquery-ui': '../bower/jquery-file-upload/js/jquery.fileupload-jquery-ui',
        'jquery.fileupload-angular': '../bower/jquery-file-upload/js/jquery.fileupload-angular',
        'jquery.iframe-transport': '../bower/jquery-file-upload/js/jquery.iframe-transport',
        underscore: '../bower/underscore/underscore'
    },
    packages: [

    ]
});

// setup file upload handling (upload.js)
requirejs(['upload']);

