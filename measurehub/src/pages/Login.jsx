import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Activity, User } from 'lucide-react';
import * as api from '../services/api';
import './Login.css'; // Add local CSS for specific styles if needed

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let data;
      if (activeTab === 'login') {
        data = await api.login(email, password); // assuming backend login might use username or email, we pass email as username field just in case, but usually username is expected. Let's pass 'email' state. In backend LoginRequest: username. So if they typed email, it goes as username.
      } else {
        data = await api.register(name, email, password);
      }
      
      if (data && data.token) {
        localStorage.setItem('jwt_token', data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="logo-section">
        <div className="logo-icon-bg">
          <Activity size={32} color="#2F6F6B" />
        </div>
        <h1 className="logo-text">Measurify</h1>
      </div>
      
      <div className="login-card glass-panel animate-fade-in-up delay-100">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button 
            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleLogin} className="form-section">
          {error && <div className="auth-error animate-fade-in" style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem' }}>{error}</div>}

          {activeTab === 'signup' && (
            <div className="input-group">
              <label>Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                placeholder="user@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            {activeTab === 'login' ? 'LOGIN' : 'SIGN UP'}
          </button>

          <div className="links">
            {activeTab === 'login' && (
              <a href="#" className="forgot-password">Forgot Password?</a>
            )}
            <p className="no-account">
              {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab(activeTab === 'login' ? 'signup' : 'login') }}>
                {activeTab === 'login' ? 'Sign Up' : 'Login'}
              </a>
            </p>
          </div>

          <div className="divider">
            <span>Social Login</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn">
              <span style={{color: '#DB4437', fontWeight: 'bold', fontSize: '18px'}}>G</span>
            </button>
            <button type="button" className="social-btn">
              <span style={{color: '#000', fontWeight: 'bold', fontSize: '18px'}}>A</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
