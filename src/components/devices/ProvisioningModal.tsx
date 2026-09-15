import React, { useState } from 'react';
import {
  X,
  Wifi,
  Cpu,
  Layers,
  Home,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Radio,
  Lock
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { HardwareType } from '../../types';

interface ProvisioningModalProps {
  onClose: () => void;
}

export const ProvisioningModal: React.FC<ProvisioningModalProps> = ({ onClose }) => {
  const { templates, rooms, activeHome, addDevice, showToast } = useIoT();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Discovery simulation
  const [discoveredDevices] = useState([
    { ssid: 'ExploreHA-ESP32-89A4', chip: 'ESP32 (Dual Core 240MHz)', mac: '84:CC:A8:89:A4:12' },
    { ssid: 'ExploreHA-C3-F102', chip: 'ESP32-C3 RISC-V', mac: '60:55:F9:F1:02:88' },
    { ssid: 'ExploreHA-PicoW-3310', chip: 'RP2040 Pico W', mac: '28:CD:C1:33:10:44' }
  ]);
  const [selectedDiscovered, setSelectedDiscovered] = useState(discoveredDevices[0]);

  // WiFi credentials
  const [wifiSsid, setWifiSsid] = useState('MyHome-WiFi-5G');
  const [wifiPass, setWifiPass] = useState('SuperSecretPassword');

  // Device assignment
  const [deviceName, setDeviceName] = useState('Living Room Smart Controller');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');

  // Provisioning progress
  const [isFlashing, setIsFlashing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartProvisioning = () => {
    setIsFlashing(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFlashing(false);
            setStep(4);
            // Actually add device to state!
            const chosenTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
            addDevice({
              name: deviceName,
              templateId: chosenTemplate.id,
              homeId: activeHome.id,
              roomId: selectedRoomId,
              status: 'ONLINE',
              lastSeen: 'Just now',
              metadata: {
                firmwareVersion: chosenTemplate.firmwareVersion,
                hardwareVersion: chosenTemplate.hardwareType,
                ipAddress: '192.168.1.144',
                macAddress: selectedDiscovered.mac,
                freeHeapBytes: 198400,
                rssi: -58,
                uptimeSeconds: 12
              },
              datastreams: chosenTemplate.defaultDatastreams.map((ds) => ({
                ...ds,
                currentValue: ds.defaultValue
              }))
            });
            showToast(`Device "${deviceName}" successfully provisioned and connected!`);
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Device Provisioning Wizard</h2>
              <p className="text-xs text-slate-400">Step {step} of 4</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SoftAP Discovery */}
        {step === 1 && (
          <div className="py-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Select Unprovisioned Hardware Node (SoftAP)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nearby micro-controllers broadcasting their initial setup beacon.
              </p>
            </div>

            <div className="space-y-2">
              {discoveredDevices.map((dev) => {
                const isSelected = selectedDiscovered.ssid === dev.ssid;
                return (
                  <div
                    key={dev.ssid}
                    onClick={() => setSelectedDiscovered(dev)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <div>
                        <span className="text-xs font-bold text-white block">{dev.ssid}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {dev.chip} • MAC {dev.mac}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition"
              >
                <span>Continue to Wi-Fi Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Wi-Fi Credentials */}
        {step === 2 && (
          <div className="py-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Configure Local Wi-Fi Credentials
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                These credentials are sent over encrypted BLE/HTTP to allow the device to join your network.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Wi-Fi Network Name (SSID)</label>
                <div className="relative">
                  <Wifi className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Wi-Fi Security Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition"
              >
                <span>Continue to Device Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Template & Room Assignment */}
        {step === 3 && (
          <div className="py-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. Hardware Blueprint & Location
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Link the node to a product template to automatically inherit datastreams.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Device Friendly Name</label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Hardware Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code} - {t.hardwareType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Room Assignment</label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isFlashing ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono text-emerald-400">
                  <span>Establishing MQTT TLS Handshake...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  onClick={handleStartProvisioning}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/15"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Provision & Connect</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Success Completion */}
        {step === 4 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Device Successfully Provisioned!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                "{deviceName}" has received its cloud credentials, connected to the MQTT broker, and is streaming live telemetry.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/15"
            >
              Open Device Fleet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
