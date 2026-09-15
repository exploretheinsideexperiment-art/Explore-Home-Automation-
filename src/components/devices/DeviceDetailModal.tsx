import React, { useState } from 'react';
import {
  X,
  Cpu,
  Power,
  Sliders,
  Terminal,
  HardDriveDownload,
  Settings,
  Wifi,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { Device, Datastream } from '../../types';

interface DeviceDetailModalProps {
  device: Device;
  onClose: () => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ device, onClose }) => {
  const {
    updateDatastreamValue,
    deleteDevice,
    rooms,
    firmwareReleases,
    startOTAUpdate,
    activeOTAJobs,
    mqttMessages,
    currentUser,
    showToast
  } = useIoT();

  const [activeTab, setActiveTab] = useState<'controls' | 'datastreams' | 'logs' | 'ota' | 'settings'>('controls');
  const [copiedToken, setCopiedToken] = useState(false);
  const [selectedFirmwareId, setSelectedFirmwareId] = useState<string>(firmwareReleases[0]?.id || '');

  const room = rooms.find((r) => r.id === device.roomId);
  const currentOTAJob = activeOTAJobs.find((j) => j.deviceId === device.id && j.status !== 'SUCCESS');

  // Filter messages for this device
  const deviceLogs = mqttMessages.filter((m) => m.topic.includes(device.id));

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(device.token);
    setCopiedToken(true);
    showToast('Device Auth Token copied to clipboard');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">{device.name}</h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    device.status === 'ONLINE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : device.status === 'UPDATING'
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {device.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {room?.name || 'General Space'} • {device.metadata.hardwareVersion}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry quick bar */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="text-slate-400">
            <span className="text-slate-500 block text-[10px]">MAC ADDRESS</span>
            <span className="text-slate-300">{device.metadata.macAddress}</span>
          </div>
          <div className="text-slate-400">
            <span className="text-slate-500 block text-[10px]">IP ADDRESS</span>
            <span className="text-emerald-400">{device.metadata.ipAddress}</span>
          </div>
          <div className="text-slate-400">
            <span className="text-slate-500 block text-[10px]">WIFI RSSI</span>
            <span className="text-slate-300">{device.metadata.rssi} dBm</span>
          </div>
          <div className="text-slate-400">
            <span className="text-slate-500 block text-[10px]">ACTIVE FIRMWARE</span>
            <span className="text-cyan-400">{device.metadata.firmwareVersion}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 border-b border-slate-800 bg-slate-900 overflow-x-auto">
          {[
            { id: 'controls', label: 'Controls & I/O', icon: Power },
            { id: 'datastreams', label: 'Datastreams', icon: Sliders },
            { id: 'logs', label: 'MQTT Stream Logs', icon: Terminal },
            { id: 'ota', label: 'OTA Firmware', icon: HardDriveDownload },
            { id: 'settings', label: 'Device Settings', icon: Settings }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CONTROLS */}
          {activeTab === 'controls' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Hardware Virtual Pins & Actuators
                </h3>
                <span className="text-[11px] text-slate-500">Sub-millisecond MQTT command dispatch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {device.datastreams.map((ds) => {
                  if (ds.readOnly) {
                    // Read-only sensor display
                    return (
                      <div
                        key={ds.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              {ds.pin || 'IO'}
                            </span>
                            <span className="text-xs font-semibold text-slate-200">{ds.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">Type: {ds.dataType}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono text-cyan-400">
                            {ds.currentValue} {ds.unit || ''}
                          </div>
                          <span className="text-[10px] text-slate-500">Sensor Telemetry</span>
                        </div>
                      </div>
                    );
                  }

                  if (ds.dataType === 'Boolean') {
                    const isOn = Boolean(ds.currentValue);
                    return (
                      <div
                        key={ds.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              {ds.pin || 'V'}
                            </span>
                            <span className="text-xs font-semibold text-slate-200">{ds.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">Relay / Digital IO</span>
                        </div>

                        <button
                          onClick={() => updateDatastreamValue(device.id, ds.id, !isOn)}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
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
                    );
                  }

                  if (ds.dataType === 'Integer' || ds.dataType === 'Float') {
                    return (
                      <div
                        key={ds.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 sm:col-span-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              {ds.pin || 'V'}
                            </span>
                            <span className="font-semibold text-slate-200">{ds.name}</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-400">
                            {ds.currentValue} {ds.unit || ''}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={ds.minValue ?? 0}
                          max={ds.maxValue ?? 100}
                          value={Number(ds.currentValue) || 0}
                          onChange={(e) =>
                            updateDatastreamValue(device.id, ds.id, Number(e.target.value))
                          }
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>
                    );
                  }

                  if (ds.dataType === 'String' && ds.id.includes('color')) {
                    return (
                      <div
                        key={ds.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {ds.pin || 'V'}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">{ds.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={String(ds.currentValue)}
                            onChange={(e) => updateDatastreamValue(device.id, ds.id, e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-xs font-mono text-slate-300">
                            {String(ds.currentValue)}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DATASTREAMS */}
          {activeTab === 'datastreams' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Pin</th>
                      <th className="p-3">Stream Name</th>
                      <th className="p-3">Data Type</th>
                      <th className="p-3">Range / Unit</th>
                      <th className="p-3">Current Value</th>
                      <th className="p-3">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-mono">
                    {device.datastreams.map((ds) => (
                      <tr key={ds.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-emerald-400">{ds.pin || '—'}</td>
                        <td className="p-3 font-sans font-medium text-white">{ds.name}</td>
                        <td className="p-3 text-cyan-400">{ds.dataType}</td>
                        <td className="p-3 text-slate-400">
                          {ds.minValue !== undefined ? `${ds.minValue} ~ ${ds.maxValue}` : '—'}{' '}
                          {ds.unit || ''}
                        </td>
                        <td className="p-3 font-bold text-slate-100">
                          {String(ds.currentValue)} {ds.unit || ''}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              ds.readOnly
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {ds.readOnly ? 'READ ONLY' : 'READ/WRITE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MQTT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-slate-300">
                    Topic Filter: exploreha/{device.id}/#
                  </span>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">
                  {deviceLogs.length} Packets Captured
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5 max-h-72 overflow-y-auto">
                {deviceLogs.length === 0 ? (
                  <p className="text-slate-500 text-center py-6">
                    Waiting for telemetry messages on MQTT topic...
                  </p>
                ) : (
                  deviceLogs.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-start gap-2"
                    >
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          msg.direction === 'IN'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        {msg.direction}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-slate-400 truncate">{msg.topic}</div>
                        <div className="text-xs text-white font-medium break-all">{msg.payload}</div>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{msg.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: OTA FIRMWARE */}
          {activeTab === 'ota' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <HardDriveDownload className="w-4 h-4 text-cyan-400" />
                  <span>OTA Firmware Flashing System</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Deploy encrypted binaries over WiFi. Device will reboot automatically into new firmware.
                </p>

                {currentOTAJob ? (
                  <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                      <span>OTA Status: {currentOTAJob.status}</span>
                      <span>{currentOTAJob.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300"
                        style={{ width: `${currentOTAJob.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Flashing {currentOTAJob.targetVersion} to {device.name}... Do not unplug power.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">
                        Select Target Firmware Binary:
                      </label>
                      <select
                        value={selectedFirmwareId}
                        onChange={(e) => setSelectedFirmwareId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        {firmwareReleases.map((fw) => (
                          <option key={fw.id} value={fw.id}>
                            {fw.version} - {fw.hardwareTarget} ({fw.filename})
                          </option>
                        ))}
                      </select>
                    </div>

                    {(() => {
                      const fw = firmwareReleases.find((f) => f.id === selectedFirmwareId);
                      if (!fw) return null;
                      return (
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                          <p className="text-slate-300">
                            <span className="text-slate-500 font-mono">SHA256: </span>
                            <span className="font-mono text-[11px] text-slate-400 break-all">
                              {fw.checksumSha256}
                            </span>
                          </p>
                          <p className="text-slate-400 text-[11px] mt-1">{fw.releaseNotes}</p>
                        </div>
                      );
                    })()}

                    <button
                      onClick={() => {
                        const fw = firmwareReleases.find((f) => f.id === selectedFirmwareId);
                        if (fw) {
                          startOTAUpdate(device.id, fw.version);
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2"
                    >
                      <HardDriveDownload className="w-4 h-4" />
                      <span>Start Over-The-Air Update</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Device Authentication & Token
                </h4>
                <p className="text-xs text-slate-400">
                  Include this secret token in your ESP32 Arduino sketch via{' '}
                  <code className="text-emerald-400 font-mono">ExploreHA.begin(SSID, PASS, TOKEN)</code>.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value={device.token}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400"
                  />
                  <button
                    onClick={handleCopyToken}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition"
                  >
                    {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Danger Zone</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Deleting this device will remove it from all dashboards and revoke MQTT credentials.
                </p>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${device.name}?`)) {
                      deleteDevice(device.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Device</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
