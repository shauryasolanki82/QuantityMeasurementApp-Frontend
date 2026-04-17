import React, { useState, useEffect } from 'react';
import { RefreshCw, Filter, AlertCircle } from 'lucide-react';
import * as api from '../services/api';
import './HistoryPanel.css';

const HistoryPanel = () => {
  const [filterType, setFilterType] = useState('operation'); // operation, measurementType, errored
  const [filterValue, setFilterValue] = useState('compare');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const OPERATIONS = ['compare', 'convert', 'add', 'subtract', 'divide'];
  const MEASUREMENT_TYPES = ['LengthUnit', 'VolumeUnit', 'WeightUnit', 'TemperatureUnit'];

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (filterType === 'operation') {
        data = await api.getHistoryByOperation(filterValue);
      } else if (filterType === 'measurementType') {
        data = await api.getHistoryByType(filterValue);
      } else if (filterType === 'errored') {
        data = await api.getErrorHistory();
      }
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterValue]);

  return (
    <div className="history-panel animate-fade-in glass-panel">
      <div className="history-controls">
        <div className="filter-group">
          <Filter size={18} color="#6B7280" />
          <select 
            value={filterType} 
            onChange={(e) => {
              const newFilter = e.target.value;
              setFilterType(newFilter);
              if (newFilter === 'operation') setFilterValue('compare');
              if (newFilter === 'measurementType') setFilterValue('LengthUnit');
            }}
          >
            <option value="operation">By Operation</option>
            <option value="measurementType">By Measurement Type</option>
            <option value="errored">Errored Only</option>
          </select>
        </div>

        {filterType === 'operation' && (
          <div className="filter-group">
            <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
              {OPERATIONS.map(op => <option key={op} value={op}>{op.toUpperCase()}</option>)}
            </select>
          </div>
        )}

        {filterType === 'measurementType' && (
          <div className="filter-group">
            <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
              {MEASUREMENT_TYPES.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>
        )}

        <button className="refresh-btn" onClick={fetchHistory} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="history-table-container">
        {error ? (
          <div className="error-state">
            <AlertCircle size={40} color="var(--danger-color)" />
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <p>No measurement history found for this filter.</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Quantity 1</th>
                <th>Quantity 2</th>
                <th>Result</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, idx) => (
                <tr key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td><span className="badge badge-op">{record.operation?.toUpperCase()}</span></td>
                  <td>{record.thisValue} {record.thisUnit}</td>
                  <td>{record.operation === 'convert' ? 'N/A' : `${record.thatValue} ${record.thatUnit}`}</td>
                  <td className="result-cell">{record.resultString || `${record.resultValue} ${record.resultUnit}`}</td>
                  <td>
                    {record.error ? (
                      <span className="badge badge-error" title={record.errorMessage}>FAILED</span>
                    ) : (
                      <span className="badge badge-success">SUCCESS</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
