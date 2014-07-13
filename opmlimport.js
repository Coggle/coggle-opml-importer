var libxmljs  = require('libxmljs');
var CoggleApi = require('coggle');


exports.process = function(opml_data, callback){
    var doc  = libxmljs.parseXmlString(opml_data.toString());
    var body = doc.get('//body');

    function printOutlineRecursive(el, indent){
        var text = el.attr('text');
        var url  = el.attr('url');
        
        text = (text && text.value()) || '';
        url  = (url && url.value()) || '';

        console.log(Array(indent+1).join(' '), text, url);
        var children = el.childNodes();
        for(var i = 0; i < children.length; i++){
            if(children[i].name().toLowerCase() === 'outline'){
                printOutlineRecursive(children[i], indent+2);
            }
        }
    }
    printOutlineRecursive(body, 0);

    callback();
};
