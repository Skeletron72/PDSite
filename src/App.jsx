import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PollsPage from './pages/PollsPage';
import AdminDashboard from './pages/AdminDashboard';
import BlogPage from './pages/BlogPage';
import ProfilePage from './pages/ProfilePage';
import PollDetailsPage from './pages/PollDetailsPage';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router basename="/PDSite">
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/polls" element={<PollsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/polls/:id" element={<PollDetailsPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
