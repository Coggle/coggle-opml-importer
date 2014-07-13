
requirejs(['jquery', 'jquery.fileupload'], function($){
    var url = 'upload';
    $('#drop-target').fileupload({
                     url: url,
                dataType: 'json',
         acceptFileTypes: /\.opml$/i,
             maxFileSize: 200000,
        maxNumberOfFiles: 10
    }).on('fileuploadadd', function (e, data) {
        data.context = $('<div/>').appendTo('#files');
        $.each(data.files, function (index, file) {
            $('<p/>')
                .append($('<span/>')
                .text(file.name))
                .appendTo(data.context);
        });
    }).on('fileuploadprogressall', function(e, data){
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width', progress + '%'
        );
    }).on('fileuploaddone',  function(e, data){
        $.each(data.result.files, function(index, file){
            console.log('uploaded:', file.name);
            if(file.url){
                $(data.context.children()[index]).wrap(
                    $('<a>')
                        .attr('target', '_blank')
                        .prop('href', file.url)
                );
            }else if(file.error){
                var error = $('<span class="text-danger"/>').text(file.error);
                $(data.context.children()[index]).append('<br>').append(error);
            }
        });
    }).on('fileuploadfail', function(e, data){
        $.each(data.files, function(index, file){
            var error = $('<span class="text-danger"/>').text('Upload failed.');
            $(data.context.children()[index]).append('<br>').append(error);
        });
    });
});


