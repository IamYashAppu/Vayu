import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChevronRight, Droplets, Plane, Settings, ShieldAlert, Thermometer, Wind, X, Activity, FileText, CheckCircle2 } from 'lucide-react';

const fleetData = [
  { 
    id: 'VT-AXN', 
    component: 'Hydraulic Actuator', 
    rul: 34, 
    critical: true,
    sku: 'BCA-HYD-9902X',
    supplier: 'Boeing Seattle OAM',
    leadTime: '14 Days (Expedited)',
    insight: 'Degradation accelerated by 18% over the last 3 flights. High environmental salinity in current routing is the primary contributing factor.',
    chartData: [
      { flight: 'F-90', health: 98 }, { flight: 'F-91', health: 96 }, { flight: 'F-92', health: 92 },
      { flight: 'F-93', health: 89 }, { flight: 'F-94', health: 85 }, { flight: 'F-95', health: 82 },
      { flight: 'F-96', health: 76 }, { flight: 'F-97', health: 70 }, { flight: 'F-98', health: 65 },
      { flight: 'F-99', health: 58 },
    ]
  },
  { 
    id: 'VT-JWE', 
    component: 'APU Starter Generator', 
    rul: 22, 
    critical: true,
    sku: 'HON-APU-7731Y',
    supplier: 'Honeywell Aerospace',
    leadTime: '5 Days (Stock Hub)',
    insight: 'Thermal cycling stress detected. 3 consecutive high-EGT starts caused a sudden 12% drop in component efficiency.',
    chartData: [
      { flight: 'F-90', health: 99 }, { flight: 'F-91', health: 98 }, { flight: 'F-92', health: 95 },
      { flight: 'F-93', health: 94 }, { flight: 'F-94', health: 91 }, { flight: 'F-95', health: 88 },
      { flight: 'F-96', health: 81 }, { flight: 'F-97', health: 75 }, { flight: 'F-98', health: 68 },
      { flight: 'F-99', health: 52 },
    ]
  },
  { 
    id: 'VT-KLI', 
    component: 'Landing Gear Strut', 
    rul: 18, 
    critical: true,
    sku: 'SAF-LGR-1102Z',
    supplier: 'Safran Landing Systems',
    leadTime: '21 Days (AOG Priority)',
    insight: 'Micro-fractures detected in lower cylinder housing. Hard landings recorded at MAA and DEL exceeded maximum design limits.',
    chartData: [
      { flight: 'F-90', health: 95 }, { flight: 'F-91', health: 93 }, { flight: 'F-92', health: 85 },
      { flight: 'F-93', health: 84 }, { flight: 'F-94', health: 80 }, { flight: 'F-95', health: 75 },
      { flight: 'F-96', health: 65 }, { flight: 'F-97', health: 61 }, { flight: 'F-98', health: 58 },
      { flight: 'F-99', health: 48 },
    ]
  },
  { 
    id: 'VT-MNP', 
    component: 'Bleed Air Valve', 
    rul: 55, 
    critical: true,
    sku: 'LBD-BAV-4405A',
    supplier: 'Liebherr-Aerospace',
    leadTime: '3 Days (Local Hub)',
    insight: 'Valve sticking intermittently. Pressure fluctuations map to sand/dust ingestion during Middle-East routes.',
    chartData: [
      { flight: 'F-90', health: 97 }, { flight: 'F-91', health: 96 }, { flight: 'F-92', health: 92 },
      { flight: 'F-93', health: 88 }, { flight: 'F-94', health: 85 }, { flight: 'F-95', health: 81 },
      { flight: 'F-96', health: 76 }, { flight: 'F-97', health: 73 }, { flight: 'F-98', health: 70 },
      { flight: 'F-99', health: 65 },
    ]
  }
];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(fleetData[0]);
  const [approved, setApproved] = useState(false);

  // We introduce an 'active view' variable for the right pane chart
  const [activeViewAircraft, setActiveViewAircraft] = useState(fleetData[0]);

  const handleDraftPO = (aircraft, e) => {
    e.stopPropagation();
    setSelectedAircraft(aircraft);
    setModalOpen(true);
    setApproved(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col justify-between items-start sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
              <Plane className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Vayu Predict AI</h1>
              <p className="text-xs text-slate-400 font-mono">MRO Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 rounded px-4 py-1.5 border border-slate-700/50 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium">System Live: <span className="text-white font-semibold">147</span> Aircraft Tracked</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Fleet Health & Environmental */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fleet Health Red Zone */}
          <section className="bg-slate-800/40 rounded border border-red-500/20 overflow-hidden flex flex-col shadow-lg">
            <div className="bg-red-500/10 px-5 py-4 border-b border-red-500/20 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-red-500">Action Required: Red Zone</h2>
            </div>
            
            <div className="p-5 space-y-4 overflow-y-auto max-h-[500px]">
              {fleetData.map((ac) => {
                const isActive = activeViewAircraft.id === ac.id;
                
                return (
                  <div 
                    key={ac.id} 
                    onClick={() => setActiveViewAircraft(ac)}
                    className={`bg-slate-900/60 rounded p-4 border flex flex-col gap-3 transition-all cursor-pointer shadow-sm
                      ${isActive ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50' : 'border-slate-700/50 hover:border-slate-500'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-mono font-bold text-white flex items-center gap-2">
                        {ac.id}
                        {isActive && <Activity className="w-3 h-3 text-blue-400" />}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-red-500/20 text-red-400 border border-red-500/30 ${ac.rul < 30 ? 'shadow-[0_0_10px_rgba(239,68,68,0.2)]' : ''}`}>
                        RUL: {ac.rul} FH
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>{ac.component}</span>
                    </div>
                    <button 
                      onClick={(e) => handleDraftPO(ac, e)}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <FileText className="w-4 h-4" />
                      Draft Purchase Order
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Environmental Intelligence */}
          <section className="bg-slate-800/40 rounded border border-slate-700/50 overflow-hidden shadow-lg">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Environmental Intelligence</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                    <Droplets className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Humidity</p>
                    <p className="text-sm font-bold text-white">88% <span className="text-amber-400 font-normal text-xs ml-1">(High)</span></p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
                    <Thermometer className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Salinity</p>
                    <p className="text-sm font-bold text-white">0.12 mg/m² <span className="text-red-400 font-normal text-xs ml-1">(Critical)</span></p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700/50 rounded border border-slate-600/50">
                    <Wind className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Recent Weather</p>
                    <p className="text-sm font-semibold text-white">Monsoon / Heavy Rain</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Analytics and Details */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-slate-800/40 rounded border border-slate-700/50 overflow-hidden flex-grow flex flex-col min-h-[400px] shadow-lg">
            <div className="px-5 py-4 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg font-bold text-white">Predictive Analytics: Component Health Tracking</h2>
              <span className="text-xs bg-slate-900 px-3 py-1.5 rounded border border-slate-700 shadow-inner text-blue-300 font-mono flex items-center gap-2">
                <Activity className="w-3 h-3 text-blue-400" />
                {activeViewAircraft.component} ({activeViewAircraft.id})
              </span>
            </div>
            <div className="p-5 flex-grow font-mono text-sm relative">
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <LineChart data={activeViewAircraft.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="flight" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} domain={[40, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Failure Threshold', fill: '#ef4444', fontSize: 12 }} />
                  <Line 
                    key={activeViewAircraft.id} /* Re-animates chart when activeViewAircraft changes */
                    type="monotone" 
                    dataKey="health" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#0f172a', stroke: '#3b82f6', strokeWidth: 2 }} 
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} 
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-900/50 p-4 border-t border-slate-700/50 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <p className="text-sm text-slate-300 ml-2">
                <strong className="text-white text-base mr-2 flex items-center inline-flex gap-2">
                  <Activity className="w-4 h-4 text-blue-500"/>
                  AI Insight:
                </strong> 
                {activeViewAircraft.insight}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Modal - AI Procurement Co-Pilot */}
      {modalOpen && selectedAircraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity">
          <div className="bg-slate-900 border border-slate-700 rounded shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-white">AI Procurement Co-Pilot</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors focus:outline-none">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4 flex flex-col gap-1">
                <span className="text-xs text-blue-300 font-medium uppercase tracking-widest">Target Maintenance Action</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-mono font-bold text-white">{selectedAircraft.id}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                  <span className="text-white font-medium">{selectedAircraft.component}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Automated Sourcing Pipeline</h4>
                <div className="bg-slate-800/50 rounded flex justify-between p-3 border border-slate-700/50 items-center">
                  <span className="text-slate-400 text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Suggested SKU
                  </span>
                  <span className="font-mono text-white font-medium tracking-wide bg-slate-900 px-2 py-1 rounded border border-slate-700">
                    {selectedAircraft.sku}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded flex justify-between p-3 border border-slate-700/50 items-center">
                  <span className="text-slate-400 text-sm flex items-center gap-2">
                    <Plane className="w-4 h-4" /> Approved Supplier
                  </span>
                  <span className="text-white font-medium">{selectedAircraft.supplier}</span>
                </div>
                <div className="bg-slate-800/50 rounded flex justify-between p-3 border border-slate-700/50 items-center">
                  <span className="text-slate-400 text-sm flex items-center gap-2">
                    <Thermometer className="w-4 h-4" /> Expected Lead Time
                  </span>
                  <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                    {selectedAircraft.leadTime}
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-4 cursor-pointer group mt-6 p-4 rounded bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                <div className="relative flex items-center pt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer sr-only"
                    checked={approved}
                    onChange={(e) => setApproved(e.target.checked)}
                  />
                  <div className="w-5 h-5 border border-slate-500 rounded-sm bg-slate-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                    <CheckCircle2 className={`w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity`} />
                  </div>
                </div>
                <span className="text-sm text-slate-300 group-hover:text-slate-200 leading-relaxed">
                  <span className="block font-semibold text-slate-400 uppercase tracking-wider text-xs mb-1">Human-in-the-Loop Verification</span>
                  I certify airworthiness and traceability documentation for this pending procurement action.
                </span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
              <button 
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-700"
              >
                Cancel
              </button>
              <button 
                disabled={!approved}
                className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  approved 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                    : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-800'
                }`}
                onClick={() => {
                  alert(`Purchase Order Executed: ${selectedAircraft.sku} processing for ${selectedAircraft.id}.`);
                  setModalOpen(false);
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
