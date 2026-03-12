import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Shield, 
  Cpu, 
  Database, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  Search,
  RefreshCw,
  ChevronRight,
  Lock,
  BookOpen,
  X
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  uid: string;
}

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isHealthy, setIsHealthy] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tester' | 'logs'>('overview');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDoc, setShowDoc] = useState(false);

  // Mock real-time logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        method: 'GET',
        path: '/icube/api/v1/native/config/query',
        status: Math.random() > 0.1 ? 200 : 400,
        uid: `user_${Math.floor(Math.random() * 10000)}`
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const runTest = async () => {
    setIsLoading(true);
    const key = process.env.TRAE_API_KEY || 'trae-secret-api-key-2026';
    console.log('[Debug] Sending request with API Key length:', key?.length);
    try {
      const params = new URLSearchParams({
        mid: "mac_001",
        did: "dev_992",
        uid: "user_442",
        userRegion: "US-WEST",
        packageType: "standard",
        platform: "linux",
        arch: "x64",
        tenant: "trae_default",
        appVersion: "1.2.0",
        buildVersion: "20240312",
        traeVersionCode: "42"
      });
      const response = await fetch(`/icube/api/v1/native/config/query?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, error: "Connection failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg relative">
      <div className="scanline" />
      
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center glass-panel sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/50 neon-glow-cyan">
            <Cpu className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase">Trae Config Service</h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
              <span className="text-[10px] text-zinc-500 uppercase font-mono">System Status: {isHealthy ? 'Operational' : 'Degraded'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowDoc(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5 transition-colors text-xs font-medium text-zinc-400"
          >
            <BookOpen size={14} />
            Docs
          </button>
          <nav className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
            {['overview', 'tester', 'logs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium uppercase transition-all ${
                  activeTab === tab 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Info */}
        <div className="lg:col-span-1 space-y-8">
          <section className="glass-panel p-6 space-y-6">
            <h2 className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-2">
              <Activity size={14} /> Performance Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-2xl font-mono font-bold text-cyan-400">5.2k</div>
                <div className="text-[10px] text-zinc-500 uppercase">Requests / Sec</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-2xl font-mono font-bold text-magenta-400">32ms</div>
                <div className="text-[10px] text-zinc-500 uppercase">p99 Latency</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] uppercase text-zinc-400">
                <span>CPU Load</span>
                <span>14%</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '14%' }}
                  className="h-full bg-cyan-500" 
                />
              </div>
              <div className="flex justify-between text-[11px] uppercase text-zinc-400">
                <span>Memory (RSS)</span>
                <span>82MB</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  className="h-full bg-magenta-500" 
                />
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 space-y-4">
            <h2 className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-2">
              <Shield size={14} /> Security Layer
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>JWT Authentication Active</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Strict Zod Validation</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>CORS Policy: Restricted</span>
              </div>
            </div>
          </section>
        </div>

        {/* Center/Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="glass-panel p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Database size={120} />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-4">High-Performance Configuration Engine</h2>
                  <p className="text-zinc-400 leading-relaxed max-w-xl">
                    Trae Config Service provides a stateless, horizontally scalable REST API for resolving complex native configurations. 
                    Engineered for sub-50ms latency at massive scale.
                  </p>
                  <div className="mt-8 flex gap-4">
                    <button 
                      onClick={() => setActiveTab('tester')}
                      className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-2"
                    >
                      <Terminal size={18} /> Launch Tester
                    </button>
                    <button 
                      onClick={() => setShowDoc(true)}
                      className="px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                      View Documentation
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-6 border-l-4 border-cyan-500">
                    <h3 className="text-sm font-bold uppercase mb-2">Stateless Architecture</h3>
                    <p className="text-xs text-zinc-500">Designed for rapid horizontal scaling during traffic spikes without session overhead.</p>
                  </div>
                  <div className="glass-panel p-6 border-l-4 border-magenta-500">
                    <h3 className="text-sm font-bold uppercase mb-2">Unified JSON Schema</h3>
                    <p className="text-xs text-zinc-500">Standardized response format ensures consistent integration across all client platforms.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tester' && (
              <motion.div
                key="tester"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel p-8 space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Terminal className="text-cyan-400" /> API Query Tester
                  </h2>
                  <div className="text-[10px] font-mono text-zinc-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                    GET /icube/api/v1/native/config/query
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold">Machine ID (mid)</label>
                    <input disabled value="mac_001" className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-zinc-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold">API Key (Debug)</label>
                    <input disabled value={process.env.TRAE_API_KEY || 'trae-secret-api-key-2026'} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-zinc-400" />
                  </div>
                </div>

                <button 
                  onClick={runTest}
                  disabled={isLoading}
                  className="w-full py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                  {isLoading ? 'Processing...' : 'Execute Query'}
                </button>

                {testResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/60 rounded-lg border border-white/10 p-4 font-mono text-xs overflow-x-auto"
                  >
                    <div className="flex justify-between mb-2 border-b border-white/5 pb-2">
                      <span className="text-zinc-500">Response Body</span>
                      <span className={testResult.success ? 'text-emerald-500' : 'text-rose-500'}>
                        {testResult.success ? '200 OK' : 'Error'}
                      </span>
                    </div>
                    <pre className="text-cyan-300">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel overflow-hidden"
              >
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                  <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} className="text-magenta-400" /> Live Traffic Stream
                  </h2>
                  <div className="text-[10px] text-zinc-500">Auto-refreshing...</div>
                </div>
                <div className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${log.status === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {log.status}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-mono text-zinc-300">{log.path}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{log.uid}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-600 font-mono group-hover:text-zinc-400 transition-colors">
                        {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto p-8 text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-mono">
        &copy; 2026 Trae Systems &bull; Secure Configuration Microservice &bull; v1.0.4-stable
      </footer>

      {/* Documentation Modal */}
      <AnimatePresence>
        {showDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight uppercase">API Documentation</h2>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">v1.0.4-stable</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDoc(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8 custom-scrollbar">
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">Endpoint Definition</h3>
                  <div className="p-4 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between">
                    <code className="text-xs text-cyan-300 font-mono">GET /icube/api/v1/native/config/query</code>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">STABLE</span>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">Authentication</h3>
                  <div className="p-4 bg-black/40 rounded-lg border border-white/5 space-y-3">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      This endpoint requires a Bearer token for all requests. Unauthorized access will result in a 401 status code.
                    </p>
                    <div className="p-3 bg-zinc-800/50 rounded border border-white/5">
                      <code className="text-[11px] text-magenta-400 font-mono">
                        Authorization: Bearer {"<TRAE_API_KEY>"}
                      </code>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">Required Parameters</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { name: 'mid', desc: 'Machine ID (Hardware identifier)', type: 'string' },
                      { name: 'did', desc: 'Device ID (Software instance)', type: 'string' },
                      { name: 'uid', desc: 'User ID (Account identifier)', type: 'string' },
                      { name: 'platform', desc: 'Target OS platform', type: 'enum' }
                    ].map(param => (
                      <div key={param.name} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                        <div>
                          <span className="text-xs font-mono text-cyan-400 font-bold">{param.name}</span>
                          <p className="text-[10px] text-zinc-500">{param.desc}</p>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 bg-black/40 px-1.5 py-0.5 rounded">{param.type}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">Sample Response</h3>
                  <div className="p-4 bg-black/60 rounded-lg border border-white/10">
                    <pre className="text-[11px] text-cyan-300/80 font-mono leading-relaxed">
{`{
  "success": true,
  "data": {
    "configId": "cfg_7712",
    "status": "active",
    "features": ["native_acceleration", "cloud_sync"],
    "timestamp": "2026-03-12T17:56:06Z"
  }
}`}
                    </pre>
                  </div>
                </section>
              </div>

              <div className="p-6 bg-black/40 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => setShowDoc(false)}
                  className="px-8 py-2 bg-cyan-500 text-black font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors uppercase tracking-widest"
                >
                  Close Documentation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
