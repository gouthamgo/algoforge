import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useAction } from "wasp/client/operations";
import { getProblem, submitCode, useHint, viewSolution } from "wasp/client/operations";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  Play,
  Send,
  Lightbulb,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Copy,
  Check,
  Building2,
  FileText,
  Settings,
  Maximize2,
  Minimize2,
  Pause,
  TimerReset,
  StickyNote,
  GraduationCap,
  ChevronDown,
  Brain,
  Footprints,
  Target,
  Code2,
} from "lucide-react";
import { DIFFICULTY_CONFIG, SUPPORTED_LANGUAGES } from "../shared/constants";
import { EXPLANATIONS } from "./data/explanations";

// Tab types for left panel
type LeftTab = "description" | "explanation" | "hints" | "solutions" | "notes";
type OutputTab = "testcase" | "result" | "console";

export default function ProblemPage() {
  const { problemSlug } = useParams<{ problemSlug: string }>();
  const { data: problem, isLoading, error, refetch } = useQuery(getProblem, { slug: problemSlug || "" });

  const submitCodeAction = useAction(submitCode);
  const useHintAction = useAction(useHint);
  const viewSolutionAction = useAction(viewSolution);

  // State
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>("description");
  const [outputTab, setOutputTab] = useState<OutputTab>("testcase");
  const [hints, setHints] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [customInput, setCustomInput] = useState("");
  const [panelWidth, setPanelWidth] = useState(45); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notes, setNotes] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Load notes from localStorage when problem changes
  useEffect(() => {
    if (problemSlug) {
      const savedNotes = localStorage.getItem(`algoforge-notes-${problemSlug}`);
      if (savedNotes) {
        setNotes(savedNotes);
      } else {
        setNotes("");
      }
    }
  }, [problemSlug]);

  // Save notes to localStorage
  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (problemSlug) {
      localStorage.setItem(`algoforge-notes-${problemSlug}`, value);
    }
  };

  // Toggle explanation sections
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  // Reset timer
  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  // Initialize code when problem loads
  useEffect(() => {
    if (problem?.starterCode) {
      try {
        const starterCodes = JSON.parse(problem.starterCode);
        setCode(starterCodes[language] || "// Start coding here...");
      } catch {
        setCode("// Start coding here...");
      }
    }
  }, [problem, language]);

  // Handle language change
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem?.starterCode) {
      try {
        const starterCodes = JSON.parse(problem.starterCode);
        setCode(starterCodes[newLang] || "");
      } catch {
        setCode("");
      }
    }
  };

  // Panel resize
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setPanelWidth(Math.min(Math.max(newWidth, 25), 75));
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Actions
  const handleRun = async () => {
    setIsRunning(true);
    setOutputTab("result");
    setConsoleOutput("");
    try {
      // Mock execution for now
      await new Promise((r) => setTimeout(r, 1000));
      setTestResults({
        passed: 2,
        total: 3,
        results: [
          { id: 1, passed: true, input: "[2,7,11,15], 9", expected: "[0,1]", output: "[0,1]", runtime: "52ms" },
          { id: 2, passed: true, input: "[3,2,4], 6", expected: "[1,2]", output: "[1,2]", runtime: "48ms" },
          { id: 3, passed: false, input: "[3,3], 6", expected: "[0,1]", output: "[]", runtime: "45ms" },
        ],
      });
      setConsoleOutput("Running test cases...\nTest 1: Passed\nTest 2: Passed\nTest 3: Failed - Expected [0,1] but got []");
    } catch (err: any) {
      setConsoleOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setOutputTab("result");
    try {
      const result = await submitCodeAction({
        problemId: problem.id,
        code,
        language,
      });
      setTestResults({
        passed: 3,
        total: 3,
        accepted: true,
        runtime: "52ms",
        memory: "16.2MB",
        percentile: 85,
      });
      setConsoleOutput(`Accepted! +${result.xpEarned} XP earned`);
      setIsTimerRunning(false);
      refetch();
    } catch (err: any) {
      setConsoleOutput(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetHint = async () => {
    if (!problem) return;
    try {
      const result = await useHintAction({ problemId: problem.id });
      setHints((prev) => [...prev, result.hint]);
      setLeftTab("hints");
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleViewSolution = async () => {
    if (!problem) return;
    try {
      const result = await viewSolutionAction({ problemId: problem.id });
      setSolutions(result.solutions);
      setLeftTab("solutions");
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleReset = () => {
    if (problem?.starterCode) {
      try {
        const starterCodes = JSON.parse(problem.starterCode);
        setCode(starterCodes[language] || "");
      } catch {
        setCode("");
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500">Loading problem...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !problem) {
    return (
      <div className="h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-zinc-400 mb-4">Problem not found</p>
          <Link to="/problems" className="text-violet-400 hover:text-violet-300 transition-colors">
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  const difficulty = problem.difficulty?.toLowerCase() || "easy";
  const diffConfig = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.easy;
  const examples = JSON.parse(problem.examples || "[]");
  const isSolved = problem.userProgress?.status === "solved";
  const companies = problem.companies || [];

  return (
    <div className={`h-screen bg-[#0a0a0f] flex flex-col overflow-hidden ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Top Navbar */}
      <nav className="h-12 border-b border-zinc-800 bg-[#0d0d12] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="p-1.5 rounded hover:bg-zinc-800 transition-colors group">
            <ArrowLeft className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-white">{problem.title}</h1>
            {isSolved && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer - Optional */}
          <div className="flex items-center gap-1 rounded-lg bg-zinc-800/50 overflow-hidden">
            <button
              onClick={toggleTimer}
              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-700/50 transition-colors"
              title={isTimerRunning ? "Pause timer" : "Start timer"}
            >
              {isTimerRunning ? (
                <Pause className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Play className="h-3.5 w-3.5 text-emerald-400" />
              )}
              <span className={`font-mono ${isTimerRunning ? "text-white" : "text-zinc-500"}`}>
                {formatTime(timer)}
              </span>
            </button>
            {timer > 0 && (
              <button
                onClick={resetTimer}
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700/50 transition-colors"
                title="Reset timer"
              >
                <TimerReset className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded hover:bg-zinc-800 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-zinc-500" />
            ) : (
              <Maximize2 className="h-4 w-4 text-zinc-500" />
            )}
          </button>
        </div>
      </nav>

      {/* Toolbar */}
      <div className="h-10 border-b border-zinc-800 bg-[#0d0d12] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          {/* Difficulty Badge */}
          <span className={`px-2 py-0.5 rounded text-xs font-medium badge-${difficulty}`}>
            {diffConfig.label}
          </span>

          {/* Pattern */}
          {problem.pattern && (
            <span className="text-sm text-zinc-500">
              {problem.pattern.title}
            </span>
          )}

          {/* Companies */}
          {companies.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-zinc-600" />
              <span className="text-xs text-zinc-500">
                {companies.slice(0, 3).map((c: any) => c.companyName).join(", ")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGetHint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hint</span>
          </button>
          <button
            onClick={handleViewSolution}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700/50 rounded transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Solution</span>
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="flex flex-col bg-[#0a0a0f]" style={{ width: `${panelWidth}%` }}>
          {/* Tabs */}
          <div className="h-10 border-b border-zinc-800 flex items-center gap-1 px-2 shrink-0">
            {[
              { id: "description", label: "Description", icon: FileText },
              { id: "explanation", label: "Explanation", icon: GraduationCap },
              { id: "hints", label: `Hints${hints.length ? ` (${hints.length})` : ""}`, icon: Lightbulb },
              { id: "solutions", label: "Solutions", icon: Eye },
              { id: "notes", label: "Notes", icon: StickyNote },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLeftTab(tab.id as LeftTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-colors ${
                  leftTab === tab.id
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {leftTab === "description" && (
              <div className="space-y-6">
                {/* Description */}
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {problem.description}
                  </div>
                </div>

                {/* Examples */}
                {examples.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Examples</h3>
                    <div className="space-y-3">
                      {examples.map((example: any, index: number) => (
                        <div key={index} className="rounded-lg bg-zinc-900/50 border border-zinc-800 overflow-hidden">
                          <div className="px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
                            <span className="text-xs font-medium text-zinc-400">Example {index + 1}</span>
                          </div>
                          <div className="p-3 space-y-2 text-sm">
                            <div>
                              <span className="text-zinc-500 text-xs">Input:</span>
                              <pre className="mt-1 text-zinc-300 font-mono text-xs bg-zinc-900 p-2 rounded overflow-x-auto">
                                {example.input}
                              </pre>
                            </div>
                            <div>
                              <span className="text-zinc-500 text-xs">Output:</span>
                              <pre className="mt-1 text-emerald-400 font-mono text-xs bg-zinc-900 p-2 rounded">
                                {example.output}
                              </pre>
                            </div>
                            {example.explanation && (
                              <div className="pt-2 border-t border-zinc-800">
                                <span className="text-zinc-500 text-xs">Explanation:</span>
                                <p className="mt-1 text-zinc-400 text-xs">{example.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Constraints</h3>
                    <ul className="space-y-1 text-xs text-zinc-400">
                      {problem.constraints.split("\n").map((c: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-violet-400 mt-0.5">•</span>
                          <code className="font-mono">{c.replace(/^-\s*/, "")}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Company Tags */}
                {companies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Asked by</h3>
                    <div className="flex flex-wrap gap-2">
                      {companies.map((company: any) => (
                        <span
                          key={company.companyName}
                          className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs flex items-center gap-1"
                        >
                          <Building2 className="h-3 w-3" />
                          {company.companyName}
                          <span className="text-zinc-600">({company.frequency})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {leftTab === "explanation" && (
              <div className="space-y-6">
                {problemSlug && EXPLANATIONS[problemSlug] ? (
                  <>
                    {/* Section 1: How to Think About It */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-4 w-4 text-violet-400" />
                        <h3 className="text-sm font-semibold text-white">How to Think About It</h3>
                      </div>
                      {EXPLANATIONS[problemSlug].thinking.map((item, idx) => {
                        const sectionId = `thinking-${idx}`;
                        const isExpanded = expandedSections[sectionId];
                        return (
                          <div
                            key={idx}
                            className="rounded-lg border border-zinc-800 overflow-hidden"
                          >
                            <button
                              onClick={() => toggleSection(sectionId)}
                              className="w-full px-4 py-3 flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors text-left"
                            >
                              <span className="text-sm font-medium text-zinc-200">{item.title}</span>
                              <ChevronDown
                                className={`h-4 w-4 text-zinc-500 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isExpanded && (
                              <div className="px-4 py-3 bg-zinc-900/30 border-t border-zinc-800">
                                <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed">
                                  {item.content}
                                </pre>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Section 2: The Approach */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white">The Approach</h3>
                      </div>
                      {EXPLANATIONS[problemSlug].approach.map((item, idx) => {
                        const sectionId = `approach-${idx}`;
                        const isExpanded = expandedSections[sectionId];
                        return (
                          <div
                            key={idx}
                            className="rounded-lg border border-zinc-800 overflow-hidden"
                          >
                            <button
                              onClick={() => toggleSection(sectionId)}
                              className="w-full px-4 py-3 flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors text-left"
                            >
                              <span className="text-sm font-medium text-zinc-200">{item.title}</span>
                              <ChevronDown
                                className={`h-4 w-4 text-zinc-500 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isExpanded && (
                              <div className="px-4 py-3 bg-zinc-900/30 border-t border-zinc-800">
                                <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed">
                                  {item.content}
                                </pre>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Section 3: Step-by-Step Walkthrough */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Code2 className="h-4 w-4 text-emerald-400" />
                        <h3 className="text-sm font-semibold text-white">Step-by-Step Walkthrough</h3>
                      </div>
                      {EXPLANATIONS[problemSlug].walkthrough.map((item, idx) => {
                        const sectionId = `walkthrough-${idx}`;
                        const isExpanded = expandedSections[sectionId];
                        return (
                          <div
                            key={idx}
                            className="rounded-lg border border-zinc-800 overflow-hidden"
                          >
                            <button
                              onClick={() => toggleSection(sectionId)}
                              className="w-full px-4 py-3 flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors text-left"
                            >
                              <span className="text-sm font-medium text-zinc-200">{item.title}</span>
                              <ChevronDown
                                className={`h-4 w-4 text-zinc-500 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isExpanded && (
                              <div className="px-4 py-3 bg-zinc-900/30 border-t border-zinc-800 space-y-3">
                                <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed">
                                  {item.content}
                                </pre>
                                {item.code && (
                                  <div className="rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
                                    <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
                                      <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                      </div>
                                      <span className="text-xs text-zinc-500">Python</span>
                                    </div>
                                    <pre className="p-3 text-sm text-zinc-300 font-mono overflow-x-auto">
                                      {item.code}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">Explanation coming soon</p>
                    <p className="text-zinc-600 text-xs mt-1">
                      We're working on a detailed explanation for this problem
                    </p>
                  </div>
                )}
              </div>
            )}

            {leftTab === "hints" && (
              <div className="space-y-3">
                {hints.length > 0 ? (
                  hints.map((hint, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-medium text-amber-400">Hint {index + 1}</span>
                          <p className="text-sm text-zinc-300 mt-1">{hint}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Lightbulb className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">No hints revealed yet</p>
                    <button
                      onClick={handleGetHint}
                      className="mt-3 px-4 py-2 text-sm bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors"
                    >
                      Get a Hint
                    </button>
                  </div>
                )}
              </div>
            )}

            {leftTab === "solutions" && (
              <div className="space-y-4">
                {solutions.length > 0 ? (
                  solutions.map((solution: any, index: number) => (
                    <div key={index} className="rounded-lg border border-zinc-800 overflow-hidden">
                      <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
                        <span className="font-medium text-white">{solution.approach}</span>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span>Time: <span className="text-cyan-400">{solution.complexity?.time}</span></span>
                          <span>Space: <span className="text-violet-400">{solution.complexity?.space}</span></span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-zinc-400 mb-3">{solution.explanation}</p>
                        {solution.code?.[language] && (
                          <pre className="text-xs font-mono bg-zinc-900 p-3 rounded overflow-x-auto text-zinc-300">
                            {solution.code[language]}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Eye className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">Solutions hidden</p>
                    <button
                      onClick={handleViewSolution}
                      className="mt-3 px-4 py-2 text-sm bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
                    >
                      View Solutions
                    </button>
                  </div>
                )}
              </div>
            )}

            {leftTab === "notes" && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-violet-400" />
                    <span className="text-sm font-medium text-white">Your Notes</span>
                  </div>
                  <span className="text-xs text-zinc-600">Auto-saved locally</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Write your notes here...

• Approach ideas
• Edge cases to consider
• Time/space complexity thoughts
• Key insights"
                  className="flex-1 w-full p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  style={{ minHeight: "300px" }}
                />
                {notes && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-600">
                      {notes.length} characters
                    </span>
                    <button
                      onClick={() => handleNotesChange("")}
                      className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
                    >
                      Clear notes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-zinc-800 hover:bg-violet-500 cursor-col-resize transition-colors relative group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-zinc-600 group-hover:bg-violet-400 transition-colors" />
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-[#0d0d12] min-w-0">
          {/* Editor Toolbar */}
          <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                title="Reset code"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <button className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                smoothScrolling: true,
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="h-12 border-t border-zinc-800 flex items-center justify-between px-3 shrink-0">
            <div className="text-xs text-zinc-500">
              <span className="text-zinc-600">Ctrl+Enter</span> to run
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Run"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="h-48 border-t border-zinc-800 flex flex-col shrink-0">
            {/* Output Tabs */}
            <div className="h-9 border-b border-zinc-800 flex items-center gap-1 px-2 shrink-0">
              {[
                { id: "testcase", label: "Testcase" },
                { id: "result", label: "Result" },
                { id: "console", label: "Console" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOutputTab(tab.id as OutputTab)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    outputTab === tab.id
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Output Content */}
            <div className="flex-1 overflow-auto p-3 bg-[#0a0a0f]">
              {outputTab === "testcase" && (
                <div>
                  <label className="text-xs text-zinc-500 block mb-2">Custom Input:</label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom test input..."
                    className="w-full h-20 p-2 bg-zinc-900 border border-zinc-800 rounded text-xs font-mono text-zinc-300 resize-none focus:outline-none focus:border-violet-500"
                  />
                </div>
              )}

              {outputTab === "result" && testResults && (
                <div className="space-y-3">
                  {testResults.accepted ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <div>
                        <span className="text-emerald-400 font-medium">Accepted</span>
                        <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400">
                          <span>Runtime: <span className="text-white">{testResults.runtime}</span></span>
                          <span>Memory: <span className="text-white">{testResults.memory}</span></span>
                          <span>Beats <span className="text-cyan-400">{testResults.percentile}%</span></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={testResults.passed === testResults.total ? "text-emerald-400" : "text-red-400"}>
                          {testResults.passed}/{testResults.total} tests passed
                        </span>
                      </div>
                      {testResults.results?.map((result: any) => (
                        <div
                          key={result.id}
                          className={`p-2 rounded border text-xs ${
                            result.passed
                              ? "bg-emerald-500/5 border-emerald-500/20"
                              : "bg-red-500/5 border-red-500/20"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {result.passed ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-red-400" />
                            )}
                            <span className="text-zinc-400">Test {result.id}</span>
                            <span className="text-zinc-600">{result.runtime}</span>
                          </div>
                          {!result.passed && (
                            <div className="pl-5 space-y-1 text-zinc-500">
                              <div>Expected: <span className="text-emerald-400">{result.expected}</span></div>
                              <div>Output: <span className="text-red-400">{result.output}</span></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {outputTab === "console" && (
                <pre className="text-xs font-mono text-zinc-400 whitespace-pre-wrap">
                  {consoleOutput || "Console output will appear here..."}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
