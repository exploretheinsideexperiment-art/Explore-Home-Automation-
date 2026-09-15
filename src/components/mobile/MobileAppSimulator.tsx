import React, { useState } from 'react';
import {
  Smartphone,
  Home,
  Cpu,
  Zap,
  Bell,
  User,
  Power,
  Sliders,
  Thermometer,
  Droplets,
  Wifi,
  Battery,
  Shield,
  X,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { Device, Datastream } from '../../types';

interface MobileAppSimulatorProps {
  onOpenProvisioning?: () => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({ onOpenProvisioning }) => {
  const {
    activeHome,
    rooms,
    devices,
    automations,
    events,
    updateDatastreamValue,
    currentUser,
    toggleAutomation
  } = useIoT();

  const [activeTab, setActiveTab] = useState<'home' | 'devices' | 'automations' | 'alerts'>('home');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('ALL');
  const [inspectDevice, setInspectDevice] = useState<Device | null>(null);

  const activeRooms = rooms.filter((r) => r.homeId === activeHome.id);
  const homeDevices = devices.filter((d) => d.homeId === activeHome.id);

  const displayedDevices =
    selectedRoomId === 'ALL'
      ? homeDevices
      : homeDevices.filter((d) => d.roomId === selectedRoomId);

  return (
    <div className="flex items-center justify-center p-2 sm:p-4">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-[390px] h-[780px] rounded-[48px] bg-slate-950 border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700/50">
        {/* Dynamic Island / Notch */}
        <div className="pt-2.5 pb-1 px-7 flex items-center justify-between text-white text-[11px] font-semibold select-none bg-slate-950 z-20">
          <span>9:41</span>
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="px-5 py-3 border-b border-slate-900 bg-slate-950 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">
              {activeHome.name}
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Explore HA Mobile</h2>
          </div>

          <button
            onClick={onOpenProvisioning}
            className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Room Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-900 flex items-center gap-1.5 overflow-x-auto bg-slate-950 no-scrollbar">
          <button
            onClick={() => setSelectedRoomId('ALL')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
              selectedRoomId === 'ALL'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Spaces ({homeDevices.length})
          </button>
          {activeRooms.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoomId(r.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                selectedRoomId === r.id
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        {/* Scrollable Mobile Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/40">
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-3">
              {/* Climate summary widget */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    Home Environment
                  </span>
                  <div className="text-xl font-bold text-white mt-0.5">24.2°C</div>
                  <span className="text-[11px] text-slate-400">Comfort: Optimal • 48% RH</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Thermometer className="w-5 h-5" />
                </div>
              </div>

              {/* Devices quick tiles */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-1">
                  Active Hardware
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {displayedDevices.map((dev) => {
                    const primarySwitch = dev.datastreams.find(
                      (ds) => ds.dataType === 'Boolean' && !ds.readOnly
                    );
                    const isOn = Boolean(primarySwitch?.currentValue);

                    return (
                      <div
                        key={dev.id}
                        onClick={() => setInspectDevice(dev)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28 ${
                          isOn
                            ? 'bg-slate-900 border-emerald-500/40 shadow-sm'
                            : 'bg-slate-950 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              dev.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-rose-500'
                            }`}
                          />
                          {primarySwitch && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateDatastreamValue(dev.id, primarySwitch.id, !isOn);
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                                isOn
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white truncate">{dev.name}</div>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {dev.metadata.hardwareVersion.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEVICES */}
          {activeTab === 'devices' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-1">
                Fleet Status ({displayedDevices.length})
              </span>
              {displayedDevices.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => setInspectDevice(dev)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[170px]">
                        {dev.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        RSSI: {dev.metadata.rssi} dBm • {dev.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {/* TAB: AUTOMATIONS */}
          {activeTab === 'automations' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-1">
                Edge Rules
              </span>
              {automations.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{a.name}</div>
                    <span className="text-[10px] text-slate-400">
                      {a.trigger.operator} {String(a.trigger.threshold)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleAutomation(a.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      a.enabled
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {a.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB: ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-1">
                Notifications
              </span>
              {events.slice(0, 5).map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-emerald-400">{evt.severity}</span>
                    <span>{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-[11px]">{evt.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="px-6 py-2.5 border-t border-slate-900 bg-slate-950 flex items-center justify-between z-10">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'devices', label: 'Devices', icon: Cpu },
            { id: 'automations', label: 'Automate', icon: Zap },
            { id: 'alerts', label: 'Alerts', icon: Bell }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex flex-col items-center gap-1 transition ${
                  isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Bottom Sheet for Device Inspection */}
        {inspectDevice && (
          <div className="absolute inset-x-0 bottom-0 top-16 bg-slate-950/95 backdrop-blur-md rounded-t-3xl border-t border-slate-800 z-30 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">{inspectDevice.name}</h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {inspectDevice.status} • {inspectDevice.metadata.hardwareVersion}
                  </span>
                </div>
                <button
                  onClick={() => setInspectDevice(null)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                {inspectDevice.datastreams.map((ds) => {
                  if (ds.dataType === 'Boolean' && !ds.readOnly) {
                    const isOn = Boolean(ds.currentValue);
                    return (
                      <div
                        key={ds.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold text-white">{ds.name}</span>
                        <button
                          onClick={() =>
                            updateDatastreamValue(inspectDevice.id, ds.id, !isOn)
                          }
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                            isOn ? 'bg-emerald-500' : 'bg-slate-700'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                              isOn ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  }

                  if (ds.dataType === 'Integer' || ds.dataType === 'Float') {
                    return (
                      <div
                        key={ds.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{ds.name}</span>
                          <span className="text-emerald-400 font-mono font-bold">
                            {ds.currentValue} {ds.unit || ''}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={ds.minValue ?? 0}
                          max={ds.maxValue ?? 100}
                          value={Number(ds.currentValue) || 0}
                          onChange={(e) =>
                            updateDatastreamValue(
                              inspectDevice.id,
                              ds.id,
                              Number(e.target.value)
                            )
                          }
                          className="w-full accent-emerald-500"
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            <button
              onClick={() => setInspectDevice(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
