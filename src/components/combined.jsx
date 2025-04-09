"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Combined = () => {
  const svgRef = useRef(null);
  const [selectedCourses, setSelectedCourses] = useState([1, 2]);

  // Data for courses and their prerequisites
  const coursesData = [
    { "id": "MAT151", "name": "MAT151 - Discrete Mathematics", "prerequisites": [], "defaultSemester": 2 },
    { "id": "MAT161", "name": "MAT161 - Calculus I", "prerequisites": [], "defaultSemester": 3 },
    { "id": "CSC141", "name": "CSC141 - Computer Science I (Python)", "prerequisites": [], "defaultSemester": 1 },
    { "id": "CSC142", "name": "CSC142 - Computer Science II (Java)", "prerequisites": ["CSC141"], "defaultSemester": 2 },
    { "id": "CSC220", "name": "CSC220 - Foundations of Computer Science", "prerequisites": ["CSC240", "MAT151", "MAT161"], "defaultSemester": 4 },
    { "id": "CSC231", "name": "CSC231 - Computer Systems", "prerequisites": ["CSC142", "MAT151"], "defaultSemester": 3 },
    { "id": "CSC240", "name": "CSC240 - Computer Science III", "prerequisites": ["CSC142"], "defaultSemester": 3 },
    { "id": "CSC241", "name": "CSC241 - Data Structures and Algorithms", "prerequisites": ["CSC240", "MAT151", "MAT161"], "defaultSemester": 4 },
    { "id": "CSC301", "name": "CSC301 - Computer Security & Ethics", "prerequisites": [], "defaultSemester": 5 },
    { "id": "CSC302", "name": "CSC302 - Computer Security", "prerequisites": ["CSC301", "CSC335"], "defaultSemester": 6 },
    { "id": "CSC317", "name": "CSC317 - Introduction to Digital Image Process", "prerequisites": ["CSC240"], "defaultSemester": 4 },
    { "id": "CSC321", "name": "CSC321 - Database Management Systems", "prerequisites": ["CSC241"], "defaultSemester": 5 },
    { "id": "CSC331", "name": "CSC331 - Operating Systems", "prerequisites": ["CSC231", "CSC241", "CSC220"], "defaultSemester": 7 },
    { "id": "CSC335", "name": "CSC335 - Data Communications and Networking I", "prerequisites": ["CSC241"], "defaultSemester": 6 },
    { "id": "CSC345", "name": "CSC345 - Programming Language Concepts and Paradigms", "prerequisites": ["CSC220", "CSC241"], "defaultSemester": 5 },
    { "id": "CSC381", "name": "CSC381 - Data Science", "prerequisites": ["CSC240", "CSC241"], "defaultSemester": 7 },
    { "id": "CSC400", "name": "CSC400 - Internship", "prerequisites": ["CSC241"], "defaultSemester": 8 },
    { "id": "CSC402", "name": "CSC402 - Software Engineering Capstone", "prerequisites": ["CSC241"], "defaultSemester": 6 },
    { "id": "CSC404", "name": "CSC404 - Software Testing", "prerequisites": ["CSC402"], "defaultSemester": 8 },
    { "id": "CSC416", "name": "CSC416 - Design and Construction of Compilers", "prerequisites": ["CSC220", "CSC231"], "defaultSemester": 7 },
    { "id": "CSC417", "name": "CSC417 - User Interfaces", "prerequisites": ["CSC241"], "defaultSemester": 7 },
    { "id": "CSC418", "name": "CSC418 - Modern Web Applications using Server-Side Technologies", "prerequisites": ["CSC240"], "defaultSemester": 8 },
    { "id": "CSC466", "name": "CSC466 - Distributed and Parallel Computing", "prerequisites": ["CSC241", "CSC231"], "defaultSemester": 8 },
    { "id": "CSC467", "name": "CSC467 - Big Data Engineering", "prerequisites": ["CSC241"], "defaultSemester": 8 },
    { "id": "CSC468", "name": "CSC468 - Introduction to Cloud Computing", "prerequisites": ["CSC331"], "defaultSemester": 8 },
    { "id": "CSC471", "name": "CSC471 - Modern Malware Analysis", "prerequisites": ["CSC302", "CSC231"], "defaultSemester": 8 },
    { "id": "CSC472", "name": "CSC472 - Software Security", "prerequisites": ["CSC302", "CSC231"], "defaultSemester": 8 },
    { "id": "CSC476", "name": "CSC476 - Game Development", "prerequisites": ["CSC241"], "defaultSemester": 8 },
    { "id": "CSC478", "name": "CSC478 - Cloud Engineering", "prerequisites": ["CSC468"], "defaultSemester": 8 },
    { "id": "CSC490", "name": "CSC490 - Independent Project in Computer Science", "prerequisites": [], "defaultSemester": 8 },
    { "id": "CSC495", "name": "CSC495 - Topics in Computer Science", "prerequisites": ["CSC231", "CSC241", "CSC240", "CSC220"], "defaultSemester": 8 },
    { "id": "CSC496", "name": "CSC496 - Topics in Complex Large-Scale Systems", "prerequisites": ["CSC231", "CSC241", "CSC240", "CSC220"], "defaultSemester": 8 },
    { "id": "CSC499", "name": "CSC499 - Independent Study in Computer Science", "prerequisites": [], "defaultSemester": 8 }
  ];

  // Process courses data to create nodes and links
  const processCourses = () => {
    const courseMap = new Map(coursesData.map((course) => [course.id, course]));
    const courseSemester = {};

    // Set initial semesters based on defaultSemester in data
    coursesData.forEach((course) => {
      courseSemester[course.id] = course.defaultSemester;
    });

    const semesters = {};
    coursesData.forEach((course) => {
      const semester = courseSemester[course.id];
      if (!semesters[semester]) semesters[semester] = [];
      semesters[semester].push(course);
    });

    const nodes = coursesData.map((course) => ({
      id: course.id,
      name: course.name,
      semester: courseSemester[course.id],
      x: (courseSemester[course.id] - 1) * 200 + 150, // Set initial x position
      y: 100 + Math.random() * 200, // Randomize initial y position to simulate free movement
    }));

    const nodeById = new Map(nodes.map((n) => [n.id, n]));

    const links = coursesData.flatMap((course) =>
      course.prerequisites.map((prereq) => ({
        source: nodeById.get(prereq),
        target: nodeById.get(course.id),
      }))
    );

    return { nodes, links };
  };

  const { nodes, links } = processCourses();

  // Function to render the SVG and courses
  const renderCourses = (data) => {
    const svg = d3.select(svgRef.current).select("svg");
    const semesterWidth = 200;
    const tileHeight = 100;
    const nodeWidth = 100;
    const nodeHeight = 50;

    const semesters = {};
    data.nodes.forEach((node) => {
      if (!semesters[node.semester]) semesters[node.semester] = [];
      semesters[node.semester].push(node);
    });

    const numSemesters = Object.keys(semesters).length;
    const maxCourses = d3.max(Object.values(semesters), (d) => d.length);

    const svgWidth = numSemesters * semesterWidth + 200;
    const svgHeight = maxCourses * tileHeight + 150;

    svg.attr("width", svgWidth).attr("height", svgHeight);

    // Clear the previous content before drawing new elements
    svg.selectAll("*").remove();

    // Update node positions based on defaultSemester
    Object.keys(semesters).forEach((semesterNum) => {
      semesters[semesterNum].forEach((node, idx) => {
        node.x = (semesterNum - 1) * semesterWidth + semesterWidth / 2 + 100;
        node.y = idx * tileHeight + tileHeight / 2 + 80;
      });
    });

    // Update background columns for semesters
    Object.keys(semesters).forEach((semesterNum) => {
      const columnX = (semesterNum - 1) * semesterWidth + 100;
      const columnHeight = maxCourses * tileHeight + 50;

      svg
        .selectAll(`rect.semester-${semesterNum}`)
        .data([semesterNum])
        .join("rect")
        .attr("class", `semester-${semesterNum}`)
        .attr("x", columnX)
        .attr("y", 40)
        .attr("width", semesterWidth)
        .attr("height", columnHeight)
        .attr("fill", semesterNum % 2 ? "#f8f8f8" : "#ffffff")
        .attr("stroke", "#ccc");

      svg
        .selectAll(`text.semester-${semesterNum}`)
        .data([semesterNum])
        .join("text")
        .attr("class", `semester-${semesterNum}`)
        .attr("x", columnX + semesterWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "#FFF")
        .text(`Semester ${semesterNum}`);
    });

    // Update links (connections between courses)
    const linkGenerator = d3
      .linkHorizontal()
      .x((d) => d.x)
      .y((d) => d.y);

    const linkGroup = svg
      .selectAll("path")
      .data(data.links, (d) => `${d.source.id}-${d.target.id}`);

    linkGroup
      .enter()
      .append("path")
      .merge(linkGroup)
      .attr("fill", "none")
      .attr("stroke", "#666")
      .attr("stroke-width", 2)
      .attr(
        "d",
        (d) =>
          linkGenerator({
            source: { x: d.source.x + nodeWidth / 2, y: d.source.y },
            target: { x: d.target.x - nodeWidth / 2, y: d.target.y },
          })
      );

    linkGroup.exit().remove(); // Remove old links if any

    // Update nodes (courses)
    const nodeGroup = svg
      .selectAll("rect.course")
      .data(data.nodes, (d) => d.id);

    nodeGroup
      .enter()
      .append("rect")
      .merge(nodeGroup)
      .attr("class", "course")
      .attr("x", (d) => d.x - nodeWidth / 2)
      .attr("y", (d) => d.y - nodeHeight / 2)
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("fill", "#1f77b4")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("stroke", "#333")
      .attr("cursor", "pointer")
      .call(
        d3
          .drag()
          .on("drag", function (event, d) {
            d.x = event.x;
            d.y = event.y;
            d3.select(this).attr("x", d.x - nodeWidth / 2).attr("y", d.y - nodeHeight / 2);

            // Check if the course is near a new semester
            const nearestSemester = Math.floor((d.x - 100) / 200) + 1; // Find the nearest semester
            d.semester = Math.max(1, Math.min(nearestSemester, 8)); // Limit semesters to 1-8
            renderCourses({
              nodes: data.nodes,
              links: data.links,
            });
          })
          .on("end", function (event, d) {
            const nearestSemester = Math.floor((d.x - 100) / 200) + 1; // Find the nearest semester
            d.semester = Math.max(1, Math.min(nearestSemester, 8)); // Limit semesters to 1-8
            renderCourses({
              nodes: data.nodes,
              links: data.links,
            });
          })
      );

    nodeGroup.exit().remove(); // Remove old nodes if any

    // Update node labels (course names)
    const nodeTextGroup = svg
      .selectAll("text.course")
      .data(data.nodes, (d) => d.id);

    nodeTextGroup
      .enter()
      .append("text")
      .merge(nodeTextGroup)
      .attr("class", (d) => `course course-${d.id}`)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text((d) => d.id)
      .attr("pointer-events", "none");

    nodeTextGroup.exit().remove(); // Remove old text if any
  };

  // Update the view when selected courses change
  useEffect(() => {
    renderCourses({
      nodes: nodes.filter((node) => selectedCourses.includes(node.id)),
      links: links.filter(
        (link) =>
          selectedCourses.includes(link.source.id) &&
          selectedCourses.includes(link.target.id)
      ),
    });
  }, [selectedCourses]);

  const handleCheckboxChange = (courseId) => {
    setSelectedCourses((prevSelected) => {
      if (prevSelected.includes(courseId)) {
        return prevSelected.filter((id) => id !== courseId);
      } else {
        return [...prevSelected, courseId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === coursesData.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(coursesData.map(course => course.id));
    }
  };

  return (
    <div>
      <div ref={svgRef}>
        <svg></svg>
      </div>

      <button onClick={handleSelectAll}>Select All / Deselect All</button>

      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {coursesData.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleCheckboxChange(course.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Combined;
