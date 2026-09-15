import React, { useState } from 'react';
import {
  Home as HomeIcon,
  Plus,
  Cpu,
  Trash2,
  CheckCircle2,
  MapPin,
  FolderPlus
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';

export const RoomsView: React.FC = () => {
  const { homes, activeHome, setActiveHome, rooms, addRoom, devices } = useIoT();
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [roomName, setRoomName] = useState('');

  const currentRooms = rooms.filter((r) => r.homeId === activeHome.id);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    addRoom({
      homeId: activeHome.id,
      name: roomName,
      icon: 'Home'
    });

    setRoomName('');
    setShowAddRoomModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <HomeIcon className="w-5 h-5 text-emerald-400" />
            <span>Residence & Room Topologies</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize IoT devices into physical spaces, zones, and residential multi-tenancy properties.
          </p>
        </div>

        <button
          onClick={() => setShowAddRoomModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-500/15"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Residence Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {homes.map((h) => {
          const isSelected = h.id === activeHome.id;
          const homeDevices = devices.filter((d) => d.homeId === h.id);

          return (
            <div
              key={h.id}
              onClick={() => setActiveHome(h)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <HomeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{h.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{h.address || 'Smart Space'}</span>
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{homeDevices.length} Connected Devices</span>
                <span className="text-emerald-400">Manage Property →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rooms in active residence */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white tracking-tight uppercase">
          Configured Rooms in {activeHome.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentRooms.map((room) => {
            const roomDevs = devices.filter((d) => d.roomId === room.id);

            return (
              <div
                key={room.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{room.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {roomDevs.length} {roomDevs.length === 1 ? 'Device' : 'Devices'}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  {roomDevs.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic">No devices assigned yet</p>
                  ) : (
                    roomDevs.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between text-xs px-2 py-1 rounded bg-slate-950/60 border border-slate-800/80"
                      >
                        <span className="text-slate-300 truncate max-w-[140px]">{d.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400">{d.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Create Room Space</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a zone to {activeHome.name} for grouping sensors and switches.
            </p>

            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Home Cinema / Balcony"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
