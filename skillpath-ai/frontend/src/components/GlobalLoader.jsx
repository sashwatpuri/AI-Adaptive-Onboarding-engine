import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function GlobalLoader() {
  const { isLoading, loadingMessage } = useAppStore();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
        >
          <div className="flex flex-col items-center bg-surface-container-high border border-white/10 rounded-3xl p-10 shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
            {/* Spinning gradient ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-transparent border-t-primary border-r-secondary border-b-tertiary animate-spin opacity-50 blur-[2px]"></div>
            
            <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-[0_0_30px_rgba(186,158,255,0.2)]">
               <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin"></div>
            </div>
            
            <h3 className="font-headline font-bold text-xl text-on-surface mb-2 relative z-10">Digital Oracle Processing</h3>
            <p className="text-on-surface-variant text-sm font-medium animate-pulse relative z-10">
              {loadingMessage || "Orchestrating AI pipeline..."}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
