import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PollsPage from './pages/PollsPage';
import AdminDashboard from './pages/AdminDashboard';
import BlogPage from './pages/BlogPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/polls" element={<PollsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
