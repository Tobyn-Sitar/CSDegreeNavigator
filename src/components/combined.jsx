"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Combined = () => {
  const svgRef = useRef(null);
  const [selectedCourses, setSelectedCourses] = useState([1, 2]);

  // Data for courses and their prerequisites
  const coursesData = [
  { "id": "MAT151", "name": "MAT151 - Discrete Mathematics", "prerequisites": [] },
  { "id": "MAT161", "name": "MAT161 - Calculus I", "prerequisites": [] },
  { "id": "CSC141", "name": "CSC141 - Computer Science I (Python)", "prerequisites": [] },
  { "id": "CSC142", "name": "CSC142 - Computer Science II (Java)", "prerequisites": ["CSC141"] },
  { "id": "CSC220", "name": "CSC220 - Foundations of Computer Science", "prerequisites": ["CSC240","MAT151","MAT161"] },
  { "id": "CSC231", "name": "CSC231 - Computer Systems", "prerequisites": ["CSC142","MAT151"] },
  { "id": "CSC240", "name": "CSC240 - Computer Science III", "prerequisites": ["CSC142"] },
  { "id": "CSC241", "name": "CSC241 - Data Structures and Algorithms", "prerequisites": ["CSC240","MAT151","MAT161"] },
  { "id": "CSC301", "name": "CSC301 - Computer Security & Ethics", "prerequisites": [] },
  { "id": "CSC302", "name": "CSC302 - Computer Security", "prerequisites": ["CSC301","CSC335"] },
  { "id": "CSC317", "name": "CSC317 - Introduction to Digital Image Process", "prerequisites": ["CSC240"] },
  { "id": "CSC321", "name": "CSC321 - Database Management Systems", "prerequisites": ["CSC241"] },
  { "id": "CSC331", "name": "CSC331 - Operating Systems", "prerequisites": ["CSC231","CSC241","CSC220"] },
  { "id": "CSC335", "name": "CSC335 - Data Communications and Networking I", "prerequisites": ["CSC241"] },
  { "id": "CSC345", "name": "CSC345 - Programming Language Concepts and Paradigms", "prerequisites": ["CSC220","CSC241"] },
  { "id": "CSC381", "name": "CSC381 - Data Science", "prerequisites": ["CSC240","CSC241"] },
  { "id": "CSC400", "name": "CSC400 - Internship", "prerequisites": ["CSC241"] },
  { "id": "CSC402", "name": "CSC402 - Software Engineering Capstone", "prerequisites": ["CSC241"] },
  { "id": "CSC404", "name": "CSC404 - Software Testing", "prerequisites": ["CSC402"] },
  { "id": "CSC416", "name": "CSC416 - Design and Construction of Compilers", "prerequisites": ["CSC220","CSC231"] },
  { "id": "CSC417", "name": "CSC417 - User Interfaces", "prerequisites": ["CSC241"] },
  { "id": "CSC418", "name": "CSC418 - Modern Web Applications using Server-Side Technologies", "prerequisites": ["CSC240"] },
  { "id": "CSC466", "name": "CSC466 - Distributed and Parallel Computing", "prerequisites": ["CSC241","CSC231"] },
  { "id": "CSC467", "name": "CSC467 - Big Data Engineering", "prerequisites": ["CSC241"] },
  { "id": "CSC468", "name": "CSC468 - Introduction to Cloud Computing", "prerequisites": ["CSC331"] },
  { "id": "CSC471", "name": "CSC471 - Modern Malware Analysis", "prerequisites": ["CSC302","CSC231"] },
  { "id": "CSC472", "name": "CSC472 - Software Security", "prerequisites": ["CSC302","CSC231"] },
  { "id": "CSC476", "name": "CSC476 - Game Development", "prerequisites": ["CSC241"] },
  { "id": "CSC478", "name": "CSC478 - Cloud Engineering", "prerequisites": ["CSC468"] },
  { "id": "CSC490", "name": "CSC490 - Independent Project in Computer Science", "prerequisites": [] },
  { "id": "CSC495", "name": "CSC495 - Topics in Computer Science", "prerequisites": ["CSC231","CSC241","CSC240","CSC220"] },
  { "id": "CSC496", "name": "CSC496 - Topics in Complex Large-Scale Systems", "prerequisites": ["CSC231","CSC241","CSC240","CSC220"] },
  { "id": "CSC499", "name": "CSC499 - Independent Study in Computer Science", "prerequisites": [] }
];

  

  // Process courses data to create nodes and links
  const processCourses = () => {
    const courseMap = new Map(coursesData.map((course) => [course.id, course]));
    const courseSemester = {};

    const maxCoursesPerSemester = 6;

    function assignSemester(courseId) {
      if (courseSemester[courseId]) return courseSemester[courseId];
      const course = courseMap.get(courseId);
      if (!course.prerequisites.length) {
        courseSemester[courseId] = 1;
      } else {
        const prereqSemesters = course.prerequisites.map(assignSemester);
        courseSemester[courseId] = Math.max(...prereqSemesters) + 1;
      }
      return courseSemester[courseId];
    }

    coursesData.forEach((c) => assignSemester(c.id));

    const semesters = {};
    coursesData.forEach((course) => {
      const semester = courseSemester[course.id];
      if (!semesters[semester]) semesters[semester] = [];
      semesters[semester].push(course);
    });

    // Cap the number of courses per semester
    let nextSemester = 1;
    const finalSemesters = {};

    Object.keys(semesters).forEach((semesterNum) => {
      let currentSemesterCourses = semesters[semesterNum];

      // Split courses into batches of maxCoursesPerSemester
      while (currentSemesterCourses.length > maxCoursesPerSemester) {
        const splitCourses = currentSemesterCourses.splice(0, maxCoursesPerSemester);
        if (!finalSemesters[nextSemester]) finalSemesters[nextSemester] = [];
        finalSemesters[nextSemester] = [...finalSemesters[nextSemester], ...splitCourses];
        nextSemester++;
      }

      if (!finalSemesters[nextSemester]) finalSemesters[nextSemester] = [];
      finalSemesters[nextSemester] = [...finalSemesters[nextSemester], ...currentSemesterCourses];
    });

    const nodes = coursesData.map((course) => ({
      id: course.id,
      name: course.name,
      semester: Object.keys(finalSemesters).find(semesterNum => finalSemesters[semesterNum].includes(course)),
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

    // Update node positions
    Object.keys(semesters).forEach((semesterNum) => {
      semesters[semesterNum].forEach((node, idx) => {
        node.x = (semesterNum - 1) * semesterWidth + semesterWidth / 2 + 100;
        node.y = idx * tileHeight + tileHeight / 2 + 80;
      });
    });

    // Update the background columns for semesters
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
        .attr("fill", "#555")
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
        d3.drag().on("drag", function (event, d) {
          // Update the position of the node
          d.x = event.x;
          d.y = event.y;

          // Reposition the node
          d3.select(this)
            .attr("x", d.x - nodeWidth / 2)
            .attr("y", d.y - nodeHeight / 2);

          // Update the node label (text)
          svg.selectAll(`text.course-${d.id}`)
            .attr("x", d.x)
            .attr("y", d.y + 5);

          // Update the links accordingly
          svg
            .selectAll("path")
            .data(data.links, (link) =>
              link.source.id === d.id || link.target.id === d.id
                ? `${link.source.id}-${link.target.id}`
                : null
            )
            .attr("d", (link) =>
              link
                ? linkGenerator({
                    source: { x: link.source.x + nodeWidth / 2, y: link.source.y },
                    target: { x: link.target.x - nodeWidth / 2, y: link.target.y },
                  })
                : null
            );
        })
        .on("end", function (event, d) {
          // Check if the node was dragged to another column
          let newColumn = Math.floor((d.x - 100) / semesterWidth) + 1;

          // Check if the column has reached the maximum capacity
          const currentColumnNodes = data.nodes.filter((node) => node.semester === newColumn);

          if (currentColumnNodes.length >= 6) {
            // Move the node to the next available column
            newColumn = newColumn + 1;
          }

          if (d.semester !== newColumn) {
            // Swap nodes in the semesters
            d.semester = newColumn;

            // Re-render the layout with updated columns
            renderCourses({
              nodes: nodes.filter((node) => selectedCourses.includes(node.id)),
              links: links.filter(
                (link) =>
                  selectedCourses.includes(link.source.id) &&
                  selectedCourses.includes(link.target.id)
              ),
            });
          }
        })
      )
      .on("click", (event, d) => highlightPrerequisites(d, data));

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

    function highlightPrerequisites(selectedNode, graphData) {
      nodeGroup.attr("fill", "#bbb");
      svg.selectAll("path").attr("stroke", "#ddd");

      const visited = new Set();
      const traverse = (nodeId) => {
        visited.add(nodeId);
        graphData.links.forEach((link) => {
          if (link.target.id === nodeId && !visited.has(link.source.id)) {
            traverse(link.source.id);
          }
        });
      };
      traverse(selectedNode.id);

      nodeGroup.attr("fill", (d) => (visited.has(d.id) ? "#ff7f0e" : "#bbb"));
      svg
        .selectAll("path")
        .attr(
          "stroke",
          (d) =>
            visited.has(d.source.id) && visited.has(d.target.id)
              ? "#ff7f0e"
              : "#ddd"
        );
    }
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

  return (
    <div>
      <div ref={svgRef}>
        <svg></svg>
      </div>
  
      <div style={{ display: "flex" }}>
        {/* Left Column */}
        <div style={{ flex: 1, paddingRight: "10px" }}>
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th style={{ paddingLeft: "10px" }}>Select</th>
              </tr>
            </thead>
            <tbody>
              {coursesData.slice(0, Math.ceil(coursesData.length / 3)).map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td style={{ paddingLeft: "10px" }}>
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
  
        {/* Middle Column */}
        <div style={{ flex: 1, paddingRight: "10px", paddingLeft: "10px" }}>
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th style={{ paddingLeft: "10px" }}>Select</th>
              </tr>
            </thead>
            <tbody>
              {coursesData.slice(Math.ceil(coursesData.length / 3), Math.ceil(2 * coursesData.length / 3)).map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td style={{ paddingLeft: "10px" }}>
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
  
        {/* Right Column */}
        <div style={{ flex: 1, paddingLeft: "10px" }}>
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th style={{ paddingLeft: "10px" }}>Select</th>
              </tr>
            </thead>
            <tbody>
              {coursesData.slice(Math.ceil(2 * coursesData.length / 3)).map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td style={{ paddingLeft: "10px" }}>
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
      </div>
    </div>
  );
  
  
};

export default Combined;
