import React, { useState } from 'react';
import {
  Terminal,
  Send,
  Trash2,
  Pause,
  Play,
  Filter,
  Search,
  CheckCircle2,
  Radio,
  Copy,
  Info
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';

export const MqttBrokerConsole: React.FC = () => {
  const { mqttMessages, devices, showToast } = useIoT();
  const [isPaused, setIsPaused] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');
  const [filterDirection, setFilterDirection] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  // Publisher state
  const [publishTopic, setPublishTopic] = useState(
    `exploreha/${devices[0]?.id || 'dev-01'}/cmd/V1`
  );
  const [publishPayload, setPublishPayload] = useState('{"state": 1}');

  const filteredLogs = mqttMessages.filter((msg) => {
    const matchesTopic =
      msg.topic.toLowerCase().includes(searchTopic.toLowerCase()) ||
      msg.payload.toLowerCase().includes(searchTopic.toLowerCase());
    const matchesDir = filterDirection === 'ALL' || msg.direction === filterDirection;
    return matchesTopic && matchesDir;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishTopic.trim()) return;

    showToast(`Published message to ${publishTopic}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>MQTT Broker Live Traffic & Packet Sniffer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Low-latency broker packet inspector (MQTTS Port 8883 / WSS Port 8084).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Broker: mqtt.exploreha.internal:8883 (TLS 1.3)</span>
          </div>
        </div>
      </div>

      {/* Packet Publisher Simulator */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span>Manual MQTT Packet Injection (Test Tool)</span>
        </h2>

        <form onSubmit={handlePublish} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label className="text-[11px] text-slate-400 block mb-1">Target MQTT Topic</label>
            <input
              type="text"
              value={publishTopic}
              onChange={(e) => setPublishTopic(e.target.value)}
              placeholder="e.g. exploreha/device-id/cmd/V1"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="text-[11px] text-slate-400 block mb-1">Payload (JSON or String)</label>
            <input
              type="text"
              value={publishPayload}
              onChange={(e) => setPublishPayload(e.target.value)}
              placeholder='e.g. {"state": 1}'
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Inject Packet</span>
            </button>
          </div>
        </form>
      </div>

      {/* Packet Stream Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by topic string or payload content..."
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Direction: All</option>
            <option value="IN">Incoming (Device → Cloud)</option>
            <option value="OUT">Outgoing (Cloud → Device)</option>
          </select>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isPaused
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </div>

      {/* Live Stream Terminal Box */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs shadow-inner space-y-2 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800/80">
          <span>QoS 1 • Persistent Session • TLS Encrypted</span>
          <span>{filteredLogs.length} Packets Displayed</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            No MQTT packets match the filter criteria.
          </div>
        ) : (
          filteredLogs.map((msg) => (
            <div
              key={msg.id}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex items-start gap-3"
            >
              <span
                className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                  msg.direction === 'IN'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {msg.direction}
              </span>

              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-slate-400 truncate">{msg.topic}</div>
                <div className="text-xs text-white font-medium mt-0.5 break-all">
                  {msg.payload}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block">{msg.timestamp}</span>
                <span className="text-[9px] text-slate-600">QoS {msg.qos}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
