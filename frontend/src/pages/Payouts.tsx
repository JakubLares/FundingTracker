import React, { useEffect, useState } from 'react';
import { payoutAPI, challengeAPI, propFirmAPI } from '../api/api';
import type { Payout, Challenge, PropFirm, CreatePayoutDTO } from '../types';
import '../styles/Payouts.css';

const Payouts: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePayoutDTO>({
    challengeId: '',
    propFirmId: '',
    amount: 0,
    date: '',
    notes: '',
  });

  useEffect(() => {
    fetchPropFirms();
    fetchChallenges();
    fetchPayouts();
  }, []);

  const fetchPropFirms = async () => {
    try {
      const response = await propFirmAPI.getAll();
      setPropFirms(response.data);
    } catch (err) {
      console.error('Failed to fetch prop firms');
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await challengeAPI.getAll();
      setChallenges(response.data);
    } catch (err) {
      console.error('Failed to fetch challenges');
    }
  };

  const fetchPayouts = async () => {
    try {
      const response = await payoutAPI.getAll();
      setPayouts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load payouts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.challengeId && !formData.propFirmId) {
      setError('Please select either a challenge or a prop firm');
      return;
    }

    try {
      if (editingId) {
        await payoutAPI.update(editingId, formData);
      } else {
        await payoutAPI.create(formData);
      }
      resetForm();
      fetchPayouts();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save payout');
    }
  };

  const handleEdit = (payout: Payout) => {
    setFormData({
      challengeId: payout.challengeId || '',
      propFirmId: payout.propFirmId || '',
      amount: Number(payout.amount),
      date: payout.date ? payout.date.split('T')[0] : '',
      notes: payout.notes || '',
    });
    setEditingId(payout.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payout?')) return;

    try {
      await payoutAPI.delete(id);
      fetchPayouts();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete payout');
    }
  };

  const resetForm = () => {
    setFormData({
      challengeId: '',
      propFirmId: '',
      amount: 0,
      date: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  const totalPayouts = payouts.reduce((sum, payout) => sum + Number(payout.amount), 0);

  return (
    <div className="payouts-page">
      <div className="page-header">
        <div>
          <h1>Payouts</h1>
          <p className="total-payouts">Total Payouts: ${totalPayouts.toFixed(2)}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          {showForm ? 'Cancel' : '+ Add Payout'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Payout' : 'Add New Payout'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Challenge (Optional)</label>
                <select
                  value={formData.challengeId}
                  onChange={(e) => setFormData({ ...formData, challengeId: e.target.value })}
                >
                  <option value="">Select Challenge</option>
                  {challenges.map((challenge) => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.propFirm?.name} - {challenge.phase} - ${Number(challenge.accountSize).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Prop Firm (Optional)</label>
                <select
                  value={formData.propFirmId}
                  onChange={(e) => setFormData({ ...formData, propFirmId: e.target.value })}
                >
                  <option value="">Select Prop Firm</option>
                  {propFirms.map((firm) => (
                    <option key={firm.id} value={firm.id}>
                      {firm.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
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
                {editingId ? 'Update Payout' : 'Create Payout'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="payouts-list">
        {payouts.length === 0 ? (
          <p className="no-data">No payouts found. Add your first payout!</p>
        ) : (
          payouts.map((payout) => (
            <div key={payout.id} className="payout-card">
              <div className="payout-header">
                <h3>${Number(payout.amount).toFixed(2)}</h3>
                <span className="payout-date">
                  {new Date(payout.date).toLocaleDateString()}
                </span>
              </div>
              <div className="payout-details">
                {payout.challenge && (
                  <div className="detail-item">
                    <span className="label">Challenge:</span>
                    <span className="value">
                      {payout.challenge.propFirm?.name} - {payout.challenge.phase}
                    </span>
                  </div>
                )}
                {payout.propFirm && !payout.challenge && (
                  <div className="detail-item">
                    <span className="label">Prop Firm:</span>
                    <span className="value">{payout.propFirm.name}</span>
                  </div>
                )}
                {payout.notes && (
                  <div className="detail-item full-width">
                    <span className="label">Notes:</span>
                    <span className="value">{payout.notes}</span>
                  </div>
                )}
              </div>
              <div className="payout-actions">
                <button onClick={() => handleEdit(payout)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(payout.id)} className="delete-button">
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

export default Payouts;
