import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./TimeStatistics.css";

const TimeStatistics = () => {
  // Data points based on image_4fc6a2.png
  const data = [
    { date: "2025-10-16", count: 5 },
    { date: "2025-10-17", count: 28 },
    { date: "2025-12-23", count: 10 },
    { date: "2026-01-20", count: 7 },
    { date: "2026-02-16", count: 35 },
    { date: "2026-02-17", count: 20 },
    { date: "2026-02-19", count: 19 },
  ];

  // Custom marker for specific peaks
  const RenderCustomDot = (props) => {
    const { cx, cy, value } = props;
    if (value === 5 || value === 35) {
      return (
        <g>
          <path
            d={`M${cx},${cy} c-5,-15 -10,-15 -10,-20 a10,10 0 1,1 20,0 c0,5 -5,5 -10,20z`}
            fill="#c0392b"
          />
          <text x={cx} y={cy - 22} fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">
            {value}
          </text>
        </g>
      );
    }
    return <circle cx={cx} cy={cy} r={3} stroke="#c0392b" strokeWidth={2} fill="white" />;
  };

  return (
    <div className="time-stats-container">
      <div className="stats-header">
        <div className="query-group">
          <input type="date" />
          <input type="date" />
          <button className="query-btn">🔍 Query</button>
        </div>
      </div>

      <div className="stats-card">
        <div className="card-top">
          <h2 className="title">Time statistics</h2>
          <div className="legend-center">
            <span className="line-symbol"></span> Number of files
          </div>
          <div className="controls">
            <button className="icon-btn">📄</button>
            <button className="icon-btn">📈</button>
            <button className="icon-btn">📊</button>
            <button className="icon-btn">🔄</button>
            <button className="icon-btn">📥</button>
          </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="#eee" vertical horizontal />
              <XAxis dataKey="date" axisLine={{ stroke: '#333' }} />
              <YAxis domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} axisLine={{ stroke: '#333' }} />
              <Tooltip />
              <Line
                type="linear"
                dataKey="count"
                stroke="#c0392b"
                strokeWidth={2}
                dot={<RenderCustomDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimeStatistics;