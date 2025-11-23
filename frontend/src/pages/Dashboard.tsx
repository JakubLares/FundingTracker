import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../api/api';
import type { Analytics } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.get();
      setAnalytics(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!analytics) {
    return null;
  }

  const { summary, monthlyData } = analytics;

  const inProgressPercentage = summary.totalChallenges > 0
    ? ((summary.inProgressChallenges / summary.totalChallenges) * 100).toFixed(0)
    : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Track your trading challenges and performance</p>
      </div>

      <div className="stats-grid-main">
        <div className="stat-card stat-card-total">
          <h3>TOTAL CHALLENGES</h3>
          <p className="stat-value">{summary.totalChallenges}</p>
        </div>
        <div className="stat-card stat-card-passed">
          <h3>PASSED</h3>
          <p className="stat-value">{summary.passedChallenges}</p>
        </div>
        <div className="stat-card stat-card-failed">
          <h3>FAILED</h3>
          <p className="stat-value">{summary.failedChallenges}</p>
        </div>
        <div className="stat-card stat-card-progress">
          <h3>IN PROGRESS</h3>
          <p className="stat-value">{inProgressPercentage}%</p>
        </div>
      </div>

      {monthlyData.length > 0 && (
        <div className="charts-container">
          <div className="chart-card">
            <h2>Track your trading and performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: '#1a1f35',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#e4e7eb'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="costs" stroke="#ec4899" name="Costs" strokeWidth={2} />
                <Line type="monotone" dataKey="earnings" stroke="#06b6d4" name="Earnings" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Monthly Profit/Loss</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: '#1a1f35',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#e4e7eb'
                  }}
                />
                <Legend />
                <Bar dataKey="profitLoss" fill="#8b5cf6" name="Monthly Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <Link to="/challenges" className="action-button action-button-challenges">
          Manage Challenges →
        </Link>
        <Link to="/payouts" className="action-button action-button-payouts">
          Manage Payouts →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
