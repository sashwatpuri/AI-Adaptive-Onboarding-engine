import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { useAppStore } from './store/useAppStore';
import { Toaster } from 'react-hot-toast';
import GlobalLoader from './components/GlobalLoader';
import ErrorBoundary from './components/ErrorBoundary';

// Placeholders for screens
import Landing from './screens/Landing';
import SkillExtraction from './screens/SkillExtraction';
import GapMap from './screens/GapMap';
import Roadmap from './screens/Roadmap';
import Courses from './screens/Courses';
import Reasoning from './screens/Reasoning';
import Test from './screens/Test';
import Simulation from './screens/Simulation';

const SCREEN_BY_PATH = {
  '/': 'landing',
  '/extract': 'extract',
  '/gap': 'gap',
  '/roadmap': 'roadmap',
  '/courses': 'courses',
  '/reasoning': 'reasoning',
  '/test': 'test',
  '/simulation': 'simulation',
};

function ScreenSync() {
  const location = useLocation();
  const setScreen = useAppStore(state => state.setScreen);

  useEffect(() => {
    setScreen(SCREEN_BY_PATH[location.pathname] || 'landing');
  }, [location.pathname, setScreen]);

  return null;
}

function Layout({ children }) {
  const location = useLocation();
  if (location.pathname === "/") {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto relative">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScreenSync />
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#24252b',
          color: '#faf8fe',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }} />
      <GlobalLoader />
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/extract" element={<SkillExtraction />} />
            <Route path="/gap" element={<GapMap />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/reasoning" element={<Reasoning />} />
            <Route path="/test" element={<Test />} />
            <Route path="/simulation" element={<Simulation />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </Router>
  );
}

export default App;
