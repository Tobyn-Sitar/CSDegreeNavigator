"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ExpandedTree() {
  const svgRef = useRef(null);

  useEffect(() => {
    // Define the chart dimensions
    const width = 928;
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 60;

    // Data for the tree structure
    const data = {
      name: "Courses",
      children: [
        {
          name: "Core",
          children: [
            { name: "CSC141" },
            { name: "CSC142" },
            { name: "CSC220" },
            { name: "CSC231" },
            { name: "CSC240" },
            { name: "CSC241" },
            { name: "CSC301" },
            { name: "CSC345" },
            { name: "CSC402" }
          ]
        },
        {
          name: "Math",
          children: [
            { name: "MAT121" },
            { name: "MAT151" },
            { name: "MAT161" },
            { name: "MAT162" },
            { name: "STA200" }
          ]
        },
        {
          name: "Communication",
          children: [
            { name: "ENG368" },
            { name: "ENG371" },
            { name: "SPK208" },
            { name: "SPK230" },
            { name: "SPK199" }
          ]
        },
        {
          name: "Science",
          children: [
            { name: "BIO110" },
            { name: "CHE103" },
            { name: "CRL103" },
            { name: "ESS101" },
            { name: "PHY130" },
            { name: "PHY170" }
          ]
        },
        {
          name: "Large Scale",
          children: [
            { name: "CSC416" },
            { name: "CSC417" },
            { name: "CSC418" },
            { name: "CSC466" },
            { name: "CSC467" },
            { name: "CSC468" },
            { name: "CSC476" },
            { name: "CSC496" }
          ]
        }
      ]
    };

    // Convert the data into a hierarchy
    const root = d3.hierarchy(data);
    
    // Set dx and dy for the tree layout
    const dx = 10;
    const dy = (width - marginRight - marginLeft) / (1 + root.height);

    // Define the tree layout
    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;");

    // Clear the previous tree and start fresh with each render
    svg.selectAll("*").remove();

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    function update(event, source) {
      const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + marginTop + marginBottom;

      const transition = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

      // Update the nodes
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

      const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

      nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white")
        .attr("paint-order", "stroke");

      // Transition nodes to their new position
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position
      const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Update the links
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

      const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

      link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Do the first update to the initial configuration of the tree
    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    update(null, root);

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
      <svg ref={svgRef} />
    </div>
  );
}
