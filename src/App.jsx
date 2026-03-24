import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Background from './components/Background';
import TargetCursor from './components/TargetCursor';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <TargetCursor 
            spinDuration={2}
            hideDefaultCursor={true}
            parallaxOn={true}
            hoverDuration={0.2}
            targetSelector="a, button, .cursor-target, .gallery-item, .cta-button, .social-icon, .filter-btn, .project-card"
          />
          <Background />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
