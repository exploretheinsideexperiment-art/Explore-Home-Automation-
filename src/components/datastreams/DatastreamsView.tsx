import React, { useState } from 'react';
import {
  GitCommit,
  Search,
  Filter,
  Sliders,
  Send,
  CheckCircle2,
  Database,
  Cpu,
  Info
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { DatastreamType } from '../../types';

export const DatastreamsView: React.FC = () => {
  const { devices, updateDatastreamValue, showToast } = useIoT();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Flatten all datastreams with their parent device
  const allStreams = devices.flatMap((dev) =>
    dev.datastreams.map((ds) => ({
      ...ds,
      deviceId: dev.id,
      deviceName: dev.name,
      deviceHardware: dev.metadata.hardwareVersion.split(' ')[0]
    }))
  );

  const filteredStreams = allStreams.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.pin && s.pin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.deviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || s.dataType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-emerald-400" />
            <span>Datastream Architecture & Virtual Pins</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Communication channels mapping cloud state to micro-controller GPIO and virtual registers.
          </p>
        </div>
      </div>

      {/* Datastream Type Badges Explainer */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
        {[
          { type: 'Boolean', desc: '0 or 1, High/Low', color: 'text-emerald-400 bg-emerald-500/10' },
          { type: 'Integer', desc: 'Whole numbers', color: 'text-cyan-400 bg-cyan-500/10' },
          { type: 'Float', desc: 'Precision decimals', color: 'text-teal-400 bg-teal-500/10' },
          { type: 'String', desc: 'Hex colors, text', color: 'text-amber-400 bg-amber-500/10' },
          { type: 'Enum', desc: 'State sets / modes', color: 'text-indigo-400 bg-indigo-500/10' },
          { type: 'Digital', desc: 'Raw GPIO logic', color: 'text-rose-400 bg-rose-500/10' },
          { type: 'JSON', desc: 'Multi-variable blob', color: 'text-purple-400 bg-purple-500/10' }
        ].map((t) => (
          <div key={t.type} className={`p-2.5 rounded-xl border border-slate-800 ${t.color}`}>
            <span className="font-mono font-bold block">{t.type}</span>
            <span className="text-[10px] text-slate-400">{t.desc}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by datastream name, pin (V1), ID, or device..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Data Types</option>
          <option value="Boolean">Boolean</option>
          <option value="Float">Float</option>
          <option value="Integer">Integer</option>
          <option value="String">String</option>
          <option value="Enum">Enum</option>
        </select>
      </div>

      {/* Datastreams Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
            <tr>
              <th className="p-3.5">Virtual Pin</th>
              <th className="p-3.5">Datastream Name</th>
              <th className="p-3.5">Parent Device</th>
              <th className="p-3.5">Data Type</th>
              <th className="p-3.5">Current Value</th>
              <th className="p-3.5">Range / Unit</th>
              <th className="p-3.5">Permissions</th>
              <th className="p-3.5 text-right">Quick Test</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {filteredStreams.map((stream) => (
              <tr key={`${stream.deviceId}-${stream.id}`} className="hover:bg-slate-800/40 transition">
                <td className="p-3.5 font-bold text-emerald-400">{stream.pin || 'V-'}</td>
                <td className="p-3.5 font-sans font-semibold text-white">
                  <div>{stream.name}</div>
                  <span className="text-[10px] font-mono text-slate-500">{stream.id}</span>
                </td>
                <td className="p-3.5 font-sans">
                  <div className="text-slate-200">{stream.deviceName}</div>
                  <span className="text-[10px] font-mono text-slate-500">{stream.deviceHardware}</span>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-[11px]">
                    {stream.dataType}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-slate-100">
                  {String(stream.currentValue)} {stream.unit || ''}
                </td>
                <td className="p-3.5 text-slate-400">
                  {stream.minValue !== undefined ? `${stream.minValue} ~ ${stream.maxValue}` : '—'}{' '}
                  {stream.unit || ''}
                </td>
                <td className="p-3.5 font-sans">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      stream.readOnly ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {stream.readOnly ? 'READ ONLY' : 'READ/WRITE'}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  {!stream.readOnly && stream.dataType === 'Boolean' && (
                    <button
                      onClick={() =>
                        updateDatastreamValue(stream.deviceId, stream.id, !stream.currentValue)
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-[11px] font-semibold transition"
                    >
                      Toggle
                    </button>
                  )}
                  {stream.readOnly && (
                    <span className="text-[10px] text-slate-500 font-sans">Telemetry Stream</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
