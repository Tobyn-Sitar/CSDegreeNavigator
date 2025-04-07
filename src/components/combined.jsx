"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Combined = () => {
  const svgRef = useRef(null);
  const [selectedCourses, setSelectedCourses] = useState([1, 2]);

  // Data for courses and their prerequisites
  const coursesData = [
    { id: 1, name: "Course 1", prerequisites: [] },
    { id: 2, name: "Course 2", prerequisites: [] },
    { id: 3, name: "Course 3", prerequisites: [] },
    { id: 4, name: "Course 4", prerequisites: [] },
    { id: 5, name: "Course 5", prerequisites: [] },
    { id: 6, name: "Course 6", prerequisites: [] },
    { id: 7, name: "Course 7", prerequisites: [] },
    { id: 8, name: "Course 8", prerequisites: [] },
    { id: 9, name: "Course 9", prerequisites: [] },
    { id: 10, name: "Course 10", prerequisites: [4, 5, 8] },
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
