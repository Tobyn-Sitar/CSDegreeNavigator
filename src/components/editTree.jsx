"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import tippy from "tippy.js"; // Import Tippy.js
import "tippy.js/dist/tippy.css"; // Import Tippy.js CSS

export default function TreePage() {
  const svgRef = useRef(null);
  const [greenNodes, setGreenNodes] = useState([]); // State to track green nodes

  useEffect(() => {
    const width = 928;
    const height = 900;

    const data = {
      nodes: [
        { id: "Core", group: 1 },
        { id: "Communication", group: 1 },
        { id: "Math", group: 1 },
        { id: "Science", group: 1 },
        { id: "Large Scale", group: 1 },
        { id: "CSC141", group: 2 },
        { id: "CSC142", group: 2 },
        { id: "CSC220", group: 2 },
        { id: "CSC231", group: 2 },
        { id: "CSC240", group: 2 },
        { id: "CSC241", group: 2 },
        { id: "CSC301", group: 2 },
        { id: "CSC345", group: 2 },
        { id: "CSC402", group: 2 },
        { id: "MAT121", group: 3 },
        { id: "MAT151", group: 3 },
        { id: "MAT161", group: 3 },
        { id: "MAT162", group: 3 },
        { id: "STA200", group: 3 },
        { id: "ENG368", group: 4 },
        { id: "ENG371", group: 4 },
        { id: "SPK208", group: 4 },
        { id: "SPK230", group: 4 },
        { id: "SPK199", group: 4 },
        { id: "BIO110", group: 5 },
        { id: "CHE103", group: 5 },
        { id: "CRL103", group: 5 },
        { id: "ESS101", group: 5 },
        { id: "PHY130", group: 5 },
        { id: "PHY170", group: 5 },
        { id: "CSC416", group: 6 },
        { id: "CSC417", group: 6 },
        { id: "CSC418", group: 6 },
        { id: "CSC466", group: 6 },
        { id: "CSC467", group: 6 },
        { id: "CSC468", group: 6 },
        { id: "CSC476", group: 6 },
        { id: "CSC496", group: 6 },
      ],
      links: [
        { source: "Core", target: "CSC141", value: 1 },
        { source: "Core", target: "CSC142", value: 1 },
        { source: "Core", target: "CSC220", value: 1 },
        { source: "Core", target: "CSC231", value: 1 },
        { source: "Core", target: "CSC240", value: 1 },
        { source: "Core", target: "CSC241", value: 1 },
        { source: "Core", target: "CSC301", value: 1 },
        { source: "Core", target: "CSC345", value: 1 },
        { source: "Core", target: "CSC402", value: 1 },
        { source: "Math", target: "MAT121", value: 1 },
        { source: "Math", target: "MAT151", value: 1 },
        { source: "Math", target: "MAT161", value: 1 },
        { source: "Math", target: "MAT162", value: 1 },
        { source: "Math", target: "STA200", value: 1 },
        { source: "Communication", target: "ENG368", value: 1 },
        { source: "Communication", target: "ENG371", value: 1 },
        { source: "Communication", target: "SPK208", value: 1 },
        { source: "Communication", target: "SPK230", value: 1 },
        { source: "Communication", target: "SPK199", value: 1 },
        { source: "Science", target: "BIO110", value: 1 },
        { source: "Science", target: "CHE103", value: 1 },
        { source: "Science", target: "CRL103", value: 1 },
        { source: "Science", target: "ESS101", value: 1 },
        { source: "Science", target: "PHY130", value: 1 },
        { source: "Science", target: "PHY170", value: 1 },
        { source: "Large Scale", target: "CSC416", value: 1 },
        { source: "Large Scale", target: "CSC417", value: 1 },
        { source: "Large Scale", target: "CSC418", value: 1 },
        { source: "Large Scale", target: "CSC466", value: 1 },
        { source: "Large Scale", target: "CSC467", value: 1 },
        { source: "Large Scale", target: "CSC468", value: 1 },
        { source: "Large Scale", target: "CSC476", value: 1 },
        { source: "Large Scale", target: "CSC496", value: 1 },
      ],
    };

    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(100)) // Increased link distance
      .force("charge", d3.forceManyBody().strength(-600)) // Increased repulsion force
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

    node
      .append("circle")
      .attr("r", 35) // Increase the radius if needed
      .attr("fill", "red") // Set initial color to red for all nodes
      .on("click", function (event, d) {
        // Toggle color on click
        const currentColor = d3.select(this).attr("fill");
        const newColor = currentColor === "red" ? "green" : "red";
        d3.select(this).attr("fill", newColor);

        // Update the list of green nodes
        setGreenNodes((prevGreenNodes) => {
          const updatedGreenNodes = newColor === "green"
            ? [...prevGreenNodes, d.id]
            : prevGreenNodes.filter((id) => id !== d.id);
          return updatedGreenNodes;
        });
      });

    // Add text to nodes
    node
      .append("text")
      .attr("dx", 0) // Center the text horizontally
      .attr("dy", 5) // Center the text vertically (adjust as necessary)
      .attr("text-anchor", "middle")
      .text((d) => d.id); // Display the node id as the text

    // Apply tooltips with Tippy.js
    node.each(function (d) {
      tippy(this, {
        content: d.id, // Tooltip content
        arrow: true, // Show arrow in tooltip
        placement: 'top', // Position of the tooltip
      });
    });

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

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, []);

  const handleSubmit = async () => {
    // Define a mapping for center node names to their desired lowercase forms
    const centerNodeMapping = {
        Core: "core",
        Math: "math",
        Communication: "communication",
        Science: "science",
        "Large Scale": "large_scale"
    };

    // Map over all green nodes and convert center nodes to lowercase while keeping others uppercase
    const formattedGreenNodes = greenNodes.map((node) => {
        // If it's a center node, map to lowercase; otherwise, keep it uppercase
        return centerNodeMapping[node] || node.toUpperCase(); 
    });

    console.log("Formatted Green Nodes:", formattedGreenNodes);  // Log the formatted array

    // Send the selected courses to the backend
    try {
        const response = await fetch('/api/sendTree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ greenNodes: formattedGreenNodes })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || "Courses successfully updated!");
        } else {
            alert(result.error || "Failed to update courses");
        }
    } catch (error) {
        console.error("Error sending data:", error);
        alert("Error sending data");
    }
};


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
      <svg ref={svgRef} />
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Submit Courses
      </button>
    </div>
  );
}
