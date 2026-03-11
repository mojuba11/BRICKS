import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import "./KeyStatistics.css";

const KeyStatistics = () => {
  // Data matching image_81a4e1.png
  const data = [
    { name: 'Platform is important', value: 0, color: '#c0392b' },
    { name: 'Reservations', value: 0, color: '#2c3e50' },
    { name: 'Platform for ordinary', value: 124, color: '#5f9ea0' },
    { name: 'Important', value: 0, color: '#d35400' },
    { name: 'Ordinary', value: 124, color: '#8fbc8f' },
  ];

  return (
    <div className="key-stats-container">
      <div className="stats-header">
        <div className="query-group">
          <input type="date" />
          <input type="date" />
          <button className="query-btn">🔍 Query</button>
        </div>
      </div>

      <div className="stats-card">
        <div className="card-top">
          <h2 className="title">Key statistics.</h2>
          <div className="controls">
            <button className="icon-btn">🔄</button>
            <button className="icon-btn">📥</button>
          </div>
        </div>

        <div className="custom-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="dot" style={{ backgroundColor: item.color }}></span>
              <span className="label">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" hide /> 
              <YAxis domain={[0, 140]} ticks={[0, 20, 40, 60, 80, 100, 120, 140]} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return <div className="custom-tooltip">{payload[0].value}</div>;
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" barSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="x-axis-label">Document statistics</div>
        </div>
      </div>
    </div>
  );
};

export default KeyStatistics;