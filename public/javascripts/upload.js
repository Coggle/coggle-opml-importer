
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

        console.log('upload done, data:', data.result);
        if(data.result.error){
        }

        for(filename in data.result.results){
            if(data.result.results.hasOwnProperty(filename)){
                var result = data.result.results[filename];
                var url = result.url;

                console.log('uploaded:', filename, url);
                if(url){
                    // !!! FIXME: find the child with the right filename (add
                    // and select by attribute?)
                    $(data.context.children()[0]).wrap(
                        $('<a>')
                            .attr('target', '_blank')
                            .prop('href', url)
                    );
                }else{
                    // !!! FIXME: find the child with the right filename (add
                    // and select by attribute?)
                    var error = $('<span class="text-danger"/>').text(result.message);
                    $(data.context.children()[0]).append('<br>').append(error);
                }
            }
        }
    }).on('fileuploadfail', function(e, data){
        $.each(data.files, function(index, file){
            var error = $('<span class="text-danger"/>').text('Upload failed.');
            $(data.context.children()[index]).append('<br>').append(error);
        });
    });
});


