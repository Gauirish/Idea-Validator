import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FormPage from './components/FormPage';
import AuthPage from './components/AuthPage';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/form" element={<FormPage />} />
            </Routes>
        </Router>
    );
}

export default App;
