/** vim: et:ts=2:sw=2:sts=2
 * @license Coggle OPML Importer Copyright (c) 2014, CoggleIt Limited. All Rights Reserved.
 * Licensed under the MIT license, http://opensource.org/licenses/MIT
 */
var libxmljs  = require('libxmljs');
var CoggleApi = require('coggle');
var async     = require('async');
var _         = require('underscore');

var y_space = 20;
var x_space = 150;

function elementIsOutlineElement(el){
  return el.name().toLowerCase() === 'outline';
}

function addChildrenRecursive(opml_element, diagram_node, cb){
  var children = _.filter(
    opml_element.childNodes(), elementIsOutlineElement
  );

  console.log('add children recursive:', opml_element.estimated_width, opml_element.estimated_height);
  var y_off = -(opml_element.estimated_height || 0) / 2;
  var x_off = x_space;

  async.eachSeries(children, function(child_el, callback){
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
        return callback(err);
      addChildrenRecursive(child_el, node, callback);
    });
    y_off += y_space + child_el.estimated_height;

  }, cb);
}

function estimateSizeOfText(text, level){
  // approximate Coggle text sizes at different levels:
  var textsize = [17, 15.3, 13, 11, 9.4, 9][Math.min(level, 5)];
  return {
     width: text.length * textsize, // very approximate! really we should use proper font metrics here
    height: textsize
  };
}

function tagWithSizesRecursive(el, level){
  var children_total_height = 0;
  var children = _.filter(el.childNodes(), elementIsOutlineElement);

  for(var i = 0; i < children.length; i++){
    var child = children[i];
    tagWithSizesRecursive(child, level+1);

    children_total_height += child.estimated_height;

    if(i+1 < children.length)
      children_total_height += y_space;
  }

  var text = el.attr('text');
  text = (text && text.value()) || '';
  var own_size = estimateSizeOfText(text, level);

  el.estimated_width  = own_size.width;
  el.estimated_height = own_size.height + children_total_height;
}

function importOutlineToCoggle(root_el, diagram, callback){

  // get the root node of the diagram in order to add child nodes to it: since
  // we just created the diagram we know that the root node is the one and only
  // node in it
  diagram.getNodes(function(err, nodes){
    if(err)
      return callback(err);
    var root_node = nodes[0];
    
    // add .estimated_width and .estimated_height tags for each branch
    tagWithSizesRecursive(root_el, 0);

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
};
