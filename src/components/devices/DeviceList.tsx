import React, { useState } from 'react';
import {
  Cpu,
  Search,
  Plus,
  Wifi,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Activity,
  Zap,
  Thermometer,
  Shield,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { Device, DeviceStatus } from '../../types';

interface DeviceListProps {
  onSelectDevice: (device: Device) => void;
  onOpenProvisioning: () => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({
  onSelectDevice,
  onOpenProvisioning
}) => {
  const { devices, rooms, updateDatastreamValue, currentUser } = useIoT();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredDevices = devices.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.metadata.ipAddress.includes(searchQuery) ||
      dev.metadata.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoom = selectedRoom === 'ALL' || dev.roomId === selectedRoom;
    const matchesStatus = selectedStatus === 'ALL' || dev.status === selectedStatus;

    return matchesSearch && matchesRoom && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>Device Inventory & Fleet</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage provisioned ESP32, ESP32-C3, ESP8266 and custom smart hardware nodes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenProvisioning}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-500/15"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Provision New Device</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by device name, IP address, MAC, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Room Filter */}
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="UPDATING">OTA Updating</option>
          </select>
        </div>
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No matching devices found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDevices.map((device) => {
            const room = rooms.find((r) => r.id === device.roomId);
            const writableSwitches = device.datastreams.filter(
              (ds) => ds.dataType === 'Boolean' && !ds.readOnly
            );

            return (
              <div
                key={device.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-md hover:border-slate-700/80 transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Status + Hardware tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          device.status === 'ONLINE'
                            ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse'
                            : device.status === 'UPDATING'
                            ? 'bg-cyan-400 animate-spin'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span className="text-[11px] font-bold font-mono tracking-wider text-slate-300 uppercase">
                        {device.status}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {device.metadata.hardwareVersion.split(' ')[0]}
                    </span>
                  </div>

                  {/* Device Name & Room */}
                  <h3
                    onClick={() => onSelectDevice(device)}
                    className="text-sm font-bold text-white hover:text-emerald-400 cursor-pointer transition truncate"
                  >
                    {device.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {room?.name || 'Unassigned'} • Firmware {device.metadata.firmwareVersion}
                  </p>

                  {/* Telemetry info row */}
                  <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Signal</span>
                      <span className="text-xs font-semibold text-emerald-400">
                        {device.metadata.rssi} dBm
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Free Heap</span>
                      <span className="text-xs font-semibold text-slate-300">
                        {Math.round(device.metadata.freeHeapBytes / 1024)} KB
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">IP</span>
                      <span className="text-xs font-semibold text-slate-400 truncate block">
                        {device.metadata.ipAddress.split('.').slice(-2).join('.')}
                      </span>
                    </div>
                  </div>

                  {/* Quick Controls preview if switches exist */}
                  {writableSwitches.length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      {writableSwitches.slice(0, 2).map((sw) => {
                        const isOn = Boolean(sw.currentValue);
                        return (
                          <div
                            key={sw.id}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60"
                          >
                            <span className="text-[11px] text-slate-300 truncate">{sw.name}</span>
                            <button
                              onClick={() => updateDatastreamValue(device.id, sw.id, !isOn)}
                              disabled={currentUser.role === 'VIEWER'}
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                isOn ? 'bg-emerald-500' : 'bg-slate-700'
                              } ${currentUser.role === 'VIEWER' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                                  isOn ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Last seen {device.lastSeen}
                  </span>
                  <button
                    onClick={() => onSelectDevice(device)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition"
                  >
                    Open Console
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
