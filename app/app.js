'use strict';

(function bfD3() { // START IFEE

  /* Define area and inital values */
  // var d3;
  var w = 1060,
      h = 720,
      maxNodeSize = 50,
      x_browser = 20,
      y_browser = 25,
      root;

  var vis;
  var force = d3.layout.force();

  /* Text Color */
  var textColor = "#130C0E";

  /* Append svg with html attribute */
  vis = d3.select("#vis").append("svg").attr("width", w).attr("height", h);

  /* Data and position of nodes(data) */
  d3.json("data.json", function(json) { //START d3.json
    root = json;
    root.fixed = true;
    root.x  = w/2;
    root.y = h/4;

  /* Build the path */
  var defs = vis.insert("svg:defs")
    .data(["end"]);

  defs.enter().append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

    update();

}); //CLOSE d3.json

/**************************
Start Update Function
**************************/
function update() { // START FUNCTION  UPDATE
    var nodes = flatten(root),
        links = d3.layout.tree().links(nodes);

  /* Restart the force layout */
  force.nodes(nodes)
    .links(links)
    .gravity(0.05)
    .charge(-1100)
    .linkDistance(160)
    .friction(0.6)
    .linkStrength(function(l, i) {
      return 1;
    })
    .size([w, h])
    .on("tick", tick)
    .start();

  var path = vis.selectAll("path.link")
    .data(links, function(d) {
      return d.target.id;
    });

    path.enter().insert("svg:path")
      .attr("class", "link")
      .style("stroke", "#eee");

    /* Exit old paths */
    path.exit().remove();

  /* Update nodes */
  var node = vis.selectAll("g.node")
    .data(nodes, function(d) {
      return d.id;
    });

  /* Enter any new nodes. */
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .on("click", click)
      .call(force.drag);

  /* Append a circle */
  nodeEnter.append("svg:circle")
    .attr("r", function(d) {
      return Math.sqrt(d.size)/5 || 4.5;
    })
    .style("fill", "#eee");

  /* Append Images */
  var images = nodeEnter.append("svg:image")
    .attr("xlink:href", function(d) {
      return d.img;
    })
    .attr("x", function(d) {
      return -25;
    })
    .attr("y", function(d) {
      return -25;
    })
    .attr("height", 50)
    .attr("width", 50);

  /* Hover over image and make picture big, add text */
  var setEvents = images
    /* Append artist name */
    .on('click', function(d) {
      d3.select("h1").html(d.shoeName);
      d3.select("h2").html("Artist Name: " + d.name);
      d3.select("h3").html("About: " + d.about);
      d3.select("h4").html("Shop your favorite bucketfeet shoes: " + "<a href='" + d.link + "' >" + d.shoeName + "</a>");
    })
    .on('mouseenter', function() {
      /* Select element */
      d3.select(this)
        .transition()
        .attr("x", function(d) {
          return -60;
        })
        .attr("y", function(d) {
          return -60;
        })
        .attr("height", 400)
        .attr("width", 400);
    })
    /* Set back to initial state */
    .on('mouseleave', function() {
      d3.select(this)
        .transition()
        .attr("x", function(d) {
          return -25;
        })
        .attr("y", function(d){
          return -25;
        })
        .attr("height", 50)
        .attr("width", 50);
    });

  /* Append shoename on roll over next to the node */
  nodeEnter.append("text")
      .attr("class", "nodetext")
      .attr("x", x_browser)
      .attr("y", y_browser + 15)
      .attr("fill", textColor)
      .text(function(d) {
        return d.shoeName; 
      });

  /* Exit old nodes */
  node.exit().remove();

  /* Reselect for update */
  path = vis.selectAll("path.link");
  node = vis.selectAll("g.node");

  function tick() {
    path.attr("d", function(d) {
      var dx = d.target.x - d.source.x,
           dy = d.target.y - d.source.y,
           dr = Math.sqrt(dx * dx + dy * dy);
           return   "M" + d.source.x + "," 
            + d.source.y 
            + "A" + dr + "," 
            + dr + " 0 0,1 " 
            + d.target.x + "," 
            + d.target.y;
    });
      node.attr("transform", nodeTransform);
  } 

} // FINISH FUNCTION UPDATE

/* Coordinates of the border for keeping the nodes inside a frame */
function nodeTransform(d) {
  d.x =  Math.max(maxNodeSize, Math.min(w - (d.imgwidth/2 || 16), d.x));
    d.y =  Math.max(maxNodeSize, Math.min(h - (d.imgheight/2 || 16), d.y));
    return "translate(" + d.x + "," + d.y + ")";
   }

/* Toggle markets (children) on click */
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  update();
}

/* Returns a list of all nodes under the data(root) */
function flatten(root) {
  var nodes = []; 
  var i = 0;
 
  function recurse(node) {
    if (node.children) 
      node.children.forEach(recurse);
    if (!node.id) 
      node.id = ++i;
    nodes.push(node);
  }
 
  recurse(root);
  return nodes;
} 

}) (); // CLOSE IFEE