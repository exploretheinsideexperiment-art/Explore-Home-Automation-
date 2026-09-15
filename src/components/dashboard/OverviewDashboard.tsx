import React, { useMemo } from 'react';
import {
  Cpu,
  Zap,
  AlertTriangle,
  Activity,
  Power,
  Thermometer,
  Droplets,
  Wifi,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { GENERATE_HISTORICAL_TELEMETRY } from '../../data/initialData';

interface OverviewDashboardProps {
  onNavigateTab: (tab: any) => void;
  onSelectDevice: (device: any) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigateTab,
  onSelectDevice
}) => {
  const { devices, automations, events, activeHome, updateDatastreamValue } = useIoT();

  const chartData = useMemo(() => GENERATE_HISTORICAL_TELEMETRY(), []);

  const onlineDevices = devices.filter((d) => d.status === 'ONLINE');
  const offlineDevices = devices.filter((d) => d.status === 'OFFLINE');
  const activeAutomationsCount = automations.filter((a) => a.enabled).length;
  const unackAlerts = events.filter((e) => !e.acknowledged);

  // Compute total live power if energy meter devices exist
  const totalPowerWatts = useMemo(() => {
    let sum = 0;
    devices.forEach((dev) => {
      const pwr = dev.datastreams.find((d) => d.id === 'active_power');
      if (pwr && typeof pwr.currentValue === 'number') {
        sum += pwr.currentValue;
      }
    });
    return sum > 0 ? sum : 1294; // fallback baseline
  }, [devices]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Home Info and Quick Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              RESIDENCE: {activeHome.name.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">• IoT Gateway Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Smart Space Telemetry & Automation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time MQTT TLS stream, edge automations, and ESP32 telemetry nodes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => onNavigateTab('devices')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition shadow"
          >
            <span>Device Inventory</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            onClick={() => onNavigateTab('automations')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/15"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rule Engine</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Devices */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Devices</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{devices.length}</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">
              {onlineDevices.length} Online
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{offlineDevices.length === 0 ? 'All nodes healthy' : `${offlineDevices.length} offline`}</span>
          </div>
        </div>

        {/* Card 2: Active Automations */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Active Automations</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{activeAutomationsCount}</span>
            <span className="text-xs text-slate-400">of {automations.length} rules</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-indigo-300">
            <Activity className="w-3 h-3" />
            <span>Autonomous edge evaluation</span>
          </div>
        </div>

        {/* Card 3: System Alerts */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">System Alerts</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              unackAlerts.length > 0
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                : 'bg-slate-800 text-slate-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{unackAlerts.length}</span>
            <span className="text-xs text-slate-400">unacknowledged</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {unackAlerts.length > 0 ? (
              <span className="text-amber-400 font-medium">Requires operator attention</span>
            ) : (
              <span>No critical flags</span>
            )}
          </div>
        </div>

        {/* Card 4: Energy Consumption */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Grid Load</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{totalPowerWatts}</span>
            <span className="text-xs text-slate-400">Watts active</span>
          </div>
          <div className="mt-3 text-[11px] text-cyan-400 font-mono">
            <span>~{(totalPowerWatts / 230).toFixed(1)}A @ 230V Mains</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Controls + Telemetry Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Quick Relays & Device Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Quick Relay & Appliance Toggles
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Live sub-100ms MQTT sync</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {devices.map((device) => {
              // Find writable boolean/relay datastreams
              const switches = device.datastreams.filter(
                (ds) => ds.dataType === 'Boolean' && !ds.readOnly
              );
              if (switches.length === 0) return null;

              return (
                <div
                  key={device.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700/80 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <h3 className="text-xs font-bold text-slate-200 truncate">{device.name}</h3>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {device.metadata.hardwareVersion.split(' ')[0]} • RSSI {device.metadata.rssi} dBm
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectDevice(device)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Inspect device details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Relay switch pills */}
                  <div className="space-y-2">
                    {switches.slice(0, 4).map((sw) => {
                      const isOn = Boolean(sw.currentValue);
                      return (
                        <div
                          key={sw.id}
                          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              {sw.pin || 'IO'}
                            </span>
                            <span className="text-xs font-medium text-slate-200 truncate">
                              {sw.name}
                            </span>
                          </div>

                          <button
                            onClick={() => updateDatastreamValue(device.id, sw.id, !isOn)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                              isOn ? 'bg-emerald-500' : 'bg-slate-700'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                isOn ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Environmental Radar & Live Telemetry Gauge */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Climate & Ambient Sensors
              </h2>
            </div>
          </div>

          {/* Living Room Climate Card */}
          {(() => {
            const climateDev = devices.find((d) => d.category === 'Climate');
            const tempVal = climateDev?.datastreams.find((d) => d.id === 'temperature')?.currentValue ?? 24.2;
            const humVal = climateDev?.datastreams.find((d) => d.id === 'humidity')?.currentValue ?? 48;
            const aqiVal = climateDev?.datastreams.find((d) => d.id === 'air_quality')?.currentValue ?? 24;

            return (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-white">Living Room Node</h3>
                    <p className="text-[10px] text-slate-400 font-mono">ESP32-C3 Radar SHT40</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
                    Air: Good
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                      <span>Temperature</span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">{tempVal}°C</div>
                    <span className="text-[10px] text-slate-500">Target: 22.5°C</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Humidity</span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">{humVal}%</div>
                    <span className="text-[10px] text-slate-500">Comfort range</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-300">TVOC Air Quality Index</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{aqiVal} AQI</span>
                </div>
              </div>
            );
          })()}

          {/* Active Rules Mini List */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Rules
              </span>
              <button
                onClick={() => onNavigateTab('automations')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                View all ({automations.length})
              </button>
            </div>

            <div className="space-y-2">
              {automations.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{a.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{a.description}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    a.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {a.enabled ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Telemetry Graph */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              24-Hour Telemetry & Energy Demand Curve
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated time-series data streamed from ESP32 & ESP8266 nodes.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Temp (°C)</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Humidity (%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Power (W)</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="temperature" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" name="Temp (°C)" />
              <Area type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#humidityGradient)" name="Humidity (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
