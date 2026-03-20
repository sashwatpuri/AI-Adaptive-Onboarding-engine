import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getReasoningTrace } from '../lib/api';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, TrendingUp, ChevronDown, FileText } from 'lucide-react';

export default function Reasoning() {
  const { sessionId, reasoningTrace, addTraceEntries } = useAppStore();
  const [traces, setTraces] = useState(reasoningTrace);
  const [openIds, setOpenIds] = useState([0]); // First open by default

  useEffect(() => {
    if (sessionId) {
      getReasoningTrace(sessionId).then(data => {
        if (data && data.decisions) {
           // Merge or replace traces (in demo, store might already have it)
           // For simplicity, we just use the API trace if available, else fallback to store.
           if (data.decisions.length > 0) setTraces(data.decisions);
        }
      });
    }
  }, [sessionId]);

  const toggleAccordion = (id) => {
    setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getBadgeStyle = (type) => {
    if (type === 'SKILL_PLACEMENT') return 'bg-primary/15 text-primary border-primary/20';
    if (type === 'COURSE_SELECTION') return 'bg-secondary/15 text-secondary border-secondary/20';
    if (type === 'GAP_ANALYSIS') return 'bg-[#34fa96]/15 text-[#34fa96] border-[#34fa96]/20';
    if (type === 'ROADMAP_REROUTE') return 'bg-amber-400/15 text-amber-400 border-amber-400/20';
    return 'bg-white/10 text-white border-white/20'; // Default fallback
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 relative">
      {/* AI Mesh gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at top left, rgba(186,158,255,0.06), transparent 40%), radial-gradient(circle at bottom right, rgba(246,115,183,0.06), transparent 40%)`
      }}></div>

      <div className="relative z-10">
        <div className="mb-10 text-center">
          <h2 className="font-headline font-extrabold text-4xl mb-4">Strategic Reasoning Trace</h2>
          <p className="text-on-surface-variant text-lg">Transparent audit log of every decision made by the AI orchestration engine.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.1 }} className="flex items-center px-5 py-3 bg-surface-container rounded-full border border-white/5">
            <Zap size={18} className="text-primary mr-2" />
            <span className="text-sm font-bold text-on-surface">{traces.length} Orchestration Decisions</span>
          </motion.div>
          
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.2 }} className="flex items-center px-5 py-3 bg-surface-container rounded-full border border-white/5">
            <ShieldCheck size={18} className="text-[#34fa96] mr-2" />
            <span className="text-sm font-bold text-on-surface">100% Grounded Output</span>
          </motion.div>
          
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.3 }} className="flex items-center px-5 py-3 bg-surface-container rounded-full border border-white/5">
            <TrendingUp size={18} className="text-secondary mr-2" />
            <span className="text-sm font-bold text-on-surface">Continual Optimization</span>
          </motion.div>
        </div>

        {traces.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant bg-surface-container-low rounded-3xl border border-white/5">
            No reasoning trace available yet. Complete an analysis first.
          </div>
        ) : (
          <div className="space-y-4">
            {traces.map((trace, i) => {
              const isOpen = openIds.includes(i);
              const confPercent = trace.confidence || 0;
              const confColor = confPercent > 85 ? 'from-primary to-primary-dim' : confPercent >= 70 ? 'from-secondary to-secondary' : 'from-amber-400 to-amber-500';

              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10"
                >
                  <div 
                    onClick={() => toggleAccordion(i)}
                    className="p-5 cursor-pointer flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-surface-container-high transition-colors select-none"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getBadgeStyle(trace.type)} min-w-[140px] text-center`}>
                        {trace.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-headline font-bold text-on-surface text-base">{trace.summary}</h4>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Confidence</span>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${confColor}`} style={{ width: `${confPercent}%` }}></div>
                          </div>
                          <span className="text-xs font-mono font-bold text-on-surface w-7">{confPercent}%</span>
                        </div>
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 bg-surface-container-low' : ''}`}>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-surface-container-low"
                    >
                      <div className="p-6">
                        <p className="text-on-surface text-sm mb-6 leading-relaxed bg-surface-container p-4 rounded-xl border-l-2 border-primary">
                          {trace.reasoning}
                        </p>
                        
                        {trace.evidence && trace.evidence.length > 0 && (
                          <div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3 block">Evidence Matrix</span>
                            <div className="flex flex-wrap gap-2">
                              {trace.evidence.map((ev, j) => (
                                <div key={j} className="flex items-center bg-surface-container-highest rounded-full border border-white/5 px-3 py-1.5">
                                  <FileText size={12} className="text-primary mr-2 opacity-70" />
                                  <span className="text-xs text-on-surface font-medium">{ev}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
