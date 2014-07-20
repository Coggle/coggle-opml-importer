
requirejs(['jquery', 'jquery.fileupload'], function($){
    var url = 'upload';

    function spinner(){
        return $('<div class="spinner"/>')
                .append($('<div class="bounce1"/>'))
                .append($('<div class="bounce2"/>'))
                .append($('<div class="bounce3"/>'));
    }

    $('#drop-target').fileupload({
                     url: url,
                dataType: 'json',
         acceptFileTypes: /\.opml$/i,
             maxFileSize: 200000,
        maxNumberOfFiles: 10
    }).on('fileuploadadd', function (e, data) {
        data.context = $('<div class="file"/>').appendTo('#files');
        $.each(data.files, function (index, file) {
            $('<p/>')
                .attr('filename', file.name)
                .append($('<span/>')
                .text(file.name))
                .append(spinner())
                .appendTo(data.context);
                
        });
    }).on('fileuploadprogressall', function(e, data){
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width', progress + '%'
        );
    }).on('fileuploaddone',  function(e, data){

        console.log('upload done, data:', data.result);

        for(filename in data.result.results){
            if(data.result.results.hasOwnProperty(filename)){
                var result = data.result.results[filename];
                var url = result.url;

                item = $(data.context.find('[filename="' + filename + '"]'));
                if(url){
                    item.wrap(
                        $('<a>')
                            .attr('target', '_blank')
                            .prop('href', url)
                    );
                }else{
                    var error = $('<span class="error"/>').text(result.message);
                    item.append('<br>').append(error);
                }
            }
        }
    }).on('fileuploadfail', function(e, data){
        $.each(data.files, function(index, file){
            var error = $('<span class="error"/>').text('Upload failed.');
            var item = $(data.context.children()[index]);
            item.append('<br>').append(error);
            item.find('.spinner').remove();
        });
    });
});


