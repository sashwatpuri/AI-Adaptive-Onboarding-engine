import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-surface-container-high border border-error/20 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h2 className="font-headline font-bold text-2xl mb-4 text-on-surface">System Disruption</h2>
            <p className="text-on-surface-variant text-sm mb-8">
              The Digital Oracle encountered an unexpected paradox in the timeline. Please refresh.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-surface-container hover:bg-surface-container-highest border border-white/10 rounded-xl font-bold transition-colors text-on-surface"
            >
              Recalibrate Settings (Refresh)
            </button>
            <details className="mt-6 text-left">
              <summary className="text-xs text-on-surface-variant cursor-pointer opacity-70 hover:opacity-100 mb-2">Technical Logs</summary>
              <pre className="text-[10px] text-error font-mono bg-background p-3 rounded-lg overflow-auto max-h-32">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
