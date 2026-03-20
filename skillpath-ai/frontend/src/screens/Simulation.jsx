import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { runSimulation } from '../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Code2, Play, Send, LayoutTemplate, BriefcaseBusiness, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Simulation() {
  const { sessionId, testData, setLoading } = useAppStore();
  const [tab, setTab] = useState("coding");
  
  // Coding State
  const [code, setCode] = useState("def run():\n    # Implement here\n    pass");
  const [codeFeedback, setCodeFeedback] = useState(null);
  
  // Scenario State
  const [scenarioText, setScenarioText] = useState("");
  const [scenarioFeedback, setScenarioFeedback] = useState(null);

  const wordCount = scenarioText.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleRunCode = () => {
    toast.success("All local test cases passed!", { icon: "✅" });
  };

  const handleSubmitCode = async () => {
    try {
      setLoading(true, "AI Grader reviewing implementation...");
      if (sessionId) {
        const res = await runSimulation("coding", code, "sim_1", sessionId);
        setCodeFeedback(res);
      } else {
        // Mock
        setTimeout(() => {
          setCodeFeedback({
            score: 3, label: "3/3",
            feedback: { correctness: "Perfect implementation. Handles edge cases well.", next_steps: "Proceed to next sprint." }
          });
          setLoading(false);
        }, 1500);
        return;
      }
    } catch(e) {
      toast.error("Failed to grade code.");
    } finally { setLoading(false); }
  };

  const handleSubmitScenario = async () => {
    try {
      setLoading(true, "Assessing leadership response...");
      if (sessionId) {
        const res = await runSimulation("scenario", scenarioText, "sim_2", sessionId);
        setScenarioFeedback(res);
      } else {
        // Mock
        setTimeout(() => {
          setScenarioFeedback({
            score: 2, label: "2/3",
            feedback: { correctness: "Clear communication plan.", missing: "Failed to account for stakeholder pushback.", next_steps: "Review conflict resolution module." }
          });
          setLoading(false);
        }, 1500);
        return;
      }
    } catch(e) {
      toast.error("Failed to grade scenario.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="mb-10 text-center">
        <h2 className="font-headline font-extrabold text-4xl mb-4">Real-World Simulation</h2>
        <p className="text-on-surface-variant text-lg">Prove mastery through applied, interactive environments.</p>
      </div>

      <div className="flex justify-center border-b border-white/10 mb-8 max-w-sm mx-auto">
        <button 
          onClick={() => setTab("coding")} 
          className={`flex-1 py-3 text-center font-bold text-sm transition-colors border-b-2 flex justify-center items-center ${tab === 'coding' ? 'border-tertiary text-tertiary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
        >
          <Code2 size={16} className="mr-2" /> Coding Task
        </button>
        <button 
          onClick={() => setTab("scenario")} 
          className={`flex-1 py-3 text-center font-bold text-sm transition-colors border-b-2 flex justify-center items-center ${tab === 'scenario' ? 'border-tertiary text-tertiary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
        >
          <BriefcaseBusiness size={16} className="mr-2" /> Scenario
        </button>
      </div>

      {tab === "coding" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-6 h-[600px]">
          
          <div className="w-full lg:w-1/3 bg-surface-container rounded-2xl p-6 border border-white/5 flex flex-col overflow-y-auto">
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-surface-container-highest text-[10px] font-bold uppercase tracking-wider rounded text-on-surface">Month 1</span>
              <span className="px-2 py-1 bg-primary/20 text-[10px] font-bold uppercase tracking-wider rounded text-primary">Python</span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-4 text-on-surface">Data Pipeline Aggregation</h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              Write a Python function <code className="bg-surface-container-highest px-1.5 py-0.5 rounded font-mono text-primary text-xs">aggregate_sales(data)</code> that takes a list of dictionaries and returns the total sales per department. Handle missing keys gracefully.
            </p>
            
            <div className="bg-[#020817] rounded-xl p-4 font-mono text-xs border border-white/5 mb-6">
              <div className="text-on-surface-variant mb-2"># Expected Input</div>
              <div className="text-primary/70 mb-4">{"data = [{'dept':'IT','sales':100}, {'dept':'HR'}]"}</div>
              <div className="text-on-surface-variant mb-2"># Expected Output</div>
              <div className="text-[#34fa96]">{"{'IT': 100, 'HR': 0}"}</div>
            </div>

            <div className="flex items-center gap-2 mt-auto">
               <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant">Complexity: Intermediate</span>
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col border border-white/5 rounded-2xl overflow-hidden bg-[#0d0e12]">
            <div className="bg-surface-container-low px-4 py-2 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono text-on-surface-variant flex items-center"><LayoutTemplate size={14} className="mr-2" /> main.py</span>
              <div className="flex space-x-2">
                <button onClick={handleRunCode} className="px-4 py-1.5 text-xs font-bold rounded-lg border border-[#34fa96]/30 text-[#34fa96] hover:bg-[#34fa96]/10 flex items-center transition-colors">
                  <Play size={12} className="mr-1.5" /> Run Logic
                </button>
                <button onClick={handleSubmitCode} className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white hover:opacity-90 flex items-center transition-colors">
                  <Send size={12} className="mr-1.5" /> Submit Grade
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto relative">
              <CodeMirror
                value={code}
                height="100%"
                theme="dark"
                extensions={[python()]}
                onChange={setCode}
                className="text-sm rounded-b-2xl"
              />

              <AnimatePresence>
                {codeFeedback && (
                  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-4 left-4 right-4 bg-surface-container-highest border border-white/10 rounded-xl p-5 shadow-2xl z-10" style={{ backgroundImage: `radial-gradient(circle at top right, rgba(186,158,255,0.05), transparent)` }}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-headline font-bold text-lg flex items-center">
                        AI Grader Analysis
                      </h4>
                      <span className="text-2xl font-headline font-extrabold text-[#34fa96]">{codeFeedback.label}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-4">{codeFeedback.feedback.correctness}</p>
                    
                    {codeFeedback.score === 3 ? (
                      <div className="inline-flex items-center px-3 py-1 bg-secondary/15 text-secondary border border-secondary/20 rounded-full text-xs font-bold uppercase tracking-wide">
                        <Zap size={14} className="mr-2" /> Fast-track unlocked
                      </div>
                    ) : codeFeedback.score === 2 ? (
                      <div className="inline-flex items-center px-3 py-1 bg-primary/15 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wide">
                        <CheckCircle2 size={14} className="mr-2" /> Proceeding as planned
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-3 py-1 bg-amber-400/15 text-amber-400 border border-amber-400/20 rounded-full text-xs font-bold uppercase tracking-wide">
                        <AlertTriangle size={14} className="mr-2" /> Month reinforced
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </motion.div>
      )}

      {tab === "scenario" && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
           <div className="inline-flex px-3 py-1 bg-surface-container-high border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
             Role Context: Operations Manager
           </div>
           
           <div className="bg-surface-container rounded-2xl p-6 border border-white/5 relative overflow-hidden" style={{ backgroundImage: `radial-gradient(circle at bottom right, rgba(246,115,183,0.05), transparent 60%)` }}>
             <blockquote className="border-l-4 border-secondary bg-surface/40 p-5 rounded-r-xl mb-6 shadow-inner italic text-sm text-on-surface-variant">
               "The new ERP software rollout has fundamentally stalled in the logistics department. The team refuses to abandon the legacy system because they claim the new UI slows down dispatching by 15%."
             </blockquote>
             <h3 className="font-headline font-bold text-lg text-on-surface">Write a brief email to the Logistics Director outlining your immediate 3-step action plan to resolve this resistance.</h3>
           </div>

           <div className="relative">
             <textarea
               value={scenarioText} onChange={e => setScenarioText(e.target.value)}
               placeholder="Draft your response here (min 50 words)..."
               className="w-full h-48 bg-surface-container rounded-2xl p-6 border-2 border-white/5 focus:border-tertiary focus:outline-none focus:bg-surface-container-high transition-colors text-sm text-on-surface resize-none leading-relaxed"
             ></textarea>
             <div className={`absolute bottom-4 right-6 text-xs font-mono font-bold ${wordCount >= 50 ? 'text-[#34fa96]' : 'text-on-surface-variant/50'}`}>
               {wordCount} / 50 words
             </div>
           </div>

           <button 
             onClick={handleSubmitScenario} disabled={wordCount < 50}
             className={`w-full py-4 rounded-xl font-headline font-bold flex justify-center items-center transition-all ${wordCount >= 50 ? 'bg-gradient-to-r from-tertiary to-error text-white shadow-[0_5px_20px_rgba(246,115,183,0.3)] hover:-translate-y-1' : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'}`}
           >
             Submit Leadership Response <ArrowRight size={18} className="ml-2" />
           </button>

           <AnimatePresence>
             {scenarioFeedback && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                 <div className="mt-8 bg-surface-container rounded-2xl p-6 border border-white/5 flex gap-6">
                    <div className="w-24 h-24 shrink-0 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8} data={[{ value: (scenarioFeedback.score/3)*100, fill: '#f673b7' }]} startAngle={90} endAngle={-270}>
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar minAngle={15} background={{ fill: '#24252b' }} clockWise dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center font-headline font-extrabold text-xl text-tertiary">
                        {scenarioFeedback.label}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3 py-2">
                       <p className="flex items-start text-sm">
                         <CheckCircle2 size={16} className="text-[#34fa96] mr-3 mt-0.5 shrink-0" />
                         <span className="text-on-surface">{scenarioFeedback.feedback.correctness}</span>
                       </p>
                       {scenarioFeedback.feedback.missing && (
                         <p className="flex items-start text-sm">
                           <AlertTriangle size={16} className="text-amber-400 mr-3 mt-0.5 shrink-0" />
                           <span className="text-on-surface-variant font-medium">{scenarioFeedback.feedback.missing}</span>
                         </p>
                       )}
                       <p className="flex items-start text-sm">
                         <ArrowRight size={16} className="text-tertiary mr-3 mt-0.5 shrink-0" />
                         <span className="text-on-surface font-semibold">{scenarioFeedback.feedback.next_steps}</span>
                       </p>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

         </motion.div>
      )}
    </div>
  );
}
