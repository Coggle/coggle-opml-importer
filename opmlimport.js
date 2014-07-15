/** vim: et:ts=2:sw=2:sts=2
 * @license Coggle OPML Importer Copyright (c) 2014, CoggleIt Limited. All Rights Reserved.
 * Licensed under the MIT license, http://opensource.org/licenses/MIT
 */
var libxmljs  = require('libxmljs');
var CoggleApi = require('coggle');
var async     = require('async');
var _         = require('underscore');

// !!! FIXME: need better layout!
function addChildrenRecursive(opml_element, diagram_node, cb){
  var children = _.filter(
    opml_element.childNodes(),
    function(el){
      return el.name().toLowerCase() === 'outline';
    }
  );

  var x_off = 150;
  var y_off = 0;
  var y_space = 50;

  async.each(children, function(child_el, callback){
    var text = child_el.attr('text');
    var url  = child_el.attr('url');
    
    text = (text && text.value()) || '';
    url  = (url && url.value()) || '';

    // if we have a URL, add it as a Markdown URL around the first line of text
    if(url){
      text = '[' + first_line + '](' + url + ')\n' + remaining_lines;
    }
    diagram_node.addChild(text, {x:x_off, y:y_off}, function(err, node){
      if(err)
        return cb(err);
      addChildrenRecursive(child_el, node, cb);
    });
    y_off += y_space;

  }, cb);
}

function importOutlineToCoggle(root_el, diagram, callback){

  // get the root node of the diagram in order to add child nodes to it: since
  // we just created the diagram we know that the root node is the one and only
  // node in it
  diagram.getNodes(function(err, nodes){
    if(err)
      return callback(err);
    var root_node = nodes[0];
    
    addChildrenRecursive(root_el, root_node, function(err){
        callback(err, diagram.webUrl());
    });
  });
}


exports.process = function(opml_data, acess_token, callback){
  // Create a Coggle API Client, see https://github.com/coggle/coggle-js for
  // documentation
  var coggle = new CoggleApi({
    token: acess_token
  });
    
  // Parse the OPML using libxmljs
  var doc  = libxmljs.parseXmlString(opml_data.toString());
  var title = doc.get('//title');
  var body = doc.get('//body');

  if(!body){
    return callback(new Error("Failed to parse OPML."));
  }
  
  // Create a new Coggle diagram with the same title as the OPML document, if
  // it had a title
  var title_text = (title && title.text()) || "Imported OPML Outline";

  coggle.createDiagram(title_text, function(err, diagram){
    if(err)
      return callback(err);
    importOutlineToCoggle(body, diagram, callback);
  });
    
  /*
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
  */
};
