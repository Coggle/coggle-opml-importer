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

function addChildrenRecursive(new_node, diagram_node, cb){
  var y_off = 0;

  async.eachSeries(new_node.children, function(new_child, callback){
    var text = new_child.text;
    var url  = new_child.url;

    var first_line = text.split('\n')[0];
    // if we have a URL, aud it as a Markdown URL around the first line of text
    if(url){
      text = '[' + first_line + '](' + url + ')\n' + text.slice(first_line.length);
    }
    y_off += y_space;
    // we don't re-arrange the whole diagram using the .arrange() function
    // provided by the API, so this x/y positioning is only temporary
    diagram_node.addChild(text, {x:x_space, y:y_off}, function(err, node){
      if(err)
        return callback(err);
      addChildrenRecursive(new_child, node, callback);
    });
  }, cb);
}

function filterNodesRecursive(el, level){
  var child_els = _.filter(el.childNodes(), elementIsOutlineElement);
  var node = {};
  var child_nodes = [];

  for(var i = 0; i < child_els.length; i++){
    child_nodes.push(filterNodesRecursive(child_els[i], level+1));
  }

  node.text = el.attr('text');
  node.text = (node.text && node.text.value()) || '';
  node.url = el.attr('url');
  node.url = (node.url && node.url.value()) || '';
  node.children = child_nodes;

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
    
    // convert the OPML into an object representation looking like:
    // {text:"", children:[...]}
    root_to_add = filterNodesRecursive(root_el, 0);

    addChildrenRecursive(root_to_add, diagram_root_node, function(err){
      if(err)
        return callback(err);
      diagram.arrange(function(err){
        callback(err, diagram.webUrl());
      });
    });
  });
}


exports.process = function(opml_data, acess_token, callback){
  // Create a Coggle API Client, see https://github.com/coggle/coggle-js for
  // documentation
  var coggle = new CoggleApi({
    token: acess_token,
 base_url: "http://localdev.coggle.it"
  });
    
  // Parse the OPML using libxmljs
  var doc;
  try{
    doc  = libxmljs.parseXmlString(opml_data.toString());
  }catch(e){
    return callback(new Error("Not a valid OPML file: " + e.message));
  }
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
