import React from 'react';
import { useTaskForm } from '../../contexts/TaskFormContext';
import { safeToISOString, safeToLocaleString } from '../../utils/dateUtils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
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

  // Dữ liệu cho biểu đồ tròn categories
  const categoryChartData = Object.entries(taskTypes).map(([name, value]) => ({
    name,
    value,
    color: getCategoryColor(name)
  }));

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
  
  // Debug logging
  console.log('🔍 Debug Daily Activity:');
  console.log('Last 7 days:', last7Days);
  console.log('Safe tasks:', safeTasks);
  console.log('Sample task createdAt:', safeTasks[0]?.createdAt);
  
  // Nếu không có dữ liệu, tạo dữ liệu mẫu để test
  if (safeTasks.length === 0) {
    console.log('⚠️ No tasks found, creating sample data for testing');
    const now = new Date();
    const sampleTasks = [
      {
        id: 'sample-1',
        title: 'Sample Task 1',
        completed: true,
        createdAt: now.toISOString(),
        completedAt: now.toISOString(),
        type: 'Work',
        priority: 'high'
      },
      {
        id: 'sample-2', 
        title: 'Sample Task 2',
        completed: false,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        type: 'Personal',
        priority: 'medium'
      },
      {
        id: 'sample-3',
        title: 'Sample Task 3',
        completed: true,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'Study',
        priority: 'low'
      },
      {
        id: 'sample-4',
        title: 'Sample Task 4',
        completed: false,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        type: 'Work',
        priority: 'high'
      }
    ];
    safeTasks.push(...sampleTasks);
  }
  
  const dailyStats = last7Days.map(date => {
    const dayTasks = safeTasks.filter(task => {
      // Thử nhiều cách để lấy ngày tạo task
      let taskDate = null;
      
      if (task.createdAt) {
        taskDate = safeToISOString(task.createdAt);
      } else if (task.created_at) {
        taskDate = safeToISOString(task.created_at);
      } else if (task.dateCreated) {
        taskDate = safeToISOString(task.dateCreated);
      }
      
      if (!taskDate) {
        // Fallback: nếu không có createdAt, giả sử task được tạo hôm nay
        taskDate = new Date().toISOString();
        console.log(`⚠️ Task ${task.title} has no createdAt, using today's date`);
      }
      
      const taskDateOnly = taskDate.split('T')[0];
      const isMatch = taskDateOnly === date;
      
      if (isMatch) {
        console.log(`✅ Task matched for ${date}:`, task.title, task.createdAt || task.created_at || task.dateCreated);
      }
      return isMatch;
    });
    
    const stats = {
      date,
      created: dayTasks.length,
      completed: dayTasks.filter(task => task.completed).length
    };
    
    console.log(`📊 Stats for ${date}:`, stats);
    return stats;
  });

  // Thống kê theo độ ưu tiên
  const priorityStats = {
    high: safeTasks.filter(task => task.priority === 'high').length,
    medium: safeTasks.filter(task => task.priority === 'medium').length,
    low: safeTasks.filter(task => task.priority === 'low').length,
    none: safeTasks.filter(task => !task.priority || task.priority === 'none').length
  };

  // Dữ liệu cho biểu đồ tròn priority
  const priorityChartData = [
    { name: 'High Priority', value: priorityStats.high, color: '#EF4444' },
    { name: 'Medium Priority', value: priorityStats.medium, color: '#F59E0B' },
    { name: 'Low Priority', value: priorityStats.low, color: '#10B981' },
    { name: 'No Priority', value: priorityStats.none, color: '#6B7280' }
  ];

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
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Daily Activity (Last 7 Days)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en', { weekday: 'short' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Tasks Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Tasks Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="priority-section">
        <h3>Priority Distribution</h3>
        <div className="priority-chart-container">
          <div className="priority-chart">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => {
                    // Only show labels for non-zero values to prevent overlapping
                    if (value === 0) return null;
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="priority-stats">
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
