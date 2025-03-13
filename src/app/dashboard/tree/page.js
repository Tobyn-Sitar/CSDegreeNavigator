"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TreePage() {
  const svgRef = useRef(null); // Using ref to append SVG in React way

  useEffect(() => {
    const width = 928;
    const height = 680;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const data = {
      nodes: [
        { id: "Core", group: 1 },
        { id: "Math", group: 1 },
        { id: "Large Scale", group: 1 },
        { id: "CSC145", group: 1 },
        { id: "CSC142", group: 1 },
        { id: "CSC143", group: 2 },
        { id: "CSC144", group: 2 },
        { id: "CSC146", group: 2 },
        { id: "CSC147", group: 1 },
        { id: "CSC148", group: 2 },
      ],
      links: [
        { source: "Core", target: "CSC142", value: 1 },
        { source: "Core", target: "CSC143", value: 1 },
        { source: "CSC145", target: "CSC146", value: 1 },
        { source: "CSC147", target: "CSC148", value: 1 },
      ],
    };

    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(80)) // Increased link distance
      .force("charge", d3.forceManyBody().strength(-2000)) // Increased repulsion force
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3
      .select(svgRef.current) // Use the ref to select the SVG
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g") // Use "g" to group the circle and text together
      .data(nodes)
      .join("g"); // Join data and group the elements

    // Add circles for nodes
    node
      .append("circle")
      .attr("r", 35) // Increase the radius if needed
      .attr("fill", (d) => color(d.group));

    // Add text to nodes
    node
      .append("text")
      .attr("dx", 0) // Center the text horizontally
      .attr("dy", 5) // Center the text vertically (adjust as necessary)
      .attr("text-anchor", "middle")
      .text((d) => d.id); // Display the node id as the text

    // Title for hover tooltip
    node.append("title").text((d) => d.id);

    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup function to remove the svg on component unmount
    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center" }}>Force-Directed Graph</h1>
      <svg ref={svgRef} />
    </div>
  );
}
