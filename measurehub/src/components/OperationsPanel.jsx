import React, { useState } from 'react';
import { RefreshCw, Plus, Minus, Divide, ArrowRightLeft, Equal } from 'lucide-react';
import * as api from '../services/api';
import './OperationsPanel.css';

const OPERATIONS = [
  { id: 'compare', name: 'Compare', icon: Equal },
  { id: 'convert', name: 'Convert', icon: ArrowRightLeft },
  { id: 'add', name: 'Add', icon: Plus },
  { id: 'subtract', name: 'Subtract', icon: Minus },
  { id: 'divide', name: 'Divide', icon: Divide }
];

const MEASUREMENT_TYPES = ['LengthUnit', 'VolumeUnit', 'WeightUnit', 'TemperatureUnit'];
const UNITS = {
  LengthUnit: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  VolumeUnit: ['MILLILITRE', 'LITRE', 'GALLON'],
  WeightUnit: ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'OUNCE', 'TONNE'],
  TemperatureUnit: ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
};

const OperationsPanel = () => {
  const [activeOp, setActiveOp] = useState('compare');
  const [measurementType, setMeasurementType] = useState('LengthUnit');
  
  const [q1, setQ1] = useState({ value: '', unit: 'FEET' });
  const [q2, setQ2] = useState({ value: '', unit: 'INCHES' });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setMeasurementType(type);
    setQ1({ ...q1, unit: UNITS[type][0] });
    setQ2({ ...q2, unit: UNITS[type][1] || UNITS[type][0] });
  };

  const handleExecute = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload1 = { value: parseFloat(q1.value), unit: q1.unit, measurementType };
      const payload2 = { value: parseFloat(q2.value), unit: q2.unit, measurementType };

      let data;
      switch (activeOp) {
        case 'compare':
          data = await api.compareQuantities(payload1, payload2);
          break;
        case 'convert': // Q2 value might be ignored by backend for convert, but let's pass dummy or user can just select unit
          {
            const convertQ1 = { ...payload1 };
            const convertQ2 = { value: 0, unit: q2.unit, measurementType };
            data = await api.convertQuantity(convertQ1, convertQ2);
          }
          break;
        case 'add':
          data = await api.addQuantities(payload1, payload2);
          break;
        case 'subtract':
          data = await api.subtractQuantities(payload1, payload2);
          break;
        case 'divide':
          data = await api.divideQuantities(payload1, payload2);
          break;
        default:
          throw new Error('Unknown operation');
      }
      
      if (data.error) {
        setError(data.errorMessage);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = OPERATIONS.find(o => o.id === activeOp)?.icon;

  return (
    <div className="operations-panel animate-fade-in glass-panel">
      <div className="op-selector">
        {OPERATIONS.map((op) => (
          <button
            key={op.id}
            className={`op-btn ${activeOp === op.id ? 'active' : ''}`}
            onClick={() => { setActiveOp(op.id); setResult(null); setError(null); }}
          >
            <op.icon size={18} />
            {op.name}
          </button>
        ))}
      </div>

      <div className="form-container">
        <div className="type-selector">
          <label>Measurement Type</label>
          <select value={measurementType} onChange={handleTypeChange}>
            {MEASUREMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="quantities-layout">
          <div className="quantity-card">
            <h3>First Quantity</h3>
            <div className="input-group">
              <label>Value</label>
              <input 
                type="number" 
                value={q1.value} 
                onChange={(e) => setQ1({...q1, value: e.target.value})} 
                placeholder="e.g. 10" 
              />
            </div>
            <div className="input-group">
              <label>Unit</label>
              <select value={q1.unit} onChange={(e) => setQ1({...q1, unit: e.target.value})}>
                {UNITS[measurementType].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="action-center">
             <div className="action-circle">
               {ActiveIcon && <ActiveIcon size={24} color="var(--primary-color)" />}
             </div>
          </div>

          <div className="quantity-card">
            <h3>Second Quantity {activeOp === 'convert' ? '(Target Unit)' : ''}</h3>
            {activeOp !== 'convert' && (
              <div className="input-group">
                <label>Value</label>
                <input 
                  type="number" 
                  value={q2.value} 
                  onChange={(e) => setQ2({...q2, value: e.target.value})} 
                  placeholder="e.g. 5" 
                />
              </div>
            )}
            <div className="input-group">
              <label>Unit</label>
              <select value={q2.unit} onChange={(e) => setQ2({...q2, unit: e.target.value})}>
                {UNITS[measurementType].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button 
          className="execute-btn" 
          onClick={handleExecute} 
          disabled={loading || !q1.value || (activeOp !== 'convert' && !q2.value)}
        >
          {loading ? <RefreshCw className="spin" size={20} /> : 'Calculate Result'}
        </button>

        {error && (
          <div className="result-card error animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-card success animate-fade-in">
            <h4>Result</h4>
            <p className="result-text">{result.resultString || `${result.resultValue} ${result.resultUnit || (activeOp === 'convert' ? q2.unit : '')}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsPanel;
