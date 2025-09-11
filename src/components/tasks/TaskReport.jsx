import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useTaskForm } from '../../contexts/TaskFormContext';
import './TaskReport.css';

const COLORS = ['#f6c1c1', '#b8c1ec', '#a0ced9', '#d1e7dd', '#f8d7da', '#fff3cd', '#d4edda'];

const TaskReport = () => {
  const { tasks } = useTaskForm();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  // 🔹 gom task theo type (trước đây nhầm là project)
  const categoryMap = {};
  tasks.forEach((task) => {
    const category = task.type || 'Uncategorized';
    if (!categoryMap[category]) categoryMap[category] = 0;
    categoryMap[category]++;
  });

  const chartData = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    value: count,
    percentage: ((count / totalTasks) * 100).toFixed(1),
  }));

  return (
    <div className="task-report">
      <h2 className="chart-title">Tasks Per Category</h2>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            label={({ name, percentage }) => `${name} ${percentage}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} tasks`, name]} />
        </PieChart>
      </ResponsiveContainer>

      <div className="task-report-summary">
        <div className="summary-box">
          <span>Total Tasks:</span>
          <strong>{totalTasks}</strong>
        </div>
        <div className="summary-box">
          <span>Completed:</span>
          <strong>{completedTasks}</strong>
        </div>
      </div>
    </div>
  );
};

export default TaskReport;