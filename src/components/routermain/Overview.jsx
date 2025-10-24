import React from 'react';
import { useTaskForm } from '../../contexts/TaskFormContext';
import { safeToISOString, safeToLocaleString } from '../../utils/dateUtils';
import './Overview.css';

// Helper function để tạo màu cho category
const getCategoryColor = (type) => {
  const colors = {
    'Work': '#3B82F6',
    'Personal': '#10B981',
    'Health': '#F59E0B',
    'Learning': '#8B5CF6',
    'Shopping': '#EF4444',
    'Uncategorized': '#6B7280'
  };
  return colors[type] || '#6B7280';
};

const Overview = () => {
  const { tasks } = useTaskForm();

  // Defensive programming - đảm bảo tasks là array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Loading state
  if (safeTasks.length === 0 && tasks === undefined) {
    return (
      <div className="overview-container">
        <div className="overview-header">
          <h1>Overview</h1>
          <p>Loading your tasks...</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  // Tính toán thống kê
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Thống kê theo loại task
  const taskTypes = {};
  safeTasks.forEach(task => {
    const type = task.type || 'Uncategorized';
    taskTypes[type] = (taskTypes[type] || 0) + 1;
  });

  // Thống kê theo ngày (7 ngày gần nhất)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const dailyStats = last7Days.map(date => {
    const dayTasks = safeTasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = safeToISOString(task.createdAt);
      return taskDate ? taskDate.split('T')[0] === date : false;
    });
    return {
      date,
      created: dayTasks.length,
      completed: dayTasks.filter(task => task.completed).length
    };
  });

  // Thống kê theo độ ưu tiên
  const priorityStats = {
    high: safeTasks.filter(task => task.priority === 'high').length,
    medium: safeTasks.filter(task => task.priority === 'medium').length,
    low: safeTasks.filter(task => task.priority === 'low').length,
    none: safeTasks.filter(task => !task.priority || task.priority === 'none').length
  };

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Overview</h1>
        <p>Track your productivity and task completion</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card rate">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Task Categories</h3>
          <div className="category-chart">
            {Object.entries(taskTypes).map(([type, count]) => (
              <div key={type} className="category-item">
                <div className="category-bar">
                  <div 
                    className="category-fill" 
                    style={{ 
                      width: `${(count / totalTasks) * 100}%`,
                      backgroundColor: getCategoryColor(type)
                    }}
                  ></div>
                </div>
                <div className="category-info">
                  <span className="category-name">{type}</span>
                  <span className="category-count">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Daily Activity (Last 7 Days)</h3>
          <div className="daily-chart">
            {dailyStats.map((day, index) => (
              <div key={day.date} className="daily-item">
                <div className="daily-bar">
                  <div 
                    className="daily-fill created" 
                    style={{ height: `${Math.max(day.created * 10, 4)}px` }}
                    title={`${day.created} created`}
                  ></div>
                  <div 
                    className="daily-fill completed" 
                    style={{ height: `${Math.max(day.completed * 10, 4)}px` }}
                    title={`${day.completed} completed`}
                  ></div>
                </div>
                <span className="daily-label">
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="priority-section">
        <h3>Priority Distribution</h3>
        <div className="priority-grid">
          <div className="priority-item high">
            <div className="priority-icon">🔥</div>
            <div className="priority-info">
              <span className="priority-label">High Priority</span>
              <span className="priority-count">{priorityStats.high}</span>
            </div>
          </div>
          <div className="priority-item medium">
            <div className="priority-icon">⚡</div>
            <div className="priority-info">
              <span className="priority-label">Medium Priority</span>
              <span className="priority-count">{priorityStats.medium}</span>
            </div>
          </div>
          <div className="priority-item low">
            <div className="priority-icon">📝</div>
            <div className="priority-info">
              <span className="priority-label">Low Priority</span>
              <span className="priority-count">{priorityStats.low}</span>
            </div>
          </div>
          <div className="priority-item none">
            <div className="priority-icon">📋</div>
            <div className="priority-info">
              <span className="priority-label">No Priority</span>
              <span className="priority-count">{priorityStats.none}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {safeTasks.slice(-5).reverse().map((task, index) => (
            <div key={task.id} className="activity-item">
              <div className="activity-icon">
                {task.completed ? '✅' : '📝'}
              </div>
              <div className="activity-content">
                <p className="activity-text">
                  {task.completed ? 'Completed' : 'Created'} task: <strong>{task.title}</strong>
                </p>
                <span className="activity-time">
                  {safeToLocaleString(task.completedAt || task.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
