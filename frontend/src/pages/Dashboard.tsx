import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../api/api';
import { Analytics } from '../types';
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

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Challenges</h3>
          <p className="stat-value">{summary.totalChallenges}</p>
        </div>
        <div className="stat-card success">
          <h3>Passed Challenges</h3>
          <p className="stat-value">{summary.passedChallenges}</p>
        </div>
        <div className="stat-card danger">
          <h3>Failed Challenges</h3>
          <p className="stat-value">{summary.failedChallenges}</p>
        </div>
        <div className="stat-card info">
          <h3>In Progress</h3>
          <p className="stat-value">{summary.inProgressChallenges}</p>
        </div>
        <div className="stat-card warning">
          <h3>Total Costs</h3>
          <p className="stat-value">${summary.totalCosts.toFixed(2)}</p>
        </div>
        <div className="stat-card success">
          <h3>Total Earnings</h3>
          <p className="stat-value">${summary.totalEarnings.toFixed(2)}</p>
        </div>
        <div className={`stat-card ${summary.profitLoss >= 0 ? 'success' : 'danger'}`}>
          <h3>Profit/Loss</h3>
          <p className="stat-value">${summary.profitLoss.toFixed(2)}</p>
        </div>
        <div className="stat-card info">
          <h3>ROI</h3>
          <p className="stat-value">{summary.roi.toFixed(2)}%</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">{summary.successRate.toFixed(2)}%</p>
        </div>
      </div>

      {monthlyData.length > 0 && (
        <div className="charts-container">
          <div className="chart-card">
            <h2>Monthly Costs vs Earnings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="costs" stroke="#ff6b6b" name="Costs" />
                <Line type="monotone" dataKey="earnings" stroke="#51cf66" name="Earnings" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Monthly Profit/Loss</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profitLoss" fill="#667eea" name="Profit/Loss" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <Link to="/challenges" className="action-button">
          Manage Challenges
        </Link>
        <Link to="/payouts" className="action-button">
          Manage Payouts
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
