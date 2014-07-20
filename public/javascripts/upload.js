
requirejs(['jquery', 'jquery.fileupload', 'jquery.fileupload-process', 'jquery.fileupload-validate'], function($){
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
        maxNumberOfFiles: 10,
                 timeout: 180000

    }).on('fileuploadprocessalways', function (e, data) {
        data.context = $('<div class="file"/>').appendTo('#files');
        $.each(data.files, function(index, file) {
            if(file.error){
                $('<span class="error"/>')
                    .text(file.error)
                    .appendTo(data.context);
            }else{
                $('<p/>')
                    .attr('filename', file.name)
                    .append($('<span/>')
                    .text(file.name))
                    .append(spinner())
                    .appendTo(data.context);
            }
        });
    }).on('fileuploaddone',  function(e, data){
        console.log('upload done, data:', data.result);

        for(filename in data.result.results){
            if(data.result.results.hasOwnProperty(filename)){
                var result = data.result.results[filename];
                var url = result.url;
                
                item = $('#files').find('[filename="' + filename + '"]');
                item.find('.spinner').remove();
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
            var item = $('#files').find('[filename="' + file.name + '"]');
            item.append('<br>').append(error);
            item.find('.spinner').remove();
        });
    });
});


