/** vim: et:ts=2:sw=2:sts=2
 * @license Coggle OPML Importer Copyright (c) 2014, CoggleIt Limited. All Rights Reserved.
 * Licensed under the MIT license, http://opensource.org/licenses/MIT
 */
var libxmljs  = require('libxmljs');
var CoggleApi = require('coggle');
var async     = require('async');
var _         = require('underscore');

var y_space = 10;
var x_space = 150;

function elementIsOutlineElement(el){
  return el.name().toLowerCase() === 'outline';
}

function xOffsetForChild(base_x_off, y_off, parent_height){
  // Calculate the x-offset necessary for a child with a given vertical offset
  var Arc_Angle = 60 * Math.PI / 180;
  var radius = parent_height / (2 * Math.sin(Arc_Angle/2));
  //
  //                                                         _
  //                                                    _-"  | |
  //                                               _-"       |   + - - - - -
  //                                          _-"            |   ||        |
  //                                     _-"                 |   | |       |
  //                                _-"              parent  |   | |       |
  //                           _-"                  height/2 |   |  |      |
  //                      _-"                                |   |  |      | y_off
  //                 _-"\                                    |   |   |     |
  //            _-"       \                                  |   |   |     |
  //       _-"             \                                 |   |   |     |
  //  _-"     Arc_Angle/2   |                                |   |   |     |
  // -----------------------|--------------------------------|---|---| - - -
  // :                                                       : dx:   :
  // :                                                       :   :   :
  // :                  radius * Math.cos(Arc_Angle/2)       :   :   :
  // |-------------------------------------------------------|   :   :
  // :                                                           :   :
  // :          sqrt(radius*radius - y_off*y_off/4)              :   :
  // |-----------------------------------------------------------|   :
  // :                                                               :
  // :                             radius                            :
  // |---------------------------------------------------------------|
  //
  var dx = Math.sqrt(radius*radius - y_off*y_off) - radius * Math.cos(Arc_Angle/2);
  
  return base_x_off + dx;
}

function addChildrenRecursive(new_node, diagram_node, cb){

  console.log('add children recursive:', new_node.estimated_width, new_node.estimated_height);
  var y_off = -(new_node.estimated_height || 0) / 2;
  var base_x_off = x_space;

  async.eachSeries(new_node.children, function(new_child, callback){
    var text = new_child.text;
    var url  = new_child.url;

    var first_line = text.split('\n')[0];
    // if we have a URL, aud it as a Markdown URL around the first line of text
    if(url){
      text = '[' + first_line + '](' + url + ')\n' + text.slice(first_line.length);
    }
    // calculate a nice horizontal position for this child
    var x_off = xOffsetForChild(base_x_off, y_off, new_node.estimated_height);
    // place the parent item in the middle vertically compared to the child
    // items:
    y_off += (y_space + new_child.estimated_height) / 2;
    diagram_node.addChild(text, {x:x_off, y:y_off}, function(err, node){
      if(err)
        return callback(err);
      addChildrenRecursive(new_child, node, callback);
    });
    y_off += (y_space + new_child.estimated_height) / 2;

  }, cb);
}

function estimateSizeOfText(text, level){
  // approximate Coggle text sizes at different levels:
  var textsize = [17, 15.3, 13, 11, 9.4, 9][Math.min(level, 5)];
  var lines = text.split('\n').length;
  return {
     width: text.length * textsize, // very approximate! really we should use proper font metrics here
    height: textsize * 1.5 * lines
  };
}

function calculateNodeLayoutRecursive(el, level){
  var children_total_height = 0;
  var child_els = _.filter(el.childNodes(), elementIsOutlineElement);
  var node = {};
  var child_nodes = [];

  for(var i = 0; i < child_els.length; i++){
    child_nodes.push(calculateNodeLayoutRecursive(child_els[i], level+1));
  }
  children_total_height = _.reduce(
      _.map(child_nodes, function(n){return n.estimated_height;}),
      function(a, b){return a + y_space + b;},
      0
  );

  node.text = el.attr('text');
  node.text = (node.text && node.text.value()) || '';
  node.url = el.attr('url');
  node.url = (node.url && node.url.value()) || '';
  node.children = child_nodes;

  var own_size = estimateSizeOfText(node.text, level);

  node.estimated_width  = own_size.width;
  node.estimated_height = own_size.height + children_total_height;

  return node;
}

function importOutlineToCoggle(root_el, diagram, callback){

  // get the root node of the diagram in order to add child nodes to it: since
  // we just created the diagram we know that the root node is the one and only
  // node in it
  diagram.getNodes(function(err, nodes){
    if(err)
      return callback(err);
    var diagram_root_node = nodes[0];
    
    // add .estimated_width and .estimated_height tags for each branch
    root_to_add = calculateNodeLayoutRecursive(root_el, 0);

    addChildrenRecursive(root_to_add, diagram_root_node, function(err){
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
