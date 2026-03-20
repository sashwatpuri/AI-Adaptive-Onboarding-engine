import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

export default function GapMap() {
  const navigate = useNavigate();
  const gapMap = useAppStore(state => state.gapMap);
  
  if (!gapMap) {
    return <div className="text-center py-20">Analyzing gaps...</div>;
  }

  const skills = gapMap.skills || [];
  
  const getSeverityClasses = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-[#ff6e84]/15 text-[#ff6e84] border-[#ff6e84]/30';
      case 'MODERATE': return 'bg-[#34b5fa]/15 text-[#34b5fa] border-[#34b5fa]/30';
      case 'MINOR': return 'bg-[#ba9eff]/15 text-[#ba9eff] border-[#ba9eff]/30';
      default: return 'bg-white/5 text-on-surface-variant border-white/10';
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <div className="pb-32 px-4 md:px-12 relative">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-secondary">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Deep Intelligence Analysis</span>
          </div>
          <h1 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface leading-none">Skill Gap Map</h1>
          <p className="text-on-surface-variant max-w-lg text-lg">Visualizing the delta between your current proficiency and the requirements for <span className="text-primary font-semibold">Target Role</span>.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl ai-mesh relative overflow-hidden flex items-center gap-6 min-w-[320px]">
          <div className="relative z-10 flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-1">Aggregate Gap Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-headline text-primary">{gapMap.overall_readiness_pct}%</span>
              <span className="text-sm font-medium text-on-surface-variant">Ready</span>
            </div>
          </div>
          <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{width: `${gapMap.overall_readiness_pct}%`}}></div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-8xl" style={{fontVariationSettings: "'FILL' 1"}}>insights</span>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <div className="grid grid-cols-12 px-8 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
          <div className="col-span-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-secondary">bolt</span>
            Core Competency
          </div>
          <div className="col-span-3 text-center">Current Level</div>
          <div className="col-span-2 text-center">Gap Delta</div>
          <div className="col-span-3 text-center">Required Level</div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {skills.map((skill, i) => {
            const isCovered = skill.severity === "COVERED";
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-12 items-center bg-surface-container-low hover:bg-surface-container transition-all duration-300 p-8 rounded-2xl group border border-transparent ${isCovered ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
              >
                <div className="col-span-4 flex items-start justify-between pr-8">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{skill.skill}</h3>
                  </div>
                  <div className={`${getSeverityClasses(skill.severity)} rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider h-fit mt-1`}>
                    {skill.severity}
                  </div>
                </div>

                <div className="col-span-3 flex justify-center gap-1.5">
                  {[1,2,3].map(lvl => (
                    <div key={lvl} className={`w-2.5 h-2.5 rounded-full ${lvl <= skill.current_level ? 'bg-primary' : 'border border-primary/30'}`} />
                  ))}
                </div>

                <div className="col-span-2 flex justify-center">
                  {isCovered ? (
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">check_circle</span>
                  ) : (
                    <span className={`material-symbols-outlined text-2xl font-bold ${skill.severity === 'CRITICAL' ? 'text-[#ff6e84]' : skill.severity === 'MODERATE' ? 'text-[#34b5fa]' : 'text-[#ba9eff]'}`}>arrow_right_alt</span>
                  )}
                </div>

                <div className="col-span-3 flex justify-center gap-1.5">
                  {[1,2,3].map(lvl => (
                    <div key={lvl} className={`w-2.5 h-2.5 rounded-full ${lvl <= skill.required_level ? 'bg-secondary' : 'border border-secondary/30'}`} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {gapMap.skills.filter(s => s.severity === "CRITICAL").length > 0 && (
        <div className="fixed right-12 bottom-32 w-80 glass-panel rounded-2xl p-6 shadow-2xl z-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
            <h4 className="font-headline font-bold text-sm tracking-tight">AI REASONING</h4>
          </div>
          <p className="text-xs font-mono leading-relaxed text-on-surface-variant mb-6">
            Critical gap detected in <span className="text-error">{gapMap.skills.find(s => s.severity === "CRITICAL").skill}</span>. Current market demand requires expertise where you currently score Level {gapMap.skills.find(s => s.severity === "CRITICAL").current_level}. 
          </p>
        </div>
      )}

      <div className="fixed bottom-0 left-[256px] right-0 p-6 z-40">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <button onClick={() => navigate('/roadmap')} className="w-full max-w-sm mx-auto py-4 bg-gradient-to-br from-[#ba9eff] to-[#8455ef] rounded-xl text-on-primary-container font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
            <span>Generate Roadmap</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">auto_awesome</span>
          </button>
        </div>
      </div>
    </div>
  );
}
