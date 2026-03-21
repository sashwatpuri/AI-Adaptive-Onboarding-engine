import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Lock, CheckCircle2, ChevronDown, Zap, ExternalLink, Brain } from 'lucide-react';

export default function Roadmap() {
  const navigate = useNavigate();
  const { roadmap, overallReadinessPct, setCurrentMonth } = useAppStore();
  const [expandedMonth, setExpandedMonth] = useState(1);

  if (!roadmap || roadmap.length === 0) {
    return <div className="text-center py-20">No roadmap generated yet.</div>;
  }

  const data = [{ name: 'Readiness', value: overallReadinessPct, fill: '#ba9eff' }];

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 pb-20">
      
      <div className="flex-1 relative">
        <div className="absolute left-7 top-10 bottom-10 w-[2px] bg-surface-container-highest z-0"></div>
        
        <div className="space-y-8 relative z-10">
          {roadmap.map((month) => {
            const isLocked = month.status === 'locked';
            const isCompleted = month.status === 'completed';
            const isInProgress = month.status === 'in_progress';
            const isExpanded = expandedMonth === month.month;

            return (
              <Motion.div 
                key={month.month}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: month.month * 0.1 }}
                className={`relative flex items-start gap-6 ${isLocked ? 'filter grayscale opacity-40 pointer-events-none' : ''}`}
              >
                {/* Timeline Node */}
                <div className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-headline font-extrabold text-xl z-10 border-4 border-background transition-colors ${
                  isInProgress ? 'bg-primary text-background shadow-[0_0_24px_rgba(186,158,255,0.4)]' : 
                  isCompleted ? 'bg-secondary/20 text-secondary' : 
                  'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {isLocked ? <Lock size={20} /> : month.month}
                </div>
                
                {/* Node Line Glow for current month */}
                {isInProgress && (
                  <div className="absolute left-7 top-14 w-[2px] h-full bg-primary/50 shadow-[0_0_10px_#ba9eff] z-0 -translate-x-[1px]"></div>
                )}

                {/* Card */}
                <div 
                  className={`flex-1 bg-surface-container overflow-hidden rounded-2xl transition-all duration-300 ${
                    isInProgress ? 'border border-primary/30 shadow-[0_0_24px_rgba(186,158,255,0.1)]' : 
                    isCompleted ? 'border border-secondary/30' : 
                    'border border-white/5'
                  }`}
                >
                  <div 
                    className="p-6 cursor-pointer hover:bg-surface-container-high transition-colors flex justify-between items-center"
                    onClick={() => !isLocked && setExpandedMonth(isExpanded ? null : month.month)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <h3 className="font-headline font-extrabold text-xl text-on-surface">{month.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {month.estimated_hours} hrs total
                        </span>
                        {month.has_simulation && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-tertiary/15 text-tertiary border border-tertiary/30 flex items-center gap-1">
                            <Zap size={12} /> Simulation
                          </span>
                        )}
                        {isCompleted && <CheckCircle2 size={20} className="text-secondary ml-2" />}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate('/reasoning'); }}
                        className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[#34fa96] hover:bg-[#34fa96]/20 transition-colors"
                        title="View AI Reasoning"
                      >
                        <Brain size={14} />
                      </button>
                      <ChevronDown size={20} className={`text-on-surface-variant transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <Motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-surface-container-low"
                      >
                        <div className="p-6">
                          <div className="flex flex-wrap gap-2 mb-6">
                            {month.skills.map(s => (
                              <span key={s} className="px-3 py-1 bg-surface-container-highest rounded-md text-xs font-mono text-on-surface-variant">
                                TARGET: {s} → <span className="text-primary font-bold">{month.target_levels[s]}</span>
                              </span>
                            ))}
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-headline font-bold text-sm text-on-surface-variant uppercase tracking-wider">Curated Grounded Material</h4>
                            {month.courses && month.courses.length > 0 ? (
                              <div className="grid md:grid-cols-2 gap-4">
                                {month.courses.map((c, i) => (
                                  <div key={i} className="bg-surface-container p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="text-xs bg-surface-container-high px-2 py-1 rounded text-on-surface-variant">{c.platform}</span>
                                      <span className="bg-[#34fa96]/10 border border-[#34fa96]/30 text-[#34fa96] rounded-full px-2 py-0.5 text-[10px] items-center flex font-bold lowercase tracking-wider">
                                        ✓ Grounded
                                      </span>
                                    </div>
                                    <h5 className="font-headline font-bold text-sm mb-1 leading-tight group-hover:text-primary transition-colors">{c.title}</h5>
                                    
                                    <div className="mt-3 flex items-center justify-between">
                                      <div className="flex-1 mr-4">
                                        <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                                          <span>Relevance</span>
                                          <span>{c.relevance_score}%</span>
                                        </div>
                                        <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                          <div className="h-full bg-gradient-to-r from-primary to-primary-dim" style={{ width: `${c.relevance_score}%` }}></div>
                                        </div>
                                      </div>
                                      <a href={c.url} target="_blank" rel="noreferrer" className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white transition-colors">
                                        <ExternalLink size={12} />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-on-surface-variant py-2">Material curation skipped for this demo.</div>
                            )}
                          </div>

                          {isInProgress && (
                            <div className="mt-8 flex justify-end">
                              <button 
                                onClick={() => {
                                  setCurrentMonth(month.month);
                                  navigate('/test');
                                }}
                                className="px-6 py-3 bg-white text-background rounded-xl font-bold hover:bg-gray-200 transition-colors"
                              >
                                Take Month-End Test →
                              </button>
                            </div>
                          )}
                        </div>
                      </Motion.div>
                  )}
                  </AnimatePresence>
                </div>
              </Motion.div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-80 h-auto self-start sticky top-8">
        <div className="bg-surface-container rounded-3xl p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
          
          <h3 className="font-headline font-bold text-lg mb-6 text-on-surface relative z-10">Overall Readiness</h3>
          
          <div className="w-full relative mb-4" style={{ height: '200px', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={data} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar minAngle={15} background={{ fill: '#24252b' }} clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-headline font-extrabold text-primary">{overallReadinessPct}%</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Ready</span>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="bg-background/50 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-on-surface-variant mb-1">Current Focus</p>
              <p className="text-sm font-semibold text-primary">{roadmap.find(r => r.status === 'in_progress')?.title || 'Completed'}</p>
            </div>
            
            <button 
              onClick={() => navigate('/reasoning')}
              className="w-full py-3 bg-surface-container-high rounded-xl text-sm font-semibold text-on-surface hover:text-white transition-colors border border-white/5"
            >
              View Strategic AI Reasoning
            </button>
          </div>
        </div>
      </div>
    
    </div>
  );
}
