import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: 'info', text: 'Connecting...' });

        try {
            if (isLogin) {
                
                const { data, error } = await supabase
                    .from('Authentication')
                    .select('*')
                    .eq('email', formData.email)
                    .eq('password', formData.password)
                    .single();

                if (error || !data) {
                    setMessage({ type: 'error', text: 'Invalid credentials' });
                } else {
                    localStorage.setItem('userEmail', formData.email);
                    setMessage({ type: 'success', text: 'Login successful!' });
                    setTimeout(() => navigate('/home'), 1000);
                }
            } else {
                
                const { data: existingUser, error: checkError } = await supabase
                    .from('Authentication')
                    .select('email')
                    .eq('email', formData.email)
                    .single();

                if (existingUser) {
                    setMessage({ type: 'error', text: 'Email taken' });
                } else {
                    
                    const { error: insertError } = await supabase
                        .from('Authentication')
                        .insert([
                            {
                                email: formData.email,
                                name: formData.name,
                                password: formData.password
                            }
                        ]);

                    if (insertError) {
                        setMessage({ type: 'error', text: 'Error creating account' });
                    } else {
                        setMessage({ type: 'success', text: 'Account created! Please log in.' });
                        setIsLogin(true);
                        setFormData({ ...formData, password: '' });
                    }
                }
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection failed. Check your Supabase keys.' });
        }
    };

    const handleToggle = (mode) => {
        setIsLogin(mode === 'login');
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="page-wrapper">
            <div className="app-container">
                <div className="auth-toggle-container">
                    <button
                        className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => handleToggle('signup')}
                    >
                        Sign Up
                    </button>
                    <button
                        className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => handleToggle('login')}
                    >
                        Login
                    </button>
                </div>

                <div className="glass-card auth-card">
                    <h2 className="form-title">{isLogin ? 'Welcome Back' : 'Join Us Today'}</h2>

                    {message.text && (
                        <div className={`auth-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="modern-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required={!isLogin}
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn auth-submit-btn">
                                {isLogin ? 'Continue' : 'Create new account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
