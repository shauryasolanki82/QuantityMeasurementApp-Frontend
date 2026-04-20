import React, { useState } from 'react';
import { Activity, Calculator, History, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OperationsPanel from '../components/OperationsPanel';
import HistoryPanel from '../components/HistoryPanel';
import './Dashboard.css';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('operations');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <Activity size={28} color="var(--primary-color)" />
          <h2>Measurify</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeMenu === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveMenu('operations')}
          >
            <Calculator size={20} />
            <span>Operations</span>
          </button>
          <button 
            className={`nav-item ${activeMenu === 'history' ? 'active' : ''}`}
            onClick={() => setActiveMenu('history')}
          >
            <History size={20} />
            <span>History</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header glass-panel">
          <h1>{activeMenu === 'operations' ? 'Quantity Operations' : 'Measurement History'}</h1>
        </header>

        <div className="content-area">
          {activeMenu === 'operations' ? <OperationsPanel /> : <HistoryPanel />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
