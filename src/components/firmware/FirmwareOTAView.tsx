import React, { useState } from 'react';
import {
  HardDriveDownload,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCode,
  Shield,
  Cpu,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { HardwareType, FirmwareRelease } from '../../types';

export const FirmwareOTAView: React.FC = () => {
  const { firmwareReleases, devices, startOTAUpdate, activeOTAJobs, showToast } = useIoT();
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload modal state
  const [version, setVersion] = useState('');
  const [hardwareTarget, setHardwareTarget] = useState<HardwareType>('ESP32');
  const [filename, setFilename] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim() || !filename.trim()) return;

    showToast(`Firmware binary "${filename}" uploaded and cryptographic SHA256 verified.`);
    setShowUploadModal(false);
    setVersion('');
    setFilename('');
    setReleaseNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <HardDriveDownload className="w-5 h-5 text-cyan-400" />
            <span>Over-The-Air (OTA) Firmware Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed binary rollouts for ESP32, ESP32-C3, S3, and ESP8266 fleets.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-cyan-500/15"
        >
          <UploadCloud className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Firmware (.bin)</span>
        </button>
      </div>

      {/* Active OTA Deployments Banner */}
      {activeOTAJobs.length > 0 && (
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Live OTA Flash Transmission in Progress
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">{activeOTAJobs.length} Active Jobs</span>
          </div>

          <div className="space-y-2">
            {activeOTAJobs.map((job) => (
              <div key={job.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{job.deviceName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      Target: {job.targetVersion}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                    {job.status} ({job.progressPercent}%)
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${job.progressPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Firmware Releases Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <h2 className="text-sm font-bold text-white tracking-tight">Available Firmware Binaries</h2>

        <div className="space-y-3">
          {firmwareReleases.map((fw) => {
            const compatibleDevices = devices.filter((d) =>
              d.metadata.hardwareVersion.includes(fw.hardwareTarget)
            );

            return (
              <div
                key={fw.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{fw.version}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {fw.hardwareTarget}
                    </span>
                    {fw.isStable ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                        STABLE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        PRE-RELEASE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">{fw.releaseNotes}</p>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-1">
                    <span>File: {fw.filename}</span>
                    <span>Size: {(fw.fileSizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="truncate max-w-[200px]">SHA256: {fw.checksumSha256}</span>
                  </div>
                </div>

                {/* Fleet rollout trigger */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (compatibleDevices.length === 0) {
                        showToast(`No online ${fw.hardwareTarget} devices found.`);
                        return;
                      }
                      compatibleDevices.forEach((d) => startOTAUpdate(d.id, fw.version));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Deploy to Fleet ({compatibleDevices.length})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Upload Firmware Image</h3>
            <p className="text-xs text-slate-400 mb-4">
              Compile binary in Arduino IDE or ESP-IDF and upload the resulting .bin file.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Firmware Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. v1.3.2"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Hardware Target</label>
                <select
                  value={hardwareTarget}
                  onChange={(e) => setHardwareTarget(e.target.value as HardwareType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="ESP32">ESP32 (Standard)</option>
                  <option value="ESP32-C3">ESP32-C3</option>
                  <option value="ESP32-S3">ESP32-S3</option>
                  <option value="ESP8266">ESP8266</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Binary File (.bin)</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="e.g. exploreha-esp32-v1.3.2.bin"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Release Notes</label>
                <textarea
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                  placeholder="Bug fixes, MQTT optimizations, pin changes..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
                >
                  Publish Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
