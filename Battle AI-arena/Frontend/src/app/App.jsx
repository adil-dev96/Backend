import { useState, useRef, useEffect } from 'react';

import { Markdown } from './markdown';
import axios from 'axios'

function App() {
  const [history, setHistory] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [judgeMode, setJudgeMode] = useState('analytical'); // analytical, strict, creative
  const [temperature, setTemperature] = useState(0.7);

  const textareaRef = useRef(null);
  const mainContentRef = useRef(null);

  // Auto-expand textarea scrollHeight
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  // Find active item
  const activeItem = history.find(item => item.id === selectedId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const query = inputText.trim();
    if (!query || isGenerating) return;



    setIsGenerating(true);
    setInputText('');

    // Create a temporary history item with pending status
    const newId = `query-${Date.now()}`;
    const pendingItem = {
      id: newId,
      title: query.length > 30 ? query.substring(0, 30) + '...' : query,
      category: 'User Prompt',
      icon: 'chat',
      problem: query,
      solution_1: '',
      solution_2: '',
      judge: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPending: true,
    };

    setHistory(prev => [pendingItem, ...prev]);
    setSelectedId(newId);

    try {
      const { data } = await axios.post("http://localhost:3000/invoke",
        {
          input: query,
        });

      const response = data.result;



      // Update history with finalized output
      setHistory(prev =>
        prev.map(item =>
          item.id === newId
            ? {
              ...item,
              solution_1: response.solution_1,
              solution_2: response.solution_2,
              judge: response.judge,
              isPending: false
            }
            : item
        )
      );

      // Scroll to top of main content to read response
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Failed to generate comparison:", err);
      // Remove failed item or mark as error
      setHistory(prev => prev.filter(item => item.id !== newId));
      if (history.length > 0) {
        setSelectedId(history[0].id);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };



  return (
    <div className="h-full flex bg-surface text-on-surface font-sans antialiased overflow-hidden">

      {/* 1. Sidebar Panel (Geist typography, 1px borders) */}
      <nav className="bg-surface-container-low border-r border-outline-variant h-screen w-64 hidden md:flex flex-col z-40 p-5 select-none shrink-0">

        {/* Sidebar Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              difference
            </span>
          </div>
          <div>
            <h1 className="font-sans text-base font-bold text-primary m-0 p-0 leading-none tracking-tight">
              Aura AI
            </h1>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant/70 block mt-1">
              Comparison Arena
            </span>
          </div>
        </div>

        {/* Action Button: Clear/Reset */}
        <button
          onClick={() => {
            if (isGenerating) return;
            setSelectedId(null);
          }}
          className={`mb-6 border border-outline-variant hover:bg-surface-container text-primary font-medium rounded-md flex items-center justify-center gap-2 p-2.5 transition-all text-xs cursor-pointer ${!selectedId ? 'bg-surface-container border-primary/20' : 'bg-surface-container-lowest'
            }`}
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Comparison Workspace
        </button>

        {/* Sidebar Navigation & History */}
        <div className="flex-grow flex flex-col min-h-0 overflow-y-auto pr-1">
          <div className="text-[11px] uppercase font-bold text-on-surface-variant/50 tracking-wider mb-2">
            History
          </div>
          <ul className="flex flex-col gap-1.5">
            {history.map((item) => {
              const isActive = item.id === selectedId;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (isGenerating) return;
                      setSelectedId(item.id);
                    }}
                    className={`w-full text-left font-sans text-xs rounded-md flex items-center gap-2.5 p-3 transition-all cursor-pointer scale-98 hover:scale-100 ${isActive
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {item.icon || 'chat'}
                    </span>
                    <div className="truncate flex-grow min-w-0">
                      <div className="truncate">{item.title}</div>
                      <div className={`text-[10px] mt-0.5 ${isActive ? 'text-on-primary/60' : 'text-on-surface-variant/50'}`}>
                        {item.timestamp}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>



          {/* Sidebar Footer */}
          <div className="mt-auto pt-4 border-t border-outline-variant/60 flex flex-col gap-2">
            <div className="text-[10px] text-on-surface-variant/40 text-center font-mono">
              Vite + React • Tailwind v4
            </div>
          </div>

        </div>
      </nav>

      {/* 2. Main View Workspace */}
      <main className="flex-grow flex flex-col relative h-screen bg-surface overflow-hidden">

        {/* Workspace Top Header Bar */}
        <header className="bg-surface border-b border-outline-variant/60 sticky top-0 left-0 w-full z-10 flex justify-between items-center px-8 h-14 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant">
              DESKTOP VIEW
            </span>
            <div className="h-4 w-px bg-outline-variant/60"></div>
            <div className="text-xs text-on-surface-variant/70">
              {activeItem ? `Active Session: ${activeItem.title}` : 'Sandbox Playground'}
            </div>
          </div>

          {/* Configuration Controls (Interactive Parameters) */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant/70">Judge Style:</span>
              <select
                value={judgeMode}
                onChange={(e) => setJudgeMode(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-on-surface cursor-pointer focus:outline-none focus:border-primary/40 text-xs"
              >
                <option value="analytical">Strict Analytical</option>
                <option value="balanced">Balanced Audit</option>
                <option value="creative">Creative Feedback</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant/70">Temp:</span>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-16 accent-primary cursor-pointer"
              />
              <span className="font-mono text-[10px] text-on-surface-variant w-5">{temperature}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Comparison Board */}
        <div
          ref={mainContentRef}
          className="flex-grow overflow-y-auto px-8 md:px-16 py-10"
        >
          <div className="max-w-[960px] mx-auto w-full">

            {/* Conditional Render: Empty State / Onboarding */}
            {!selectedId ? (
              <div className="py-16 text-center max-w-xl mx-auto animate-fade-in">
                <span className="material-symbols-outlined text-[48px] text-secondary/40 mb-4 select-none">
                  compare_arrows
                </span>
                <h2 className="text-2xl font-bold text-primary mb-3 font-sans tracking-tight">
                  Welcome to AI Solution Arena
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
                  Submit any technical problem, mathematical query, or operational scenario.
                  Our environment generates two separate candidates side by side and passes them to a
                  Judge LLM for a structured comparison review and quantitative scores.
                </p>


              </div>
            ) : (
              <div className="space-y-12 animate-slide-up">

                {/* 1. Problem Statement Section */}
                <section>
                  <div className="flex items-center gap-2 mb-3 text-on-surface-variant/80 select-none">
                    <span className="material-symbols-outlined text-[16px]">assignment</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider">Problem Statement</h2>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-xs leading-relaxed">
                    <p className="text-[15px] font-medium text-on-surface">
                      {activeItem.problem}
                    </p>
                  </div>
                </section>

                {/* 2. Loading State vs Comparison Columns */}
                {activeItem.isPending ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
                    {/* Skeleton Solution 1 */}
                    <div className="border border-outline-variant rounded-lg p-6 bg-surface-container-lowest flex flex-col gap-4 animate-pulse-subtle">
                      <div className="h-6 bg-surface-container-high rounded w-1/3"></div>
                      <div className="space-y-2 mt-4">
                        <div className="h-4 bg-surface-container rounded"></div>
                        <div className="h-4 bg-surface-container rounded w-5/6"></div>
                        <div className="h-4 bg-surface-container rounded w-4/6"></div>
                      </div>
                      <div className="h-24 bg-surface-container-low rounded-lg mt-4"></div>
                    </div>
                    {/* Skeleton Solution 2 */}
                    <div className="border border-outline-variant rounded-lg p-6 bg-surface-container-lowest flex flex-col gap-4 animate-pulse-subtle">
                      <div className="h-6 bg-surface-container-high rounded w-1/4"></div>
                      <div className="space-y-2 mt-4">
                        <div className="h-4 bg-surface-container rounded"></div>
                        <div className="h-4 bg-surface-container rounded w-11/12"></div>
                        <div className="h-4 bg-surface-container rounded w-3/4"></div>
                      </div>
                      <div className="h-24 bg-surface-container-low rounded-lg mt-4"></div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">

                    {/* Solution Column 1 */}
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-outline-variant/60 select-none">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                          </div>
                          <h3 className="text-sm font-bold text-primary">Solution 1: Candidate Alpha</h3>
                        </div>
                        {activeItem.judge && (
                          <span className="bg-surface-container-high border border-outline-variant px-2 py-0.5 rounded text-[11px] font-mono font-bold text-primary">
                            Score: {activeItem.judge.solution_1_score}/10
                          </span>
                        )}
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg flex-grow shadow-xs">
                        <Markdown text={activeItem.solution_1} />
                      </div>
                    </div>

                    {/* Solution Column 2 */}
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-outline-variant/60 select-none">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                          </div>
                          <h3 className="text-sm font-bold text-primary">Solution 2: Candidate Beta</h3>
                        </div>
                        {activeItem.judge && (
                          <span className="bg-surface-container-high border border-outline-variant px-2 py-0.5 rounded text-[11px] font-mono font-bold text-primary">
                            Score: {activeItem.judge.solution_2_score}/10
                          </span>
                        )}
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg flex-grow shadow-xs">
                        <Markdown text={activeItem.solution_2} />
                      </div>
                    </div>

                  </div>
                )}

                {/* 3. Judge Recommendation Card */}
                {activeItem.isPending ? (
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden animate-pulse-subtle shadow-xs">
                    <div className="h-1 bg-outline w-full"></div>
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                      <div className="bg-surface-container-low border border-outline-variant p-6 rounded-md min-w-[200px] h-32"></div>
                      <div className="flex-grow space-y-3">
                        <div className="h-4 bg-surface-container rounded w-1/4"></div>
                        <div className="h-4 bg-surface-container rounded"></div>
                        <div className="h-4 bg-surface-container rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ) : activeItem.judge ? (
                  <section className="mt-8">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden relative shadow-sm">
                      {/* Decorative Top Accent Border */}
                      <div className="h-[3px] w-full bg-primary"></div>

                      <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-stretch">

                        {/* Winner Score Ring Display */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-surface-container-low/50 border border-outline-variant/60 p-6 rounded-lg lg:w-[220px] select-none text-center">
                          <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-1.5">
                            Recommended Winner
                          </span>

                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              emoji_events
                            </span>
                            <h4 className="text-sm font-bold text-primary m-0 leading-tight">
                              {activeItem.judge.winner}
                            </h4>
                          </div>

                          <div className="flex items-baseline gap-1 mt-1 justify-center">
                            <span className="text-4xl font-extrabold text-primary leading-none">
                              {Math.max(activeItem.judge.solution_1_score, activeItem.judge.solution_2_score)}
                            </span>
                            <span className="text-xs font-semibold text-on-surface-variant/60">/ 10</span>
                          </div>

                          <div className="mt-4 text-[11px] text-on-surface-variant/70 font-mono w-full pt-3.5 border-t border-outline-variant/60">
                            Alpha: {activeItem.judge.solution_1_score} vs Beta: {activeItem.judge.solution_2_score}
                          </div>
                        </div>

                        {/* Detailed Reasoning Columns (Both Solutions Displayed) */}
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-4 select-none">
                              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">gavel</span>
                              <h5 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Judge Audit & Reasoning
                              </h5>
                            </div>

                            {/* Summary Sentence */}
                            <p className="text-[13px] font-semibold text-primary mb-5 italic border-l-2 border-primary/50 pl-3">
                              "{activeItem.judge.summary || `${activeItem.judge.winner} is recommended based on technical compliance.`}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                              {/* Reasoning Solution 1 */}
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                                  Alpha Assessment (Score: {activeItem.judge.solution_1_score}/10)
                                </div>
                                <p className="text-xs text-on-surface-variant/90 leading-relaxed">
                                  {activeItem.judge.solution_1_resoning}
                                </p>
                              </div>

                              {/* Reasoning Solution 2 */}
                              <div className="space-y-1 border-t md:border-t-0 md:border-l border-outline-variant/60 pt-4 md:pt-0 md:pl-6">
                                <div className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-secondary-container rounded-full"></span>
                                  Beta Assessment (Score: {activeItem.judge.solution_2_score}/10)
                                </div>
                                <p className="text-xs text-on-surface-variant/90 leading-relaxed">
                                  {activeItem.judge.solution_2_resoning}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Items */}
                          <div className="flex gap-3 mt-6 pt-5 border-t border-outline-variant/40">
                            <button
                              onClick={() => {
                                alert(`Verdict for ${activeItem.judge.winner} accepted!`);
                              }}
                              className="bg-primary text-on-primary font-medium text-xs rounded py-2 px-3.5 hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs select-none"
                            >
                              <span className="material-symbols-outlined text-[14px]">done</span>
                              Accept Verdict
                            </button>

                            <button
                              onClick={async () => {
                                // Simulate regeneration
                                if (isGenerating) return;
                                setIsGenerating(true);
                                try {
                                  const { data } = await axios.post("http://localhost:3000/invoke", {
                                    input: activeItem.problem,
                                  });

                                  const response = data.result;
                                  setHistory(prev =>
                                    prev.map(item =>
                                      item.id === activeItem.id
                                        ? { ...item, solution_1: response.solution_1, solution_2: response.solution_2, judge: response.judge }
                                        : item
                                    )
                                  );
                                } catch (err) {
                                  console.error(err);
                                } finally {
                                  setIsGenerating(false);
                                }
                              }}
                              className="bg-transparent border border-outline-variant hover:bg-surface-container text-on-surface font-medium text-xs rounded py-2 px-3.5 transition-colors flex items-center gap-1.5 cursor-pointer select-none"
                            >
                              <span className="material-symbols-outlined text-[14px]">refresh</span>
                              Regenerate Solutions
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Input Text Form (Breathing space padding) */}
        <footer className="px-8 md:px-16 pb-8 pt-4 shrink-0 bg-gradient-to-t from-surface via-surface to-transparent select-none z-10">
          <div className="max-w-[960px] mx-auto">
            <form onSubmit={handleSubmit} className="relative bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 shadow-xs focus-within:border-primary/40 focus-within:shadow-md transition-all">

              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aura to generate and judge two solutions... (e.g. Write a quicksort script in python)"
                rows={1}
                disabled={isGenerating}
                className="w-full pl-3 pr-14 py-2 bg-transparent text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none resize-none min-h-[36px] max-h-[160px] leading-relaxed font-sans"
              />

              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-2">
                {isGenerating ? (
                  <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${inputText.trim()
                      ? 'bg-primary text-on-primary hover:opacity-90 cursor-pointer'
                      : 'bg-surface-container text-on-surface-variant/30 cursor-not-allowed'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>
                )}
              </div>
            </form>

            <div className="text-[10px] text-on-surface-variant/50 text-center mt-2.5">
              Press Enter to Submit • Shift+Enter for Newline • Judgments are compiled using {judgeMode} parameters.
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}

export default App;
