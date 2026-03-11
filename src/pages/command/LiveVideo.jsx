import React, { useState } from "react";
import { FaExpand, FaPlus } from "react-icons/fa";
import "./LiveVideo.css";

export default function LiveVideo() {
  const [gridSize, setGridSize] = useState(16);

  // Creates an array for the selected grid size
  const slots = Array.from({ length: gridSize }, (_, i) => i + 1);

  return (
    <div className="vms-main-wrapper">
      {/* Sidebar Controls */}
      <div className="vms-controls">
        {[1, 4, 9, 16].map((num) => (
          <button 
            key={num} 
            onClick={() => setGridSize(num)} 
            className={gridSize === num ? "active" : ""}
          >
            {num}
          </button>
        ))}
        <button className="expand-btn"><FaExpand size={12} /></button>
      </div>

      {/* Grid Container */}
      <div className={`vms-grid-container grid-size-${gridSize}`}>
        {slots.map((slotId) => (
          <div key={slotId} className="vms-card">
            <button className="top-right-add-btn" title="Add Device">
              <FaPlus size={10} />
              <span>Add Device</span>
            </button>
            {/* Slot ID indicator to help identify cameras */}
            <span className="slot-number-hint">{slotId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}