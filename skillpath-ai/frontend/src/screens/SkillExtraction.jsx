import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Target } from 'lucide-react';

const TECHNICAL_SKILLS = ["Python","SQL","JavaScript","React","Docker","Git","PyTorch","TensorFlow","FastAPI","Node.js","AWS","GCP","Kubernetes","MongoDB","PostgreSQL","Redis","Scikit-learn","NumPy","Pandas","HTML/CSS","TypeScript","Java","C++","Machine Learning","Deep Learning","MLOps","Feature Engineering","NLP","Computer Vision","Data Engineering","Statistics"];
const SOFT_SKILLS = ["Communication","Leadership","Problem Solving","Teamwork","Project Management","Critical Thinking","Adaptability","Time Management","Creativity","Collaboration","Presentation","Negotiation"];

function getCategoryColor(cat) {
  if (cat === 'Technical') return 'text-primary bg-primary/10 border-primary/20';
  if (cat === 'Soft Skills') return 'text-secondary bg-secondary/10 border-secondary/20';
  return 'text-tertiary bg-tertiary/10 border-tertiary/20';
}

function getConfidenceColor(conf) {
  if (conf >= 80) return 'bg-[#34fa96]';
  if (conf >= 50) return 'bg-amber-400';
  return 'bg-error';
}

export default function SkillExtraction() {
  const navigate = useNavigate();
  const rawSkills = useAppStore(state => state.resumeSkills);
  const [skills, setSkills] = useState(rawSkills);
  
  const categorized = useMemo(() => {
    return skills.map(s => {
      let cat = "Domain Knowledge";
      if (TECHNICAL_SKILLS.some(t => t.toLowerCase() === s.skill.toLowerCase())) cat = "Technical";
      else if (SOFT_SKILLS.some(t => t.toLowerCase() === s.skill.toLowerCase())) cat = "Soft Skills";
      return { ...s, displayCategory: cat };
    });
  }, [skills]);

  const removeSkill = (skillName) => {
    setSkills(prev => prev.filter(s => s.skill !== skillName));
  };

  const tsCount = categorized.filter(s => s.displayCategory === 'Technical').length;
  const ssCount = categorized.filter(s => s.displayCategory === 'Soft Skills').length;
  const dkCount = categorized.filter(s => s.displayCategory === 'Domain Knowledge').length;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h2 className="font-headline font-extrabold text-3xl mb-6 flex items-center">
          <Sparkles className="mr-3 text-primary" size={28} /> Extracted Profiling
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {categorized.map(skill => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.15 } }}
                className="group relative"
              >
                <div className={`px-4 py-2 rounded-full border border-white/5 bg-surface-container hover:border-primary/30 transition-colors flex flex-col justify-center items-center min-w-[120px] cursor-default`}>
                  <span className="font-semibold text-sm text-on-surface mb-1">{skill.skill}</span>
                  <div className="w-full h-0.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${getConfidenceColor(skill.confidence)}`} style={{ width: `${skill.confidence}%` }}></div>
                  </div>
                  
                  <button 
                    onClick={() => removeSkill(skill.skill)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-error hover:bg-surface-container-high border border-white/10"
                  >
                    <X size={12} />
                  </button>

                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-surface-container-highest border border-white/10 rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl backdrop-blur-md">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-container-highest border-t border-l border-white/10 rotate-45"></div>
                    <div className="relative z-10">
                      <p className="text-primary font-bold text-sm mb-1">{skill.confidence}% confidence</p>
                      <ul className="text-on-surface-variant text-xs space-y-1 list-disc pl-3">
                        {skill.evidence?.map((ev, i) => <li key={i}>{ev}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="sticky top-8 bg-surface-container rounded-3xl p-6 border border-white/5 shadow-lg">
          <div className="text-primary font-headline font-extrabold text-5xl tracking-tight mb-2">
            {categorized.length}
          </div>
          <p className="text-on-surface text-lg font-headline font-bold mb-1">Skills detected</p>
          <p className="text-on-surface-variant text-sm mb-6 pb-6 border-b border-white/5">Across 3 categories</p>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-primary bg-primary/10">Technical</span>
              <span className="text-on-surface font-mono">{tsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-secondary bg-secondary/10">Soft Skills</span>
              <span className="text-on-surface font-mono">{ssCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-tertiary bg-tertiary/10">Domain</span>
              <span className="text-on-surface font-mono">{dkCount}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/gap')}
            className="w-full py-4 rounded-xl flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-primary-dim text-white font-bold hover:shadow-[0_0_20px_rgba(186,158,255,0.3)] transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Proceed to Gap Map</span>
            <Target size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
