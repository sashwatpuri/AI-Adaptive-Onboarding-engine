import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '../store/useAppStore';
import { uploadDocuments, extractSkills, generateRoadmap } from '../lib/api';
import toast from 'react-hot-toast';
import { FileText, Type, ArrowRight, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();
  const { setSession, setTexts, setSkills, setRoadmap, loadDemoPersona, setLoading } = useAppStore();
  
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [isJdTextMode, setIsJdTextMode] = useState(false);

  const onDropResume = useCallback((acceptedFiles) => {
    setResumeFile(acceptedFiles[0]);
  }, []);

  const onDropJd = useCallback((acceptedFiles) => {
    setJdFile(acceptedFiles[0]);
  }, []);

  const { getRootProps: getResumeProps, getInputProps: getResumeInput } = useDropzone({
    onDrop: onDropResume,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const { getRootProps: getJdProps, getInputProps: getJdInput } = useDropzone({
    onDrop: onDropJd,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleDemo = async (type) => {
    try {
      const res = await fetch(`/demos/${type}.json`);
      const data = await res.json();
      
      const t = toast.loading("Analysing...");
      setTimeout(() => {
        toast.dismiss(t);
        loadDemoPersona(data);
        navigate("/extract");
      }, 1500);
    } catch (e) {
      toast.error("Failed to load demo setup.");
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true, "Assessing alignment...");
      toast.loading("Uploading documents...", { id: "main-toast" });

      const uploadRes = await uploadDocuments(resumeFile, jdFile, jdText);
      const sessionId = uploadRes.session_id;

      toast.loading("Extracting precise skills...", { id: "main-toast" });
      const extractRes = await extractSkills(uploadRes.resume_text, uploadRes.jd_text, sessionId);
      
      toast.loading("Identifying critical gaps...", { id: "main-toast", duration: 10000 });
      const mapRes = await generateRoadmap(sessionId);

      setSession(sessionId);
      setTexts(uploadRes.resume_text, uploadRes.jd_text);
      setSkills(extractRes.resume_skills, extractRes.jd_skills);
      setRoadmap(mapRes.gap_map, mapRes.roadmap, mapRes.overall_readiness_pct);

      toast.success("Analysis complete!", { id: "main-toast" });
      navigate("/extract");
    } catch (e) {
      toast.dismiss("main-toast");
    } finally {
      setLoading(false);
    }
  };

  const canStart = resumeFile && (jdFile || (isJdTextMode && jdText.length > 50));

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-headline font-extrabold text-on-surface tracking-tight mb-4">
          We don't train employees.<br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dim">
            We eliminate what they don't need to learn.
          </span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mt-6">
          Upload your resume and the target job description. The Digital Oracle will parse the requirements and generate your hyper-personalized, adaptive learning roadmap.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div {...getResumeProps()} className="group border-2 border-dashed border-white/10 bg-surface-container-low rounded-3xl p-8 hover:border-[#34b5fa]/50 hover:bg-[#34b5fa]/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[250px]">
          <input {...getResumeInput()} />
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-[#34b5fa] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText size={32} />
          </div>
          <h3 className="font-headline font-bold text-xl mb-2 text-on-surface">Upload Resume (PDF)</h3>
          {resumeFile ? (
            <div className="bg-[#34b5fa]/10 text-[#34b5fa] px-4 py-2 rounded-lg text-sm font-medium truncate max-w-[200px] border border-[#34b5fa]/20">
              {resumeFile.name}
            </div>
          ) : (
            <p className="text-on-surface-variant text-sm">Drag & drop or click to select</p>
          )}
        </div>

        <div className="border-2 border-dashed border-white/10 bg-surface-container-low rounded-3xl relative flex flex-col overflow-hidden transition-all hover:border-[#ba9eff]/50">
          {!isJdTextMode ? (
            <>
              <div {...getJdProps()} className="group flex-1 hover:bg-[#ba9eff]/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-8 min-h-[200px]">
                <input {...getJdInput()} />
                <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-[#ba9eff] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={32} />
                </div>
                <h3 className="font-headline font-bold text-xl mb-2 text-on-surface">Upload JD (PDF)</h3>
                {jdFile ? (
                   <div className="bg-[#ba9eff]/10 text-[#ba9eff] px-4 py-2 rounded-lg text-sm font-medium truncate max-w-[200px] border border-[#ba9eff]/20">
                     {jdFile.name}
                   </div>
                ) : (
                   <p className="text-on-surface-variant text-sm">Target job description</p>
                )}
              </div>
              <button 
                onClick={() => setIsJdTextMode(true)} 
                className="py-3 text-center text-sm font-semibold text-primary/80 hover:text-primary bg-surface-container-high border-t border-white/5 flex items-center justify-center w-full transition-colors"
               >
                <Type size={16} className="mr-2" /> Paste text instead
              </button>
            </>
          ) : (
            <div className="flex flex-col h-full bg-surface-container-low">
              <div className="p-4 flex-1 flex flex-col h-full">
                <h3 className="font-headline font-bold mb-3 flex items-center text-primary">
                  <Type size={18} className="mr-2" /> Paste JD
                </h3>
                <textarea
                  value={jdText} onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full flex-1 bg-surface-container-high p-4 rounded-xl border border-white/5 text-sm text-on-surface resize-none focus:outline-none focus:border-primary/50 transition-colors placeholder:text-on-surface-variant/50 block min-h-[140px]"
                />
              </div>
              <button 
                onClick={() => setIsJdTextMode(false)} 
                className="py-3 text-center text-sm font-semibold text-on-surface-variant hover:text-on-surface bg-surface-container-high border-t border-white/5 flex items-center justify-center w-full transition-colors"
               >
                <FileText size={16} className="mr-2" /> Use PDF instead
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mb-16">
        <button
          onClick={handleStart} disabled={!canStart}
          className={`flex items-center space-x-3 px-12 py-4 rounded-2xl font-headline font-bold text-lg transition-all ${
            canStart 
            ? 'bg-gradient-to-r from-primary to-primary-dim text-white shadow-[0_0_30px_rgba(186,158,255,0.4)] hover:scale-105 active:scale-95'
            : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'
          }`}
        >
          <span>Analyze Gap Map & Build Roadmap</span>
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="border-t border-white/5 pt-10">
        <h4 className="text-center font-headline font-bold text-on-surface-variant mb-6 flex items-center justify-center">
          <Bot size={18} className="mr-2" />
          Or try an instant demo scenario (Judges start here)
        </h4>
        <div className="flex justify-center flex-wrap gap-4">
          <button onClick={() => handleDemo('ml_engineer')} className="group flex items-center space-x-4 bg-surface-container hover:bg-surface-container-high border border-white/5 hover:border-white/10 px-6 py-4 rounded-2xl transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(186,158,255,0.15)]">🚀</div>
            <div className="text-left">
              <div className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">ML Engineer</div>
              <div className="text-xs text-on-surface-variant font-medium mt-0.5">Technical path w/ simulation</div>
            </div>
          </button>
          
          <button onClick={() => handleDemo('ops_manager')} className="group flex items-center space-x-4 bg-surface-container hover:bg-surface-container-high border border-white/5 hover:border-white/10 px-6 py-4 rounded-2xl transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(52,181,250,0.15)]">📊</div>
            <div className="text-left">
              <div className="font-headline font-bold text-sm text-on-surface group-hover:text-secondary transition-colors">Ops Manager</div>
              <div className="text-xs text-on-surface-variant font-medium mt-0.5">Non-technical leadership path</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
