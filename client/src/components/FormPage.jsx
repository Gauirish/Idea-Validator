import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function FormPage() {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const [userProfile, setUserProfile] = useState({ name: 'User', email: '' });
    const [searchHistory, setSearchHistory] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState(null);

    const fetchHistory = async (emailToFetch) => {
        const targetEmail = emailToFetch || localStorage.getItem('userEmail');
        if (!targetEmail) return;
        
        try {
            const res = await fetch(`${API_BASE_URL}/ideas?email=${encodeURIComponent(targetEmail)}`);
            if (!res.ok) throw new Error('Failed to fetch history from API');
            
            const historyData = await res.json();
            setSearchHistory(historyData); 
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const email = localStorage.getItem('userEmail');
            if (!email) return;

            setUserProfile(prev => ({ ...prev, email }));

            // Fetch Name
            const { data: userData } = await supabase
                .from('Authentication')
                .select('name')
                .eq('email', email)
                .single();
            
            if (userData && userData.name) {
                setUserProfile(prev => ({ ...prev, name: userData.name }));
            }

            await fetchHistory(email);
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch(`${API_BASE_URL}/ideas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userProfile.email,
                    title: formData.title,
                    description: formData.description
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Server failed to validate idea');
            }

            setResult(data.report);

            if (data.record) {
                setSearchHistory(prev => [data.record, ...prev]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNewSearch = () => {
        setSelectedSearch(null);
        setFormData({ title: '', description: '' });
        setResult(null);
        setError('');
        fetchHistory(); // Sync history on new search click
    };

    const getInitial = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    // Determine what to display (either the active selected historical idea, or the current form session)
    const displayMode = selectedSearch ? 'history' : 'new';
    
    // Parse result from history safely (since we stringified it on insert)
    let historicalResult = null;
    if (displayMode === 'history' && selectedSearch.result) {
        try {
            historicalResult = typeof selectedSearch.result === 'string' 
                ? JSON.parse(selectedSearch.result) 
                : selectedSearch.result;
        } catch (e) {
            console.error("Failed to parse historical result", e);
        }
    }

    const currentTitle = displayMode === 'history' ? selectedSearch.title : formData.title;
    const currentReport = displayMode === 'history' ? historicalResult : result;

    return (
        <div className="chatgpt-layout">

            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="avatar">
                        {getInitial(userProfile.name)}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{userProfile.name}</span>
                        {userProfile.email && <span className="user-email">{userProfile.email}</span>}
                    </div>
                </div>

                <button className="new-search-btn" onClick={handleNewSearch}>
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Search
                </button>

                <div className="history-title">Your Searches</div>
                <div className="history-list">
                    {searchHistory.length === 0 ? (
                        <div style={{color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', padding: '0.5rem'}}>No history yet.</div>
                    ) : (
                        searchHistory.map((item, index) => (
                            <button 
                                key={item.id || index} 
                                className={`history-item ${(selectedSearch && selectedSearch.id === item.id) ? 'active' : ''}`}
                                onClick={() => setSelectedSearch(item)}
                            >
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="15" width="15" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0, color: '#64748b'}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                {item.title}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content">
                <div className="app-container" style={{maxWidth: '900px', margin: '0 auto', width: '100%'}}>
                    
                    {displayMode === 'new' ? (
                        /* NEW SEARCH FORM */
                        <div className="glass-card form-card">
                            <h2 className="form-title">Validate Your Startup Idea</h2>
                            <form onSubmit={handleSubmit} className="modern-form">
                                <div className="form-group">
                                    <label htmlFor="title">Startup Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        placeholder="e.g., AI Grocery Assistant"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Detailed Description</label>
                                    <textarea
                                        id="description"
                                        placeholder="Describe the problem, solution, and target audience..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        style={{minHeight: '120px'}}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn submit-btn" disabled={loading} style={{width: '100%', padding:'1rem', fontSize:'1.05rem', fontWeight:'600'}}>
                                        {loading ? 'Analyzing Idea...' : 'Validate Idea'}
                                    </button>
                                </div>
                            </form>

                            {error && <div className="auth-message error" style={{ marginTop: '2rem' }}>{error}</div>}
                        </div>
                    ) : (
                        /* HISTORICAL SEARCH VIEW */
                        <div className="historical-view-card">
                            <h2 className="form-title" style={{marginBottom:'0.5rem'}}>{selectedSearch.title}</h2>
                            
                            <div className="history-desc-box">
                                <strong style={{color:'black', display:'block', marginBottom:'0.5rem'}}>Description Provided:</strong>
                                {selectedSearch.description}
                            </div>
                        </div>
                    )}

                    {/* AI Validation Report Result (Used by both New & Historical) */}
                    {currentReport && (
                        <div className="glass-card validation-report" style={{marginTop: '2rem'}}>
                            <div className="report-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center', gap: '1rem' }}>
                                <h2 className="report-title">Validation Report: {currentTitle}</h2>
                                <div className="report-badges" style={{ justifyContent: 'center' }}>
                                    <span className={`risk-badge ${currentReport.riskLevel ? currentReport.riskLevel.toLowerCase() : ''}`}>
                                        Risk: {currentReport.riskLevel}
                                    </span>
                                    <div className="score-badge">
                                        Profitability: <span className="score-value">{currentReport.profitabilityScore}/100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="report-grid">
                                <div className="report-section">
                                    <h3><span className="icon">🚀</span> Problem Summary</h3>
                                    <p>{currentReport.problemSummary}</p>
                                </div>
                                <div className="report-section">
                                    <h3><span className="icon">👥</span> Customer Persona</h3>
                                    <p>{currentReport.customerPersona}</p>
                                </div>
                                <div className="report-section">
                                    <h3><span className="icon">📊</span> Market Overview</h3>
                                    <p>{currentReport.marketOverview}</p>
                                </div>
                                <div className="report-section">
                                    <h3><span className="icon">⚔️</span> Competitor List</h3>
                                    <ul>
                                        {Array.isArray(currentReport.competitorList) && currentReport.competitorList.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="report-section full-width">
                                    <h3><span className="icon">💻</span> Suggested Tech Stack</h3>
                                    <div className="tech-pills">
                                        {Array.isArray(currentReport.techStack) && currentReport.techStack.map((tech, i) => <span key={i} className="tech-pill">{tech}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FormPage;
