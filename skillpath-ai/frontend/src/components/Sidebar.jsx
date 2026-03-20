import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Upload, Sparkles, Target, Map, BookOpen, Brain, CheckSquare, Code2 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Upload', icon: Upload, screenId: 'landing' },
  { path: '/extract', label: 'Skills', icon: Sparkles, screenId: 'extract' },
  { path: '/gap', label: 'Gap Map', icon: Target, screenId: 'gap' },
  { path: '/roadmap', label: 'Roadmap', icon: Map, screenId: 'roadmap' },
  { path: '/courses', label: 'Courses', icon: BookOpen, screenId: 'courses' },
  { path: '/reasoning', label: 'Reasoning', icon: Brain, screenId: 'reasoning' },
  { path: '/test', label: 'Test', icon: CheckSquare, screenId: 'test' },
  { path: '/simulation', label: 'Simulation', icon: Code2, screenId: 'simulation' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, reset, setScreen } = useAppStore();

  const handleNav = (item) => {
    setScreen(item.screenId);
    navigate(item.path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-white/5 flex flex-col z-50">
      <div className="p-6">
        <h1 className="font-headline font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dim tracking-tight">
          SkillPath AI
        </h1>
        <p className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mt-1.5 font-bold">
          The Digital Oracle
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-surface-container-high text-primary border-l-2 border-primary' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-surface-container p-4 rounded-xl">
          <p className="text-xs text-on-surface-variant mb-3 font-mono truncate">
            {sessionId ? `ID: ${sessionId.split('-')[0]}...` : 'No Active Session'}
          </p>
          <button
            onClick={() => {
              reset();
              navigate('/');
            }}
            className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest text-sm text-on-surface rounded-lg transition-colors border border-white/5"
          >
            New Session
          </button>
        </div>
      </div>
    </div>
  );
}
