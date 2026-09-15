import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Users,
  Server,
  Database,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Key
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { UserRole } from '../../types';

export const AdminPanel: React.FC = () => {
  const { currentUser, switchUserRole, showToast } = useIoT();
  const [activeTab, setActiveTab] = useState<'health' | 'rbac' | 'audit'>('health');

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'OWNER', title: 'Residence Owner', desc: 'Full ownership and billing of residences and devices' },
    { role: 'ADMIN', title: 'Administrator', desc: 'Full control over devices, OTA, users, and tokens' },
    { role: 'OPERATOR', title: 'Operator', desc: 'Can toggle relays, trigger automations, and view telemetry' },
    { role: 'VIEWER', title: 'Viewer (Read-Only)', desc: 'Dashboard monitoring without control access' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Enterprise Admin & Infrastructure Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Broker health, Redis clustering, Role-Based Access Control (RBAC), and security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Current Role:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'health'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Broker & Infrastructure Health</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'rbac'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>RBAC & Permissions Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Log Trail</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">MQTT Broker Uptime</span>
              <div className="text-xl font-bold font-mono text-emerald-400">99.994%</div>
              <span className="text-[11px] text-slate-400">Continuous 42 days</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Throughput Rate</span>
              <div className="text-xl font-bold font-mono text-cyan-400">1,480 msg/s</div>
              <span className="text-[11px] text-slate-400">Sub-10ms delivery latency</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Redis Cache Hit</span>
              <div className="text-xl font-bold font-mono text-purple-400">99.2%</div>
              <span className="text-[11px] text-slate-400">Session state cached</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Database IOPS</span>
              <div className="text-xl font-bold font-mono text-amber-400">324 IOPS</div>
              <span className="text-[11px] text-slate-400">PostgreSQL Cloud SQL</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Cloud Infrastructure Cluster</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">EMQX / Mosquitto TLS</div>
                <div className="text-emerald-400 font-bold mt-1">ONLINE • Port 8883</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Redis 7 In-Memory Cluster</div>
                <div className="text-emerald-400 font-bold mt-1">HEALTHY • 2 Nodes</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Time-Series TimescaleDB</div>
                <div className="text-emerald-400 font-bold mt-1">INGESTING • 52GB</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Active User Role Simulation</h3>
              <p className="text-xs text-slate-400">
                Switch your active role instantly to test access restriction behavior in the UI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((r) => {
                const isCurrent = currentUser.role === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => {
                      switchUserRole(r.role);
                      showToast(`Switched active role to ${r.role}`);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      isCurrent
                        ? 'bg-slate-950 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">{r.title}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white">Security & Hardware Audit Trail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950 text-slate-500 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Resource Target</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 text-slate-400">Today 14:02:11</td>
                  <td className="p-3 text-white">admin@exploreha.io</td>
                  <td className="p-3 text-emerald-400">DATASTREAM_WRITE</td>
                  <td className="p-3">Living Room Main Relay / V1</td>
                  <td className="p-3 text-emerald-400">SUCCESS</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 text-slate-400">Today 13:45:00</td>
                  <td className="p-3 text-white">system.automation</td>
                  <td className="p-3 text-cyan-400">TRIGGER_FIRED</td>
                  <td className="p-3">Auto Climate Rule #1</td>
                  <td className="p-3 text-emerald-400">EXECUTED</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 text-slate-400">Today 12:10:04</td>
                  <td className="p-3 text-white">admin@exploreha.io</td>
                  <td className="p-3 text-cyan-400">OTA_FLASH_INIT</td>
                  <td className="p-3">Smart Energy Monitor / v1.4.1</td>
                  <td className="p-3 text-cyan-400">IN_PROGRESS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
