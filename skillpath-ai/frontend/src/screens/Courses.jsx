import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Courses() {
  const roadmap = useAppStore(state => state.roadmap);
  const [activeFilter, setActiveFilter] = useState('All');

  const currentCourses = useMemo(() => {
    const inProgressMonth = roadmap?.find(m => m.status === 'in_progress');
    return inProgressMonth?.courses || [];
  }, [roadmap]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return currentCourses;
    if (activeFilter === 'High Relevance') return currentCourses.filter(c => c.relevance_score >= 80);
    if (activeFilter === 'Short Duration') return currentCourses.filter(c => c.duration_hrs <= 20);
    return currentCourses;
  }, [currentCourses, activeFilter]);

  if (!roadmap || roadmap.length === 0) {
    return <div className="text-center py-20 text-on-surface-variant">Generate a roadmap first to see tailored courses.</div>;
  }

  if (currentCourses.length === 0) {
    return <div className="text-center py-20 text-on-surface-variant">No recommended courses for the current sprint. (Check demo fixtures or API connection)</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="mb-10 text-center">
        <h2 className="font-headline font-extrabold text-4xl mb-4">Curated Curriculum</h2>
        <p className="text-on-surface-variant text-lg">Hyper-relevant materials strictly aligned with your current sprint goals.</p>
      </div>

      <div className="flex justify-center gap-3 mb-10">
        {['All', 'High Relevance', 'Short Duration'].map(f => (
          <button 
            key={f} onClick={() => setActiveFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === f 
              ? 'bg-primary text-background shadow-[0_0_15px_rgba(186,158,255,0.4)]' 
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((course, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-container rounded-2xl p-6 border border-white/5 hover:bg-surface-container-high hover:scale-[1.02] transition-all duration-300 group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-surface-container-highest px-3 py-1 rounded-lg text-xs font-bold text-on-surface uppercase tracking-wider">
                {course.platform}
              </span>
              <span className="flex items-center text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-white/5">
                <Clock size={12} className="mr-1.5 opacity-70" /> {course.duration_hrs} hrs
              </span>
            </div>

            <h3 className="font-headline font-bold text-xl mb-3 text-on-surface group-hover:text-primary transition-colors line-clamp-2">
              {course.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-6">
              {course.skills_covered?.slice(0,3).map((s, j) => (
                <span key={j} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[10px] font-bold tracking-wide">
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-on-surface-variant mb-1.5 font-semibold">
                  <span>Relevance Match</span>
                  <span className="text-primary">{course.relevance_score}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-dim" style={{ width: `${course.relevance_score}%` }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <a 
                  href={course.url || "#"} target="_blank" rel="noreferrer"
                  className="flex items-center text-sm font-bold text-on-surface hover:text-primary transition-colors"
                >
                  View Course <ExternalLink size={14} className="ml-2" />
                </a>
                
                <div className="bg-[#34fa96]/10 border border-[#34fa96]/30 text-[#34fa96] rounded-full px-3 py-1.5 text-xs font-bold flex items-center shadow-[0_0_10px_rgba(52,250,150,0.1)] group-hover:shadow-[0_0_15px_rgba(52,250,150,0.2)] transition-shadow cursor-help" title="From verified catalog. Not AI-generated.">
                  <ShieldCheck size={14} className="mr-1.5" /> Grounded
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
