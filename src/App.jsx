import React, { useState, Suspense, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import MinecraftBackground from './components/MinecraftBackground';
import TargetCursor from './components/TargetCursor';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load pages for optimization
const Home = React.lazy(() => import('./pages/Home'));
const Projects = React.lazy(() => import('./pages/Projects'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <ThemeProvider>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      
      <Router>
        {/* These are OUTSIDE app-container — no parent can break their position:fixed */}
        {isLoaded && <TargetCursor
          hideDefaultCursor={true}
          targetSelector="a, button, .cursor-target, .hotbar-slot, .mc-btn, .mc-filter-tab, .mc-project-slot, .mc-achievement, .mc-social-link, .mc-theme-btn, .profile-card-rb"
        />}
        {isLoaded && <MinecraftBackground />}
        {isLoaded && <Navbar />}

        {/* Scrollable content only */}
        <div className={`app-container ${isLoaded ? 'loaded' : 'unloaded'}`}>
          {isLoaded && (
            <>
              <Suspense fallback={<div className="mc-suspense-loader"><div className="mc-loading" /></div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Suspense>
              <Footer />
            </>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
