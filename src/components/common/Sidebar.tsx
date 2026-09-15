import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  GitCommit,
  Sliders,
  Zap,
  AlertTriangle,
  BarChart3,
  HardDriveDownload,
  Home,
  Radio,
  Code2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';

export type NavTab =
  | 'dashboard'
  | 'devices'
  | 'templates'
  | 'datastreams'
  | 'builder'
  | 'automations'
  | 'events'
  | 'analytics'
  | 'firmware'
  | 'rooms'
  | 'mqtt'
  | 'developer'
  | 'admin';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse
}) => {
  const { devices, events, automations } = useIoT();

  const unackAlertsCount = events.filter((e) => !e.acknowledged).length;
  const onlineDevicesCount = devices.filter((d) => d.status === 'ONLINE').length;

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'devices',
      label: 'Devices',
      icon: Cpu,
      badge: `${onlineDevicesCount}/${devices.length}`,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'datastreams', label: 'Datastreams', icon: GitCommit },
    { id: 'builder', label: 'Dashboard Builder', icon: Sliders },
    {
      id: 'automations',
      label: 'Automations',
      icon: Zap,
      badge: automations.filter((a) => a.enabled).length,
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
    },
    {
      id: 'events',
      label: 'Events & Alerts',
      icon: AlertTriangle,
      badge: unackAlertsCount > 0 ? unackAlertsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'firmware', label: 'Firmware & OTA', icon: HardDriveDownload },
    { id: 'rooms', label: 'Rooms & Homes', icon: Home },
    { id: 'mqtt', label: 'MQTT Broker', icon: Radio, badge: 'Live', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { id: 'developer', label: 'ESP32 SDK & API', icon: Code2 },
    { id: 'admin', label: 'Admin & RBAC', icon: ShieldCheck }
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] border-r border-slate-800/80 bg-slate-900/60 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top section with navigation links */}
      <div className="p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono font-medium ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom section: Quick SDK trigger & collapse toggle */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!collapsed && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>ExploreHA ESP32 SDK</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mb-2">
              Ready-to-flash sketches for ESP32, ESP32-C3, S3 & ESP8266.
            </p>
            <button
              onClick={() => onSelectTab('developer')}
              className="text-[11px] text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View C++ Examples</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
