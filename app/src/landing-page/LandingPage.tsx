import { Link } from "react-router-dom";
import {
  Layers,
  Play,
  Brain,
  Building2,
  BarChart3,
  Trophy,
  ArrowRight,
  Sparkles,
  Code2,
  Terminal,
  Zap,
  CheckCircle2,
  ChevronRight,
  Github,
  Twitter,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07070a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating Code Elements */}
        <div className="absolute top-[15%] left-[8%] font-mono text-xs text-violet-500/20 animate-float">
          {"const pattern = 'twoPointers';"}
        </div>
        <div className="absolute top-[25%] right-[12%] font-mono text-xs text-cyan-500/20 animate-float" style={{ animationDelay: "1s" }}>
          {"// O(n) time complexity"}
        </div>
        <div className="absolute top-[60%] left-[5%] font-mono text-xs text-violet-500/15 animate-float" style={{ animationDelay: "2s" }}>
          {"while (left < right) {"}
        </div>
        <div className="absolute bottom-[30%] right-[8%] font-mono text-xs text-cyan-500/15 animate-float" style={{ animationDelay: "0.5s" }}>
          {"return dp[n];"}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                <Terminal className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Algo<span className="text-violet-400">Forge</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/roadmap" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Roadmap
              </Link>
              <Link to="/problems" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Problems
              </Link>
              <Link to="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm text-violet-300">Pattern-based learning for FAANG interviews</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
            <span className="block">Forge Your Path</span>
            <span className="block mt-2">
              to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                  FAANG
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-violet-400 to-cyan-400 blur-2xl opacity-30" />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Master the{" "}
            <span className="text-violet-400 font-semibold">15 core patterns</span>{" "}
            that solve 90% of coding interviews. Built-in spaced repetition ensures you never forget.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-xl transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/roadmap"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all"
            >
              <Code2 className="h-5 w-5 text-violet-400" />
              View Roadmap
            </Link>
          </div>

          {/* Code Preview */}
          <div className="mt-20 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/30">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-zinc-500 ml-2 font-mono">two_sum.py</span>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm text-left overflow-x-auto">
                <div className="flex">
                  <div className="text-zinc-600 pr-6 select-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <div key={n}>{n}</div>
                    ))}
                  </div>
                  <div>
                    <div><span className="text-violet-400">def</span> <span className="text-cyan-400">two_sum</span><span className="text-zinc-300">(nums, target):</span></div>
                    <div><span className="text-zinc-500">    # Pattern: Hash Map for O(1) lookup</span></div>
                    <div><span className="text-zinc-300">    seen = {"{}"}</span></div>
                    <div><span className="text-violet-400">    for</span><span className="text-zinc-300"> i, num </span><span className="text-violet-400">in</span><span className="text-cyan-400"> enumerate</span><span className="text-zinc-300">(nums):</span></div>
                    <div><span className="text-zinc-300">        complement = target - num</span></div>
                    <div><span className="text-violet-400">        if</span><span className="text-zinc-300"> complement </span><span className="text-violet-400">in</span><span className="text-zinc-300"> seen:</span></div>
                    <div><span className="text-violet-400">            return</span><span className="text-zinc-300"> [seen[complement], i]</span></div>
                    <div><span className="text-zinc-300">        seen[num] = i</span></div>
                    <div></div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-black/30 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All tests passed
                  </span>
                  <span className="text-zinc-500">Runtime: 52ms</span>
                </div>
                <span className="text-zinc-500">Pattern: Arrays & Hashing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 border-y border-white/5 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent">
        <div className="w-full px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1000+", label: "Curated Problems", color: "violet" },
              { value: "15", label: "Core Patterns", color: "cyan" },
              { value: "10", label: "Top Companies", color: "violet" },
              { value: "94%", label: "Success Rate", color: "emerald" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${
                  stat.color === "violet" ? "text-violet-400" :
                  stat.color === "cyan" ? "text-cyan-400" :
                  "text-emerald-400"
                }`}>
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="text-violet-400">Succeed</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              A complete system designed to take you from zero to FAANG-ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: "15 Core Patterns",
                description: "Master the fundamental patterns that solve 90% of interview problems. Each pattern builds on the last.",
                gradient: "from-violet-500 to-purple-600",
              },
              {
                icon: Play,
                title: "Real Code Execution",
                description: "Write, run, and test your code in-browser with instant feedback. Support for Python, JavaScript, and more.",
                gradient: "from-cyan-500 to-blue-600",
              },
              {
                icon: Brain,
                title: "Spaced Repetition",
                description: "Our SM-2 algorithm schedules reviews at optimal intervals. Never forget a pattern you've learned.",
                gradient: "from-violet-500 to-pink-500",
              },
              {
                icon: Building2,
                title: "Company Tags",
                description: "Know exactly what Google, Meta, and Amazon ask. Problems tagged by company and frequency.",
                gradient: "from-amber-500 to-orange-600",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                description: "Visual dashboards show your mastery level, weak areas, and company readiness at a glance.",
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                icon: Trophy,
                title: "Gamification",
                description: "Earn XP, level up, maintain streaks, and unlock achievements. Learning should feel rewarding.",
                gradient: "from-yellow-500 to-amber-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/30 transition-all duration-300 hover:bg-zinc-900/80"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="relative text-lg font-semibold mb-2 group-hover:text-violet-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="relative text-sm text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 px-6 lg:px-12 bg-gradient-to-b from-violet-950/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Steps to{" "}
              <span className="text-cyan-400">Mastery</span>
            </h2>
            <p className="text-zinc-400">
              A proven system that actually works
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent -translate-y-1/2" />

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Learn the Pattern",
                  description: "Study the core pattern with visual explanations and code templates. Understand when and why to use it.",
                  icon: Code2,
                },
                {
                  step: "02",
                  title: "Solve Problems",
                  description: "Apply the pattern to curated problems. Start easy, progress to hard. Get hints when stuck.",
                  icon: Terminal,
                },
                {
                  step: "03",
                  title: "Master Through Repetition",
                  description: "Our spaced repetition system resurfaces problems at optimal intervals for long-term retention.",
                  icon: Zap,
                },
              ].map((item, i) => (
                <div key={i} className="relative text-center group">
                  {/* Step Circle */}
                  <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-zinc-900 border border-violet-500/30 mb-6 group-hover:border-violet-400 group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all">
                    <item.icon className="h-8 w-8 text-violet-400" />
                    <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Engineers Who{" "}
              <span className="text-violet-400">Made It</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "AlgoForge's pattern-based approach clicked for me in a way LeetCode grinding never did. Got offers from Google and Meta.",
                name: "Sarah Chen",
                role: "Software Engineer @ Google",
                avatar: "SC",
              },
              {
                quote: "The spaced repetition is a game changer. I actually remember solutions now instead of blanking in interviews.",
                name: "Marcus Johnson",
                role: "SDE II @ Amazon",
                avatar: "MJ",
              },
              {
                quote: "Went from bombing my first interview to landing my dream job in 3 months. The roadmap is incredibly well-designed.",
                name: "Priya Patel",
                role: "Frontend Engineer @ Netflix",
                avatar: "PP",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/20 transition-colors"
              >
                {/* Quote Mark */}
                <div className="absolute top-4 right-4 text-4xl text-violet-500/20 font-serif">
                  "
                </div>

                <p className="text-zinc-300 mb-6 leading-relaxed relative z-10">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-zinc-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-cyan-600/20" />
            <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm" />

            {/* Content */}
            <div className="relative py-16 px-8">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to Forge Your Future?
              </h2>
              <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
                Join thousands of engineers who transformed their interview skills with AlgoForge
              </p>
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-white/20 hover:scale-[1.02]"
              >
                Start Learning Free
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-4 text-sm text-zinc-500">
                No credit card required • Free tier available forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                <Terminal className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">
                Algo<span className="text-violet-400">Forge</span>
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link to="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/roadmap" className="hover:text-white transition-colors">
                Roadmap
              </Link>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-zinc-600">
            © 2024 AlgoForge. Built for engineers, by engineers.
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(1deg);
            opacity: 0.3;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
