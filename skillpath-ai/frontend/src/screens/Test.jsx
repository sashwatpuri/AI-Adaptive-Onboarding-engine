import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { generateTest, submitTest } from '../lib/api';
import toast from 'react-hot-toast';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Zap, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const DUMMY_QUESTIONS = [
  { id: 'q1', question: "What is the primary benefit of Python's GIL?", options: ['Multi-core parallelism', 'Memory management protection', 'Faster disk I/O', 'Network speed'], correct_index: 1, skill_tag: 'Python' },
  { id: 'q2', question: 'Which SQL statement is used to extract data from a base table?', options: ['EXTRACT', 'SELECT', 'GET', 'PULL'], correct_index: 1, skill_tag: 'SQL' }
];

export default function Test() {
  const navigate = useNavigate();
  const {
    sessionId,
    gapMap,
    roadmap,
    overallReadinessPct,
    currentMonth,
    testData,
    setTestData,
    setTestResults,
    setRoadmap,
    setLoading,
  } = useAppStore();

  const [phase, setPhase] = useState(sessionId ? 'loading' : 'testing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setLocalResults] = useState(null);
  const [loadError, setLoadError] = useState('');
  const lastLoadedKey = useRef('');

  const inProgressMonth = roadmap.find(month => month.status === 'in_progress')?.month;
  const monthNumber = inProgressMonth || currentMonth || 1;
  const questions = testData?.questions?.length ? testData.questions : DUMMY_QUESTIONS;
  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setLocalResults(null);
  }, [monthNumber]);

  useEffect(() => {
    let cancelled = false;

    if (!sessionId) {
      setPhase('testing');
      return;
    }

    const loadKey = `${sessionId}:${monthNumber}`;
    if (lastLoadedKey.current === loadKey) {
      setPhase('testing');
      return;
    }

    lastLoadedKey.current = loadKey;

    const prepareTest = async () => {
      try {
        setPhase('loading');
        setLoading(true, `Generating month ${monthNumber} assessment...`);
        const generated = await generateTest(monthNumber, sessionId);
        if (cancelled) return;
        setTestData({ ...generated, month: monthNumber, fallback: false });
        setLoadError('');
        setPhase('testing');
      } catch (error) {
        if (cancelled) return;
        setTestData({ questions: DUMMY_QUESTIONS, simulation_task: null, month: monthNumber, fallback: true });
        setLoadError(error.response?.data?.detail || error.message || 'Unable to generate the assessment.');
        setPhase('testing');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    prepareTest();

    return () => {
      cancelled = true;
    };
  }, [sessionId, monthNumber, setLoading, setTestData]);

  const handleSelect = (opt) => {
    if (!currentQ) return;
    setAnswers({ ...answers, [currentQ.id]: opt });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(c => c + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true, 'Grading Assessment & Re-routing Roadmap...');
      if (sessionId && !testData?.fallback) {
        const res = await submitTest(monthNumber, answers, '', sessionId);
        setLocalResults(res);
        setTestResults(res);
        if (res.updated_roadmap) {
          setRoadmap(gapMap, res.updated_roadmap, overallReadinessPct);
        }
      } else {
        const mockResults = {
          overall_score: 85,
          skill_scores: { Python: 100, SQL: 50 },
          rerouting: 'FAST_TRACK',
          updated_roadmap: []
        };
        setLocalResults(mockResults);
        setTestResults(mockResults);
      }
      setPhase('results');
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to grade test.');
    } finally {
      setLoading(false);
    }
  };

  if (phase === 'loading' && sessionId) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h2 className="font-headline font-extrabold text-3xl mb-4">Preparing Month {monthNumber} Assessment</h2>
        <p className="text-on-surface-variant">
          Generating the month-specific test from your roadmap.
        </p>
      </div>
    );
  }

  if (phase === 'results' && results) {
    const data = [{ name: 'Score', value: results.overall_score, fill: '#34fa96' }];
    const skillBreakdown = Object.entries(results.skill_scores || {});

    return (
      <div className="max-w-4xl mx-auto pb-24">
        <div className="text-center mb-12">
          <h2 className="font-headline font-extrabold text-4xl mb-4">Assessment Complete</h2>
          <p className="text-on-surface-variant text-lg">Your master roadmap has been dynamically recalibrated.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface-container rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center relative">
            <h3 className="font-headline font-bold text-xl text-on-surface mb-6">Overall Competency</h3>
            <div className="h-64 w-full relative flex items-center justify-center" style={{ minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={data} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar minAngle={15} background={{ fill: '#24252b' }} clockWise dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-headline font-extrabold text-[#34fa96]">{results.overall_score}%</span>
              </div>
            </div>

            <div className={`mt-6 px-6 py-2 rounded-full font-bold text-sm tracking-wide ${results.overall_score >= 80 ? 'bg-[#34fa96]/20 text-[#34fa96]' : results.overall_score >= 60 ? 'bg-primary/20 text-primary' : 'bg-amber-400/20 text-amber-400'}`}>
              STATUS: {results.rerouting}
            </div>
          </div>

          <div className="bg-surface-container rounded-3xl p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, rgba(186,158,255,0.1), transparent 50%)` }}></div>
            <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center relative z-10">
              <Zap className="text-primary mr-3" /> Adaptive Engine Re-routing
            </h3>

            <div className="space-y-6 relative z-10">
              {skillBreakdown.map(([skill, score], idx) => {
                const textClass = score >= 80 ? 'text-[#34fa96]' : score >= 60 ? 'text-primary' : 'text-amber-400';
                const fillClass = score >= 80 ? 'bg-[#34fa96]' : score >= 60 ? 'bg-primary' : 'bg-amber-400';

                return (
                  <div key={skill}>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span>{skill}</span>
                      <span className={textClass}>{score}%</span>
                    </div>
                    <Motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: idx * 0.2 }} className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${fillClass}`} style={{ width: `${score}%` }}></div>
                    </Motion.div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 bg-surface-container-high p-4 rounded-xl border-l-4 border-primary relative z-10">
              <p className="text-sm text-on-surface-variant font-medium">
                {results.rerouting_actions?.[0] || 'The adaptive engine updated the roadmap based on your latest assessment.'}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/roadmap')}
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dim text-white rounded-xl font-headline font-bold shadow-[0_5px_20px_rgba(186,158,255,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center mx-auto space-x-2"
          >
            <span>View Updated Roadmap</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return <div className="text-center py-20">No assessment available.</div>;
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const hasAnswered = answers[currentQ.id] !== undefined;

  return (
    <div className="max-w-3xl mx-auto py-12">
      {loadError && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
          {loadError}
        </div>
      )}

      <div className="mb-12">
        <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
          <span>Sprint Assessment</span>
          <span>Month {monthNumber} - Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <Motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-dim"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
          <Motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
        >
          <div className="bg-surface-container rounded-3xl p-8 md:p-12 border border-white/5 mb-8">
            <span className="inline-block px-3 py-1 rounded bg-surface-container-highest text-primary text-xs font-bold mb-6">
              {currentQ.skill_tag}
            </span>
            <h3 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface leading-snug mb-10">
              {currentQ.question}
            </h3>

            <div className="space-y-4">
              {currentQ.options.map((opt, i) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-medium flex items-center ${isSelected ? 'bg-primary/10 border-primary text-on-surface shadow-[0_0_15px_rgba(186,158,255,0.15)] scale-[1.01]' : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-primary/30 hover:bg-surface-container-high'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary' : 'border-white/20'}`}>
                      {isSelected && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </Motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-on-surface-variant hover:bg-surface-container'}`}
        >
          <ArrowLeft size={18} className="mr-2" /> Prev
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswered}
            className={`flex items-center space-x-2 px-10 py-4 bg-gradient-to-r from-primary to-primary-dim text-white rounded-xl font-bold transition-all ${hasAnswered ? 'hover:shadow-[0_0_20px_rgba(186,158,255,0.4)] hover:-translate-y-1' : 'opacity-50 cursor-not-allowed'}`}
          >
            <span>Submit Assessment</span> <CheckCircle2 size={18} />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className={`flex items-center space-x-2 px-8 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-all border border-white/10 ${!hasAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>Next</span> <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
