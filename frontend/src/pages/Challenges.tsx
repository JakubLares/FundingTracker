import React, { useEffect, useState, useRef, useMemo } from 'react';
import { challengeAPI, propFirmAPI, exportAPI } from '../api/api';
import type { Challenge, PropFirm, CreateChallengeDTO } from '../types';
import '../styles/Challenges.css';

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [propFirmFilter, setPropFirmFilter] = useState('');

  const [formData, setFormData] = useState<CreateChallengeDTO>({
    propFirmId: '',
    identifier: '',
    accountSize: 0,
    purchasePrice: 0,
    status: 'in_progress',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPropFirms();
    fetchAllChallenges();
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [statusFilter, propFirmFilter]);

  const fetchPropFirms = async () => {
    try {
      const response = await propFirmAPI.getAll();
      setPropFirms(response.data);
    } catch (err) {
      console.error('Failed to fetch prop firms');
    }
  };

  const fetchAllChallenges = async () => {
    try {
      const response = await challengeAPI.getAll();
      setAllChallenges(response.data);
    } catch (err) {
      console.error('Failed to fetch all challenges');
    }
  };

  const fetchChallenges = async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (propFirmFilter) params.propFirmId = propFirmFilter;

      const response = await challengeAPI.getAll(params);
      setChallenges(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load challenges');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter prop firms to only show those that have challenges
  const propFirmsWithChallenges = useMemo(() => {
    const firmIds = new Set(allChallenges.map(c => c.propFirmId));
    return propFirms.filter(firm => firmIds.has(firm.id));
  }, [propFirms, allChallenges]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await challengeAPI.update(editingId, formData);
      } else {
        await challengeAPI.create(formData);
      }
      resetForm();
      fetchChallenges();
      fetchAllChallenges();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save challenge');
    }
  };

  const handleEdit = (challenge: Challenge) => {
    setFormData({
      propFirmId: challenge.propFirmId,
      identifier: challenge.identifier || '',
      accountSize: Number(challenge.accountSize),
      purchasePrice: Number(challenge.purchasePrice),
      status: challenge.status,
      startDate: challenge.startDate ? challenge.startDate.split('T')[0] : '',
      endDate: challenge.endDate ? challenge.endDate.split('T')[0] : '',
      notes: challenge.notes || '',
    });
    setEditingId(challenge.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      await challengeAPI.delete(id);
      fetchChallenges();
      fetchAllChallenges();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete challenge');
    }
  };

  const resetForm = () => {
    setFormData({
      propFirmId: '',
      identifier: '',
      accountSize: 0,
      purchasePrice: 0,
      status: 'in_progress',
      startDate: '',
      endDate: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = async () => {
    try {
      const response = await exportAPI.exportChallenges();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'challenges.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError('Failed to export challenges');
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const response = await exportAPI.importChallenges(text);
      alert(`Import completed! Imported: ${response.data.imported}, Skipped: ${response.data.skipped}`);
      fetchChallenges();
      fetchAllChallenges();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to import challenges');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="challenges-page">
      <div className="page-header">
        <h1>Challenges</h1>
        <div className="header-actions">
          <button onClick={handleExport} className="export-button">
            Export CSV
          </button>
          <button onClick={handleImport} className="import-button">
            Import CSV
          </button>
          <button onClick={() => setShowForm(!showForm)} className="add-button">
            {showForm ? 'Cancel' : '+ Add Challenge'}
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
        </select>
        <select value={propFirmFilter} onChange={(e) => setPropFirmFilter(e.target.value)}>
          <option value="">All Prop Firms</option>
          {propFirmsWithChallenges.map((firm) => (
            <option key={firm.id} value={firm.id}>
              {firm.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Challenge' : 'Add New Challenge'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Prop Firm *</label>
                <select
                  value={formData.propFirmId}
                  onChange={(e) => setFormData({ ...formData, propFirmId: e.target.value })}
                  required
                >
                  <option value="">Select Prop Firm</option>
                  {propFirms.map((firm) => (
                    <option key={firm.id} value={firm.id}>
                      {firm.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Account Size *</label>
                <input
                  type="number"
                  value={formData.accountSize}
                  onChange={(e) => setFormData({ ...formData, accountSize: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Challenge ID (Optional)</label>
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder="e.g., FTPROPLUS638725410957"
                />
              </div>
              <div className="form-group">
                <label>Purchase Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="in_progress">In Progress</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingId ? 'Update Challenge' : 'Create Challenge'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="challenges-list">
        {challenges.length === 0 ? (
          <p className="no-data">No challenges found. Add your first challenge!</p>
        ) : (
          challenges.map((challenge) => (
            <div key={challenge.id} className="challenge-card">
              <div className="challenge-header">
                <h3>{challenge.propFirm?.name || 'Unknown Prop Firm'}</h3>
                <span className={`status-badge ${challenge.status}`}>
                  {challenge.status.replace('_', ' ')}
                </span>
              </div>
              <div className="challenge-details">
                {challenge.identifier && (
                  <div className="detail-item">
                    <span className="label">Challenge ID:</span>
                    <span className="value">{challenge.identifier}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Account Size:</span>
                  <span className="value">${Number(challenge.accountSize).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Purchase Price:</span>
                  <span className="value">${Number(challenge.purchasePrice).toFixed(2)}</span>
                </div>
                {challenge.startDate && (
                  <div className="detail-item">
                    <span className="label">Start Date:</span>
                    <span className="value">{new Date(challenge.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {challenge.endDate && (
                  <div className="detail-item">
                    <span className="label">End Date:</span>
                    <span className="value">{new Date(challenge.endDate).toLocaleDateString()}</span>
                  </div>
                )}
                {challenge.notes && (
                  <div className="detail-item full-width">
                    <span className="label">Notes:</span>
                    <span className="value">{challenge.notes}</span>
                  </div>
                )}
              </div>
              <div className="challenge-actions">
                <button onClick={() => handleEdit(challenge)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(challenge.id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Challenges;
