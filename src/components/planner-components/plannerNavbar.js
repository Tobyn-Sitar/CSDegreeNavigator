import React from 'react';
import './plannerNavbar.css';

const PlannerNavbar = () => {
  return (
    <div className="top-toolbar">
      <div className="toolbar-left">CS Degree Planner</div>
      <div className="toolbar-right">
        <a href="/dashboard" className="home-icon" title="Back to Dashboard">🏠</a>
      </div>
    </div>
  );
};

export default PlannerNavbar;
