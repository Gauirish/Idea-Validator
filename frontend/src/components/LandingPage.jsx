import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="app-container">
                <div className="glass-card hero-card">
                    <h1 className="hero-title">Welcome to Our Platform</h1>
                    <p className="hero-description">
                        Experience the future of digital interaction with our cutting-edge solutions.
                        Start your journey today and unlock endless possibilities.
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
