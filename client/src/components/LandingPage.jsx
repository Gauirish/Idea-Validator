import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="app-container">
                <div className="glass-card hero-card">
                    <h1 className="hero-title">Welcome to IdeaForge</h1>
                    <p className="hero-description">
                        Got a startup idea but not sure if it will work?
Our AI-powered Startup Idea Validator helps you analyze, refine, and validate your ideas instantly.

Using advanced AI, the platform evaluates your concept across key factors like market demand, feasibility, competition, and scalability—giving you a clear, structured validation report in seconds.
                    </p>
                    <button className="btn" onClick={() => navigate('/form')}>
                        Get started
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
