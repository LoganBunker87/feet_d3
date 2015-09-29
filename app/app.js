'use strict';

(function artD3() {

  //Define area and inital values
  var w = 960,
      h = 800,
      maxnodeSize = 50,
      x_browser = 20,
      y_browser = 25,
      root;

  var vis;
  var force = d3.layout.force();

  //Append svg with html attribute
  vis = d3.select("#vis").append("svg").attr("width", w).attr("height", h);

  //Data and position of nodes(data)
  d3.json("data.json", function(json) {
    root = json;
    root.fixed = true;
    root.x  = w/2;
    root.y = h/4;
  });


}) ();