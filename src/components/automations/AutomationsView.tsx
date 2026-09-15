import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Play,
  Trash2,
  Clock,
  Bell,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Send,
  Power
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { Automation } from '../../types';

export const AutomationsView: React.FC = () => {
  const {
    automations,
    toggleAutomation,
    addAutomation,
    deleteAutomation,
    devices,
    updateDatastreamValue,
    showToast
  } = useIoT();

  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerDeviceId, setTriggerDeviceId] = useState<string>(devices[0]?.id || '');
  const [triggerDatastreamId, setTriggerDatastreamId] = useState<string>(
    devices[0]?.datastreams[0]?.id || ''
  );
  const [triggerOperator, setTriggerOperator] = useState<'>' | '<' | '==' | '!='>('>');
  const [triggerThreshold, setTriggerThreshold] = useState<string>('28');

  const [actionDeviceId, setActionDeviceId] = useState<string>(devices[0]?.id || '');
  const [actionDatastreamId, setActionDatastreamId] = useState<string>(
    devices[0]?.datastreams[0]?.id || ''
  );
  const [actionTargetValue, setActionTargetValue] = useState<string>('true');
  const [notificationMsg, setNotificationMsg] = useState<string>('');

  const triggerDevice = devices.find((d) => d.id === triggerDeviceId);
  const actionDevice = devices.find((d) => d.id === actionDeviceId);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addAutomation({
      name,
      description: description || `Automated rule triggered by ${triggerDatastreamId}`,
      enabled: true,
      trigger: {
        type: 'datastream_value',
        deviceId: triggerDeviceId,
        datastreamId: triggerDatastreamId,
        operator: triggerOperator,
        threshold: isNaN(Number(triggerThreshold)) ? triggerThreshold : Number(triggerThreshold)
      },
      conditions: [
        {
          type: 'time_range',
          startTime: '08:00',
          endTime: '23:00'
        }
      ],
      actions: [
        {
          type: 'set_datastream',
          deviceId: actionDeviceId,
          datastreamId: actionDatastreamId,
          targetValue: actionTargetValue === 'true' ? true : actionTargetValue === 'false' ? false : Number(actionTargetValue)
        },
        ...(notificationMsg.trim()
          ? [
              {
                type: 'send_notification' as const,
                message: notificationMsg,
                severity: 'INFO' as const
              }
            ]
          : [])
      ],
      lastTriggered: 'Never'
    });

    setShowAddModal(false);
    setName('');
    setDescription('');
    setNotificationMsg('');
  };

  const handleTestRun = (auto: Automation) => {
    // Manually execute actions
    auto.actions.forEach((act) => {
      if (act.type === 'set_datastream' && act.deviceId && act.datastreamId) {
        updateDatastreamValue(act.deviceId, act.datastreamId, act.targetValue);
      }
    });
    showToast(`Test execution completed for [${auto.name}]!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Autonomous Rule & Logic Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual conditional logic (WHEN event → IF state → THEN actions) running at the IoT edge and cloud.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-500/15"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {automations.map((auto) => {
          const trigDev = devices.find((d) => d.id === auto.trigger.deviceId);

          return (
            <div
              key={auto.id}
              className={`p-5 rounded-2xl border transition-all ${
                auto.enabled
                  ? 'bg-slate-900/90 border-slate-800 shadow-md'
                  : 'bg-slate-950/40 border-slate-900 opacity-70'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      auto.enabled
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{auto.name}</h3>
                    <p className="text-xs text-slate-400">{auto.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleTestRun(auto)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Simulate immediate rule trigger"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test Run</span>
                  </button>

                  <button
                    onClick={() => toggleAutomation(auto.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      auto.enabled
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {auto.enabled ? 'ACTIVE' : 'PAUSED'}
                  </button>

                  <button
                    onClick={() => deleteAutomation(auto.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Logic Flow: WHEN -> IF -> THEN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                {/* 1. WHEN TRIGGER */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>WHEN (Trigger)</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {trigDev?.name || 'Device'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {auto.trigger.datastreamId} {auto.trigger.operator} {String(auto.trigger.threshold)}
                  </div>
                </div>

                {/* 2. IF CONDITIONS */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>IF (Condition)</span>
                  </div>
                  {auto.conditions.length === 0 ? (
                    <span className="text-xs text-slate-500">Always active (Any time)</span>
                  ) : (
                    auto.conditions.map((c, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>Between {c.startTime} and {c.endTime}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* 3. THEN ACTIONS */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>THEN (Actions)</span>
                  </div>
                  <div className="space-y-1">
                    {auto.actions.map((act, i) => {
                      if (act.type === 'set_datastream') {
                        const actDev = devices.find((d) => d.id === act.deviceId);
                        return (
                          <div key={i} className="text-xs text-slate-200 flex items-center gap-1 font-mono truncate">
                            <Power className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>Set {act.datastreamId} → {String(act.targetValue)}</span>
                          </div>
                        );
                      }
                      if (act.type === 'send_notification') {
                        return (
                          <div key={i} className="text-xs text-slate-200 flex items-center gap-1 truncate">
                            <Bell className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>Notify: "{act.message}"</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>

              {/* Execution telemetry footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Last fired: {auto.lastTriggered || 'Never'}</span>
                <span>Trigger count: {auto.executionCount}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Automation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-base font-bold text-white mb-1">Create Automation Rule</h3>
            <p className="text-xs text-slate-400 mb-4">
              Configure event-driven trigger conditions and actions across devices.
            </p>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Turn ON Air Purifier when AQI increases"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* WHEN Trigger Section */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
                  1. WHEN Trigger Event Occurs:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Source Device</label>
                    <select
                      value={triggerDeviceId}
                      onChange={(e) => {
                        setTriggerDeviceId(e.target.value);
                        const dev = devices.find((d) => d.id === e.target.value);
                        if (dev?.datastreams[0]) setTriggerDatastreamId(dev.datastreams[0].id);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    >
                      {devices.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Datastream Pin</label>
                    <select
                      value={triggerDatastreamId}
                      onChange={(e) => setTriggerDatastreamId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                    >
                      {triggerDevice?.datastreams.map((ds) => (
                        <option key={ds.id} value={ds.id}>
                          {ds.pin || 'V'} - {ds.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Operator</label>
                    <select
                      value={triggerOperator}
                      onChange={(e) => setTriggerOperator(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                    >
                      <option value=">">Greater than (&gt;)</option>
                      <option value="<">Less than (&lt;)</option>
                      <option value="==">Equals (==)</option>
                      <option value="!=">Not equals (!=)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Threshold Value</label>
                    <input
                      type="text"
                      value={triggerThreshold}
                      onChange={(e) => setTriggerThreshold(e.target.value)}
                      placeholder="e.g. 28 or true"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* THEN Action Section */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
                  2. THEN Execute Actions:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Target Device</label>
                    <select
                      value={actionDeviceId}
                      onChange={(e) => {
                        setActionDeviceId(e.target.value);
                        const dev = devices.find((d) => d.id === e.target.value);
                        if (dev?.datastreams[0]) setActionDatastreamId(dev.datastreams[0].id);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    >
                      {devices.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Target Channel</label>
                    <select
                      value={actionDatastreamId}
                      onChange={(e) => setActionDatastreamId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                    >
                      {actionDevice?.datastreams.map((ds) => (
                        <option key={ds.id} value={ds.id}>
                          {ds.pin || 'V'} - {ds.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-0.5">Target Action Value</label>
                  <select
                    value={actionTargetValue}
                    onChange={(e) => setActionTargetValue(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                  >
                    <option value="true">Turn ON / Set True (1)</option>
                    <option value="false">Turn OFF / Set False (0)</option>
                    <option value="100">Set 100%</option>
                    <option value="50">Set 50%</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-0.5">
                    Optional In-App Notification Message
                  </label>
                  <input
                    type="text"
                    value={notificationMsg}
                    onChange={(e) => setNotificationMsg(e.target.value)}
                    placeholder="e.g. Living room fan turned on automatically."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-400"
                >
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
