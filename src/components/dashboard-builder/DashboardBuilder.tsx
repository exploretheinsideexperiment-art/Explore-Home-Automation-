import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Power,
  Gauge,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  BatteryCharging,
  Video,
  Eye,
  CheckCircle2,
  RefreshCw,
  Move
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { DashboardWidget } from '../../types';

export const DashboardBuilder: React.FC = () => {
  const { widgets, addWidget, removeWidget, devices, updateDatastreamValue, showToast } = useIoT();
  const [showAddModal, setShowAddModal] = useState(false);

  // New widget form state
  const [widgetTitle, setWidgetTitle] = useState('');
  const [widgetType, setWidgetType] = useState<DashboardWidget['type']>('switch');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [selectedDatastreamId, setSelectedDatastreamId] = useState<string>(
    devices[0]?.datastreams[0]?.id || ''
  );
  const [widgetColor, setWidgetColor] = useState('#10b981');
  const [widgetWidth, setWidgetWidth] = useState<number>(2);

  const currentDevice = devices.find((d) => d.id === selectedDeviceId);

  const handleAddWidgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!widgetTitle.trim()) return;

    addWidget({
      title: widgetTitle,
      type: widgetType,
      deviceId: selectedDeviceId,
      datastreamId: selectedDatastreamId,
      color: widgetColor,
      width: widgetWidth
    });

    setShowAddModal(false);
    setWidgetTitle('');
    showToast('New widget added to dashboard canvas.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Interactive Visual Dashboard Builder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Design custom telemetry dashboards with switches, gauges, sliders, LEDs, and charts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-500/15"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Canvas Widget</span>
        </button>
      </div>

      {/* Canvas Controls Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span>Interactive Mode: Click any widget control to dispatch live MQTT command</span>
        </div>
        <span className="font-mono text-slate-500 text-[11px]">{widgets.length} Active Widgets</span>
      </div>

      {/* Widget Canvas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((widget) => {
          const device = devices.find((d) => d.id === widget.deviceId);
          const datastream = device?.datastreams.find((ds) => ds.id === widget.datastreamId);
          const val = datastream?.currentValue;
          const isOn = Boolean(val);

          const colSpanClass =
            widget.width === 4
              ? 'sm:col-span-2 lg:col-span-4'
              : widget.width === 3
              ? 'sm:col-span-2 lg:col-span-3'
              : widget.width === 2
              ? 'sm:col-span-2'
              : 'col-span-1';

          return (
            <div
              key={widget.id}
              className={`p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between group hover:border-slate-700 transition relative ${colSpanClass}`}
            >
              {/* Widget Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    {device?.name || 'Device'} • {datastream?.pin || datastream?.id}
                  </span>
                  <h3 className="text-xs font-bold text-white truncate">{widget.title}</h3>
                </div>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                  <button
                    onClick={() => removeWidget(widget.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Remove widget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Widget Body based on Type */}
              <div className="py-2">
                {widget.type === 'switch' && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs font-mono font-bold text-slate-300">
                      STATE: {isOn ? 'ON' : 'OFF'}
                    </span>
                    <button
                      onClick={() =>
                        updateDatastreamValue(widget.deviceId, widget.datastreamId, !isOn)
                      }
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                        isOn ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                          isOn ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {widget.type === 'slider' && (
                  <div className="space-y-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Level</span>
                      <span className="text-emerald-400 font-bold">
                        {val} {datastream?.unit || '%'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={datastream?.minValue ?? 0}
                      max={datastream?.maxValue ?? 100}
                      value={Number(val) || 0}
                      onChange={(e) =>
                        updateDatastreamValue(
                          widget.deviceId,
                          widget.datastreamId,
                          Number(e.target.value)
                        )
                      }
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                )}

                {widget.type === 'temperature' && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <Thermometer className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-slate-400">Thermal Probe</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-white">
                      {val !== undefined ? val : '24.2'}°C
                    </span>
                  </div>
                )}

                {widget.type === 'humidity' && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-slate-400">Relative Humidity</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-cyan-400">
                      {val !== undefined ? val : '48'}%
                    </span>
                  </div>
                )}

                {widget.type === 'gauge' && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-center">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {val !== undefined ? val : '4.82'}{' '}
                      <span className="text-xs font-normal text-slate-400">
                        {datastream?.unit || 'A'}
                      </span>
                    </span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-400 h-full"
                        style={{ width: `${Math.min(100, (Number(val) / 30) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {widget.type === 'energy' && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-slate-400">Active Load</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-amber-400">
                      {val !== undefined ? val : '334'} W
                    </span>
                  </div>
                )}

                {widget.type === 'chart' && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-slate-300">Continuous Telemetry Monitor</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {val !== undefined ? val : '38.4'}{' '}
                      {datastream?.unit || '°C'}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>MQTT: /state/{widget.datastreamId}</span>
                <span className="text-emerald-400 font-semibold">SYNCED</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Widget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Dashboard Widget</h3>
            <p className="text-xs text-slate-400 mb-4">
              Bind an interactive control or telemetry viewer to a device datastream channel.
            </p>

            <form onSubmit={handleAddWidgetSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Widget Label / Title</label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  placeholder="e.g. Living Room Chandelier"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Widget Type</label>
                <select
                  value={widgetType}
                  onChange={(e) => setWidgetType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="switch">Switch (Relay / Digital IO)</option>
                  <option value="slider">Slider (PWM / Dimmer)</option>
                  <option value="gauge">Gauge / Current Meter</option>
                  <option value="temperature">Temperature Display</option>
                  <option value="humidity">Humidity Display</option>
                  <option value="energy">Active Energy (Watts)</option>
                  <option value="chart">Telemetry Graph</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Target Device</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => {
                    setSelectedDeviceId(e.target.value);
                    const dev = devices.find((d) => d.id === e.target.value);
                    if (dev && dev.datastreams[0]) {
                      setSelectedDatastreamId(dev.datastreams[0].id);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.metadata.hardwareVersion.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Datastream Channel</label>
                <select
                  value={selectedDatastreamId}
                  onChange={(e) => setSelectedDatastreamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                >
                  {currentDevice?.datastreams.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.pin || 'V'} - {ds.name} ({ds.dataType})
                    </option>
                  ))}
                </select>
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Place Widget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
