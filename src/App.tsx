import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Activity, 
  Shield, 
  BarChart3, 
  Newspaper, 
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Loader2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import { runHedgeFundAnalysis, type HedgeFundDecision, type AgentReport } from './services/hedgeFund';

const MOCK_DATA = [
  { name: 'Mon', price: 150 },
  { name: 'Tue', price: 155 },
  { name: 'Wed', price: 152 },
  { name: 'Thu', price: 158 },
  { name: 'Fri', price: 162 },
  { name: 'Sat', price: 160 },
  { name: 'Sun', price: 165 },
];

export default function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [analysis, setAnalysis] = useState<HedgeFundDecision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadingSteps = [
    "Initializing Hedge Fund Team...",
    "Market Data Agent: Fetching real-time prices...",
    "Technical Agent: Analyzing chart patterns...",
    "Fundamental Agent: Reviewing financial statements...",
    "Sentiment Agent: Scanning news and social media...",
    "Risk Manager: Evaluating volatility...",
    "Portfolio Manager: Finalizing decision..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (!ticker.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await runHedgeFundAnalysis(ticker.toUpperCase());
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze stock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="h-16 border-b border-white/5 glass sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight">Lumina Hedge Fund</h1>
        </div>
        
        <div className="flex items-center gap-4 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter ticker (e.g. TSLA, NVDA)"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            Analyze
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <AnimatePresence mode="wait">
          {!analysis && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                <TrendingUp className="w-10 h-10 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold">AI-Powered Market Intelligence</h2>
                <p className="text-white/40 text-lg max-w-lg mx-auto">
                  Enter a stock ticker to coordinate a team of specialized AI agents for a comprehensive investment analysis.
                </p>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[60vh] flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500" />
              </div>
              <div className="text-center space-y-4 max-w-md">
                <h3 className="text-2xl font-display font-bold text-blue-400">{loadingSteps[loadingStep]}</h3>
                <p className="text-white/40 text-sm animate-pulse">This usually takes 10-15 seconds as we fetch real-time data.</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {loadingSteps.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        idx <= loadingStep ? "w-8 bg-blue-500" : "w-4 bg-white/5"
                      )} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {analysis && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Top Section: Decision & Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Decision Card */}
                <div className="lg:col-span-1 glass rounded-3xl p-8 flex flex-col justify-between border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BrainCircuit size={120} />
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold uppercase tracking-widest text-white/40">Portfolio Manager</span>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter",
                        analysis.decision === 'BUY' ? "bg-green-500/20 text-green-400" :
                        analysis.decision === 'SELL' ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {analysis.decision}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-6xl font-display font-black tracking-tighter">{analysis.ticker}</h2>
                      <p className="text-white/40 mt-1 font-medium">Price Target: <span className="text-white">{analysis.priceTarget}</span></p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {analysis.decision === 'BUY' ? <CheckCircle2 className="text-green-500" /> :
                         analysis.decision === 'SELL' ? <XCircle className="text-red-500" /> :
                         <MinusCircle className="text-yellow-500" />}
                        <p className="text-sm leading-relaxed text-white/80">{analysis.reasoning}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Risk Level</span>
                    </div>
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded",
                      analysis.riskLevel === 'LOW' ? "bg-green-500/20 text-green-400" :
                      analysis.riskLevel === 'HIGH' ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    )}>{analysis.riskLevel}</span>
                  </div>
                </div>

                {/* Chart Card */}
                <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <h3 className="font-display font-bold">Market Performance</h3>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-lg bg-white/5 text-xs font-medium text-white/40 hover:text-white transition-colors">1D</button>
                      <button className="px-3 py-1 rounded-lg bg-blue-600 text-xs font-medium text-white transition-colors">1W</button>
                      <button className="px-3 py-1 rounded-lg bg-white/5 text-xs font-medium text-white/40 hover:text-white transition-colors">1M</button>
                    </div>
                  </div>
                  
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_DATA}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#ffffff20" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#ffffff20" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          domain={['auto', 'auto']}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                          itemStyle={{ color: '#3b82f6' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorPrice)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {analysis.reports.map((report, idx) => (
                  <AgentCard key={idx} report={report} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertTriangle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">
        Lumina Hedge Fund • Multi-Agent AI System • Powered by Gemini 3 Flash
      </footer>
    </div>
  );
}

function AgentCard({ report }: { report: AgentReport }) {
  const Icon = report.agentName.includes('Market') ? Activity :
               report.agentName.includes('Technical') ? TrendingUp :
               report.agentName.includes('Fundamental') ? BarChart3 :
               report.agentName.includes('Sentiment') ? Newspaper :
               Shield;

  return (
    <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-all group">
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-600/10 transition-colors">
          <Icon size={18} className="text-white/40 group-hover:text-blue-500 transition-colors" />
        </div>
        <div className={cn(
          "w-2 h-2 rounded-full",
          report.sentiment === 'bullish' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
          report.sentiment === 'bearish' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
          "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
        )} />
      </div>
      
      <div className="space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{report.agentName}</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/60">Confidence:</span>
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${report.confidence}%` }} 
            />
          </div>
          <span className="text-[10px] font-bold text-blue-500">{report.confidence}%</span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-white/60 line-clamp-4 group-hover:line-clamp-none transition-all">
        {report.analysis}
      </p>
    </div>
  );
}

function AgentStatus({ label, active }: { label: string, active: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
      active ? "bg-blue-600/10 border-blue-500/20 text-blue-400" : "bg-white/5 border-white/10 text-white/20"
    )}>
      {active && <RefreshCw size={10} className="animate-spin" />}
      {label}
    </div>
  );
}
