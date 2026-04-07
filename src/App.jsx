import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import MinecraftBackground from './components/MinecraftBackground';
import TargetCursor from './components/TargetCursor';
import ClickSpark from './components/ClickSpark';
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
        <ClickSpark
          sparkColor="var(--accent-color)"
          sparkCount={8}
          sparkRadius={18}
          sparkSize={4}
          duration={400}
        >
          <div className={`app-container ${isLoaded ? 'loaded' : 'unloaded'}`}>
            {isLoaded && (
              <>
                <TargetCursor
                  spinDuration={3}
                  hideDefaultCursor={true}
                  parallaxOn={true}
                  hoverDuration={0.2}
                  targetSelector="a, button, .cursor-target, .hotbar-slot, .mc-btn, .mc-filter-tab, .mc-project-slot, .mc-achievement, .mc-social-link, .mc-theme-btn, .profile-card-rb"
                />
                <MinecraftBackground />
                <Navbar />
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
        </ClickSpark>
      </Router>
    </ThemeProvider>
  );
}

export default App;
