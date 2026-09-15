import React, { useState } from 'react';
import {
  Bell,
  Search,
  Sliders,
  Smartphone,
  Monitor,
  Columns,
  Radio,
  Wifi,
  ChevronDown,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenProvisioning: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProvisioning }) => {
  const {
    homes,
    activeHome,
    setActiveHome,
    events,
    acknowledgeEvent,
    currentUser,
    setCurrentUserRole,
    isSimulationActive,
    setIsSimulationActive,
    viewMode,
    setViewMode
  } = useIoT();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHomeMenu, setShowHomeMenu] = useState(false);

  const unackEvents = events.filter((e) => !e.acknowledged);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Brand Identity & Home Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">EXPLORE</span>
              <span className="font-bold text-emerald-400 text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">HA</span>
            </div>
            <p className="text-[10px] tracking-wider text-slate-400 font-medium uppercase hidden sm:block">
              Connect • Control • Automate
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* Home Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowHomeMenu(!showHomeMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 hover:bg-slate-800 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold">{activeHome.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showHomeMenu && (
            <div className="absolute left-0 mt-1.5 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-1.5 z-50">
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Residence
              </div>
              {homes.map((home) => (
                <button
                  key={home.id}
                  onClick={() => {
                    setActiveHome(home);
                    setShowHomeMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                    home.id === activeHome.id
                      ? 'bg-emerald-500/10 text-emerald-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span>{home.name}</span>
                  {home.id === activeHome.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Live Engine & Hardware Simulator pill */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-emerald-400 font-medium text-[11px]">MQTT TLS: 8883</span>
          </div>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setIsSimulationActive(!isSimulationActive)}
            className={`flex items-center gap-1 text-[11px] font-medium transition ${
              isSimulationActive ? 'text-cyan-400' : 'text-slate-400'
            }`}
            title="Toggle live virtual ESP32 sensor signals"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Virtual ESP32: {isSimulationActive ? 'Active' : 'Paused'}</span>
          </button>
        </div>

        {/* View Mode Switcher (Web Console vs Mobile Simulator vs Split) */}
        <div className="flex items-center bg-slate-950/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('console')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'console'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Web Console Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Web Console</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'split'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Split Mode (Web Console + Mobile Screen)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Dual View</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'mobile'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile App Experience"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Mobile App</span>
          </button>
        </div>
      </div>

      {/* Right Actions: Provisioning Button, Notifications, RBAC Role Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Onboard Device SoftAP / QR Button */}
        <button
          onClick={onOpenProvisioning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-md shadow-emerald-500/10 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Device</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center relative transition border border-slate-700/60"
          >
            <Bell className="w-4 h-4" />
            {unackEvents.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">System Events</span>
                  {unackEvents.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                      {unackEvents.length} New
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">Real-time alerts</span>
              </div>

              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto my-2">
                {events.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No events logged</p>
                ) : (
                  events.slice(0, 6).map((evt) => (
                    <div key={evt.id} className="py-2.5 px-1.5 flex items-start gap-2.5 hover:bg-slate-800/40 rounded-lg">
                      {evt.severity === 'CRITICAL' ? (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : evt.severity === 'WARNING' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-200 leading-tight">{evt.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                          {!evt.acknowledged && (
                            <button
                              onClick={() => acknowledgeEvent(evt.id)}
                              className="text-[10px] text-emerald-400 hover:underline"
                            >
                              Acknowledge
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile / RBAC switcher */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800 transition"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <Shield className="w-2.5 h-2.5" />
                <span>{currentUser.role}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50">
              <div className="pb-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {currentUser.organization}
                </span>
              </div>

              <div className="pt-2">
                <label className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">
                  Switch Active Role (RBAC Simulation):
                </label>
                <div className="grid grid-cols-1 gap-1">
                  {(['OWNER', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentUserRole(role);
                        setShowProfile(false);
                      }}
                      className={`text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                        currentUser.role === role
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{role}</span>
                      {currentUser.role === role && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
