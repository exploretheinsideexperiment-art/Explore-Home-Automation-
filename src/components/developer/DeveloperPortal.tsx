import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Cpu,
  Terminal,
  FileCode,
  BookOpen,
  Send,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';

export const DeveloperPortal: React.FC = () => {
  const { devices, showToast } = useIoT();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'firmware' | 'api' | 'webhooks'>('firmware');
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0];

  const generateArduinoSketch = () => {
    const token = selectedDevice ? selectedDevice.token : 'YOUR_DEVICE_TOKEN_HERE';
    const devName = selectedDevice ? selectedDevice.name : 'ESP32 Device';

    return `// ==========================================================
// Explore Home Automation (Explore HA) - Official Firmware SDK
// Target: ESP32 / ESP8266 / ESP32-C3 / RP2040 Pico W
// Device: ${devName}
// ==========================================================

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ExploreHA.h>

// 1. Network Configuration
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASS     = "YOUR_WIFI_PASSWORD";

// 2. Explore HA Device Token & Credentials
#define EXPLOREHA_DEVICE_TOKEN "${token}"
#define EXPLOREHA_BROKER_HOST  "mqtt.exploreha.internal"
#define EXPLOREHA_BROKER_PORT  8883

// 3. Hardware Pin Mapping
const int RELAY_PIN_1 = 23;
const int SENSOR_PIN  = 34;

ExploreHA client;

// Datastream V1 Command Callback (Relay Control)
EXPLORE_HA_WRITE(V1) {
  int value = param.asInt();
  digitalWrite(RELAY_PIN_1, value ? HIGH : LOW);
  Serial.printf("[ExploreHA] V1 Relay State Changed: %d\\n", value);
  // Send state feedback back to cloud
  ExploreHA.virtualWrite(V1, value);
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN_1, OUTPUT);
  digitalWrite(RELAY_PIN_1, LOW);

  Serial.println("\\nConnecting to Explore HA Cloud...");
  ExploreHA.begin(WIFI_SSID, WIFI_PASS, EXPLOREHA_DEVICE_TOKEN);
}

void loop() {
  ExploreHA.run();

  // Periodically sample telemetry and stream to cloud every 2000ms
  static unsigned long lastSample = 0;
  if (millis() - lastSample > 2000) {
    lastSample = millis();
    float sensorReading = analogRead(SENSOR_PIN) * (3.3 / 4095.0);
    
    // Stream to Cloud Datastream V2
    ExploreHA.virtualWrite(V2, sensorReading);
    Serial.printf("[ExploreHA] Sent V2 Telemetry: %.2f V\\n", sensorReading);
  }
}
`;
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    showToast('Source code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <span>Developer Hub & Embedded C++ SDK</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Arduino C++ code generator, REST API specification, and webhook web services.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('firmware')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'firmware'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>ESP32 Arduino C++ Sketch Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'api'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>REST API & cURL Docs</span>
        </button>

        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'webhooks'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Outbound Webhooks</span>
        </button>
      </div>

      {/* TAB 1: FIRMWARE GENERATOR */}
      {activeTab === 'firmware' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Select Target Device to Auto-Inject Auth Token:
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.metadata.hardwareVersion.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleCopyCode(generateArduinoSketch())}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/15"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Complete C++ Sketch'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
            <pre>{generateArduinoSketch()}</pre>
          </div>
        </div>
      )}

      {/* TAB 2: REST API DOCS */}
      {activeTab === 'api' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">REST API v1 Reference</h3>
              <p className="text-xs text-slate-400">
                Authenticate requests using Bearer token or <code className="text-cyan-400">X-API-Key</code> header.
              </p>
            </div>

            {/* Endpoint 1 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">
                  POST
                </span>
                <span className="font-mono text-xs text-white">/api/v1/devices/{'{id}'}/datastreams/{'{pin}'}/write</span>
              </div>
              <p className="text-xs text-slate-400">Send an immediate command write to an actuator.</p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto">
                curl -X POST https://api.exploreha.internal/v1/devices/{selectedDevice?.id || 'dev-01'}/datastreams/V1/write \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer {selectedDevice?.token || 'token'}" \<br />
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                &nbsp;&nbsp;-d '{'{"value": 1}'}'
              </div>
            </div>

            {/* Endpoint 2 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold text-[11px]">
                  GET
                </span>
                <span className="font-mono text-xs text-white">/api/v1/devices/{'{id}'}/telemetry/latest</span>
              </div>
              <p className="text-xs text-slate-400">Fetch live sensor state snapshot for all virtual pins.</p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto">
                curl -X GET https://api.exploreha.internal/v1/devices/{selectedDevice?.id || 'dev-01'}/telemetry/latest \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer {selectedDevice?.token || 'token'}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBHOOKS */}
      {activeTab === 'webhooks' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Outbound Webhook Dispatcher</h3>
          <p className="text-xs text-slate-400">
            Stream device state transitions and offline alerts to third-party endpoints like Home Assistant, Node-RED, or Discord.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Webhook Endpoint URL</label>
              <input
                type="url"
                placeholder="https://webhook.site/my-integration-endpoint"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              onClick={() => showToast('Dispatched test ping webhook packet (HTTP 200 OK)')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
            >
              Send Test Webhook Ping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
