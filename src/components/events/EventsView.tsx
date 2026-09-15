import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Filter,
  CheckCheck,
  Search,
  Shield,
  Clock
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { EventSeverity } from '../../types';

export const EventsView: React.FC = () => {
  const { events, acknowledgeEvent, clearAllEvents } = useIoT();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((evt) => {
    const matchesSev = selectedSeverity === 'ALL' || evt.severity === selectedSeverity;
    const matchesSearch =
      evt.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.deviceName && evt.deviceName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSev && matchesSearch;
  });

  const getSeverityIcon = (sev: EventSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'ERROR':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'INFO':
      default:
        return <Info className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getSeverityBadge = (sev: EventSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'ERROR':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'INFO':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Events, Faults & Notification Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of hardware disconnection alerts, high temperature limits, and security trips.
          </p>
        </div>

        <button
          onClick={clearAllEvents}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>Acknowledge & Clear All</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, device names, or messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="WARNING">Warnings</option>
            <option value="INFO">Informational</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">All systems operational</p>
            <p className="text-xs text-slate-500 mt-1">No unhandled events or hardware faults.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                evt.acknowledged
                  ? 'bg-slate-900/60 border-slate-800/80'
                  : 'bg-slate-900 border-slate-700 shadow-md ring-1 ring-emerald-500/20'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="mt-0.5">{getSeverityIcon(evt.severity)}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${getSeverityBadge(
                        evt.severity
                      )}`}
                    >
                      {evt.severity}
                    </span>
                    {evt.deviceName && (
                      <span className="text-xs font-semibold text-white truncate">
                        {evt.deviceName}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">
                      Category: {evt.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{evt.message}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{evt.timestamp}</span>
                    {evt.acknowledged && (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        • Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!evt.acknowledged && (
                <button
                  onClick={() => acknowledgeEvent(evt.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition shrink-0"
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
