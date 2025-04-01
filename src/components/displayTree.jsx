"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import tippy from "tippy.js"; 
import "tippy.js/dist/tippy.css"; 

export default function TreePage() {
  const svgRef = useRef(null);
  const [prerequisiteData, setPrerequisiteData] = useState(null);

  // Fetch prerequisite data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/displayTree"); 
        const data = await response.json();
        setPrerequisiteData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  if (!prerequisiteData) return;

  const { completed, locked, incomplete, requirement_satisfied } = prerequisiteData;

  const width = 928;
  const height = 900;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const courseWarnings = {
    "CSC142": "Requires CSC141",
    "CSC220": "Requires MAT151 and MAT161",
    "CSC231": "Requires CSC142 and MAT151",
    "CSC240": "Requires CSC142",
    "CSC241": "Requires CSC240, MAT151, and MAT161",
    "CSC301": "NULL",
    "CSC345": "Requires CSC220 and CSC241",
    "CSC402": "Requires CSC241",
    "CSC416": "Requires CSC220, CSC240, CSC241, and (CSC231 or CSC242)",
    "CSC417": "Requires CSC241",
    "CSC418": "Requires CSC240",
    "CSC466": "Requires CSC231 and CSC241",
    "CSC467": "Requires CSC241",
    "CSC468": "Requires CSC231",
    "CSC476": "Requires CSC241",
    "MAT151": "Core Requirement",
    "MAT161": "Core Requirement"
  };
  

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
    .force("link", d3.forceLink(links).id((d) => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-600))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .select(svgRef.current)
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
    .selectAll("g")
    .data(nodes)
    .join("g");

  node
    .append("circle")
    .attr("r", 35)
    .attr("fill", (d) => {
      if (locked.includes(d.id)) return "gray";
      if (completed.includes(d.id)) return "green";
      if (incomplete.includes(d.id)) return "red";
      if (requirement_satisfied.includes(d.id)) return "purple";
      return "red";
    });

  node
    .append("text")
    .attr("dx", 0)
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text((d) => d.id);

  node.each(function (d) {
    if (locked.includes(d.id)) {
      tippy(this, {
        content: courseWarnings[d.id] || "No additional info",
        delay: [100, 0],
      });
    }
  });

  const drag = d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

  node.call(drag);

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
}, [prerequisiteData]);


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
      <svg ref={svgRef} />
    </div>
  );
}
