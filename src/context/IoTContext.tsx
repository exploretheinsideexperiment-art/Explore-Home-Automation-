import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Device,
  ProductTemplate,
  Room,
  Home,
  Automation,
  SystemEvent,
  FirmwareRelease,
  OTAJob,
  MQTTMessage,
  AuditLogItem,
  UserAccount,
  UserRole,
  DashboardWidget
} from '../types';
import {
  INITIAL_HOMES,
  INITIAL_ROOMS,
  INITIAL_TEMPLATES,
  INITIAL_DEVICES,
  INITIAL_AUTOMATIONS,
  INITIAL_EVENTS,
  INITIAL_FIRMWARE,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_WIDGETS,
  GENERATE_HISTORICAL_TELEMETRY
} from '../data/initialData';

interface IoTContextType {
  homes: Home[];
  activeHome: Home;
  setActiveHome: (home: Home) => void;
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  
  devices: Device[];
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  updateDatastreamValue: (deviceId: string, datastreamId: string, value: any) => void;
  addDevice: (device: Omit<Device, 'id' | 'createdAt' | 'lastSeen'>) => Device;
  deleteDevice: (deviceId: string) => void;
  updateDeviceMetadata: (deviceId: string, metadata: Partial<Device['metadata']>) => void;
  
  templates: ProductTemplate[];
  addTemplate: (template: Omit<ProductTemplate, 'id'>) => void;
  
  automations: Automation[];
  toggleAutomation: (id: string) => void;
  addAutomation: (automation: Omit<Automation, 'id' | 'executionCount'>) => void;
  deleteAutomation: (id: string) => void;
  
  events: SystemEvent[];
  acknowledgeEvent: (id: string) => void;
  clearAllEvents: () => void;
  
  firmwareReleases: FirmwareRelease[];
  activeOTAJobs: OTAJob[];
  startOTAUpdate: (deviceId: string, targetVersion: string) => void;
  
  mqttMessages: MQTTMessage[];
  publishMQTT: (topic: string, payload: string) => void;
  clearMQTTLogs: () => void;
  
  widgets: DashboardWidget[];
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  removeWidget: (id: string) => void;
  
  users: UserAccount[];
  currentUser: UserAccount;
  setCurrentUserRole: (role: UserRole) => void;
  
  auditLogs: AuditLogItem[];
  
  // Simulator switches
  isSimulationActive: boolean;
  setIsSimulationActive: (active: boolean) => void;
  
  // View mode
  viewMode: 'console' | 'mobile' | 'split';
  setViewMode: (mode: 'console' | 'mobile' | 'split') => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export const IoTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [homes, setHomes] = useState<Home[]>(INITIAL_HOMES);
  const [activeHome, setActiveHome] = useState<Home>(INITIAL_HOMES[0]);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [templates, setTemplates] = useState<ProductTemplate[]>(INITIAL_TEMPLATES);
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);
  const [events, setEvents] = useState<SystemEvent[]>(INITIAL_EVENTS);
  const [firmwareReleases, setFirmwareReleases] = useState<FirmwareRelease[]>(INITIAL_FIRMWARE);
  const [activeOTAJobs, setActiveOTAJobs] = useState<OTAJob[]>([]);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(INITIAL_WIDGETS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'console' | 'mobile' | 'split'>('console');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MQTT Messages buffer (last 50)
  const [mqttMessages, setMqttMessages] = useState<MQTTMessage[]>([
    {
      id: 'msg-init-1',
      topic: 'exploreha/esh-esp32-living-relay/telemetry/total_current',
      payload: JSON.stringify({ val: 4.82, unit: 'A', ts: Date.now() - 3000 }),
      direction: 'IN',
      timestamp: '3s ago',
      qos: 1
    },
    {
      id: 'msg-init-2',
      topic: 'exploreha/esh-esp32-climate-01/telemetry/temperature',
      payload: JSON.stringify({ val: 24.2, unit: '°C', ts: Date.now() - 10000 }),
      direction: 'IN',
      timestamp: '10s ago',
      qos: 1
    }
  ]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  }, []);

  const addAuditLog = useCallback((action: string, target: string, status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS') => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: currentUser.email,
      action,
      target,
      ip: '192.168.1.100',
      timestamp: 'Just now',
      status
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, [currentUser.email]);

  const publishMQTT = useCallback((topic: string, payload: string) => {
    const newMsg: MQTTMessage = {
      id: `mqtt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      topic,
      payload,
      direction: 'OUT',
      timestamp: 'Just now',
      qos: 1
    };
    setMqttMessages((prev) => [newMsg, ...prev.slice(0, 99)]);
  }, []);

  const clearMQTTLogs = () => setMqttMessages([]);

  // Automation evaluator
  const evaluateAutomations = useCallback((updatedDeviceId: string, updatedDatastreamId: string, newValue: any) => {
    automations.forEach((auto) => {
      if (!auto.enabled) return;
      const { trigger } = auto;
      if (trigger.deviceId === updatedDeviceId && trigger.datastreamId === updatedDatastreamId) {
        let conditionMet = false;
        const numNew = Number(newValue);
        const numThresh = Number(trigger.threshold);

        switch (trigger.operator) {
          case '>':
            conditionMet = numNew > numThresh;
            break;
          case '<':
            conditionMet = numNew < numThresh;
            break;
          case '>=':
            conditionMet = numNew >= numThresh;
            break;
          case '<=':
            conditionMet = numNew <= numThresh;
            break;
          case '==':
            conditionMet = newValue === trigger.threshold || String(newValue) === String(trigger.threshold);
            break;
          case '!=':
            conditionMet = newValue !== trigger.threshold;
            break;
          default:
            conditionMet = false;
        }

        if (conditionMet) {
          // Execute actions
          auto.actions.forEach((action) => {
            if (action.type === 'set_datastream' && action.deviceId && action.datastreamId) {
              // Trigger action device update
              setDevices((prevDevs) =>
                prevDevs.map((d) => {
                  if (d.id === action.deviceId) {
                    return {
                      ...d,
                      datastreams: d.datastreams.map((ds) =>
                        ds.id === action.datastreamId ? { ...ds, currentValue: action.targetValue } : ds
                      )
                    };
                  }
                  return d;
                })
              );
              publishMQTT(
                `exploreha/${action.deviceId}/command/${action.datastreamId}`,
                JSON.stringify({ val: action.targetValue, source: `automation:${auto.id}` })
              );
            } else if (action.type === 'send_notification' && action.message) {
              const newEvt: SystemEvent = {
                id: `evt-${Date.now()}`,
                deviceId: updatedDeviceId,
                deviceName: auto.name,
                severity: action.severity || 'INFO',
                message: action.message,
                timestamp: 'Just now',
                acknowledged: false,
                category: 'automation'
              };
              setEvents((prev) => [newEvt, ...prev]);
              showToast(`Automation [${auto.name}]: ${action.message}`);
            }
          });

          // update lastTriggered & count
          setAutomations((prev) =>
            prev.map((a) =>
              a.id === auto.id
                ? { ...a, lastTriggered: 'Just now', executionCount: a.executionCount + 1 }
                : a
            )
          );

          addAuditLog(`AUTO RUN: ${auto.name}`, `Device ${updatedDeviceId}`);
        }
      }
    });
  }, [automations, publishMQTT, showToast, addAuditLog]);

  // Update datastream value (e.g. flipping a switch or setting a slider)
  const updateDatastreamValue = useCallback((deviceId: string, datastreamId: string, value: any) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) => {
        if (device.id !== deviceId) return device;
        const updatedDatastreams = device.datastreams.map((ds) => {
          if (ds.id === datastreamId) {
            return { ...ds, currentValue: value };
          }
          return ds;
        });
        return { ...device, datastreams: updatedDatastreams, lastSeen: 'Just now' };
      })
    );

    // Publish MQTT command
    const topic = `exploreha/${deviceId}/command/${datastreamId}`;
    const payload = JSON.stringify({ val: value, ts: Date.now() });
    publishMQTT(topic, payload);

    // Simulate device acknowledgement MQTT response
    setTimeout(() => {
      const stateTopic = `exploreha/${deviceId}/state/${datastreamId}`;
      const statePayload = JSON.stringify({ val: value, status: 'APPLIED', ts: Date.now() });
      const ackMsg: MQTTMessage = {
        id: `mqtt-${Date.now()}-${Math.random() * 100}`,
        topic: stateTopic,
        payload: statePayload,
        direction: 'IN',
        timestamp: 'Just now',
        qos: 1
      };
      setMqttMessages((prev) => [ackMsg, ...prev.slice(0, 99)]);
    }, 150);

    addAuditLog(`Set ${datastreamId} to ${JSON.stringify(value)}`, deviceId);

    // Evaluate rules
    evaluateAutomations(deviceId, datastreamId, value);
  }, [publishMQTT, addAuditLog, evaluateAutomations]);

  // Background ESP32 Telemetry Simulation loop
  useEffect(() => {
    if (!isSimulationActive) return;

    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((device) => {
          if (device.status !== 'ONLINE') return device;

          // Random slight variations for climate or power nodes
          const updatedDatastreams = device.datastreams.map((ds) => {
            if (ds.id === 'temperature') {
              const delta = (Math.random() - 0.5) * 0.2;
              const nextVal = Number((Math.max(18, Math.min(35, Number(ds.currentValue) + delta))).toFixed(1));
              return { ...ds, currentValue: nextVal };
            }
            if (ds.id === 'humidity') {
              const delta = (Math.random() - 0.5) * 0.5;
              const nextVal = Math.round(Math.max(30, Math.min(80, Number(ds.currentValue) + delta)));
              return { ...ds, currentValue: nextVal };
            }
            if (ds.id === 'total_current') {
              const delta = (Math.random() - 0.5) * 0.15;
              const nextVal = Number((Math.max(0.5, Math.min(20, Number(ds.currentValue) + delta))).toFixed(2));
              return { ...ds, currentValue: nextVal };
            }
            if (ds.id === 'active_power') {
              const delta = (Math.random() - 0.5) * 15;
              const nextVal = Math.round(Math.max(50, Math.min(2500, Number(ds.currentValue) + delta)));
              return { ...ds, currentValue: nextVal };
            }
            return ds;
          });

          // Update RSSI and free heap
          const newRssi = Math.min(-35, Math.max(-85, device.metadata.rssi + (Math.floor(Math.random() * 3) - 1)));
          const newHeap = Math.max(120000, device.metadata.freeHeapBytes + (Math.floor(Math.random() * 500) - 250));

          return {
            ...device,
            metadata: {
              ...device.metadata,
              rssi: newRssi,
              freeHeapBytes: newHeap,
              uptimeSec: device.metadata.uptimeSec + 5
            },
            datastreams: updatedDatastreams
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isSimulationActive]);

  // OTA firmware deployment simulator
  const startOTAUpdate = useCallback((deviceId: string, targetVersion: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    const jobId = `ota-${Date.now()}`;
    const newJob: OTAJob = {
      id: jobId,
      deviceId,
      deviceName: device.name,
      targetVersion,
      status: 'PENDING',
      progressPercent: 5,
      startedAt: 'Just now'
    };

    setActiveOTAJobs((prev) => [newJob, ...prev]);

    // Mark device as UPDATING
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, status: 'UPDATING' } : d))
    );

    publishMQTT(`exploreha/${deviceId}/ota`, JSON.stringify({ action: 'START', version: targetVersion }));
    showToast(`OTA dispatch sent to ${device.name}. Starting binary transmission...`);

    // Simulate progress
    let progress = 10;
    const otaTimer = setInterval(() => {
      progress += 20;
      if (progress < 90) {
        setActiveOTAJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: 'DOWNLOADING', progressPercent: progress } : j))
        );
      } else if (progress >= 90 && progress < 100) {
        setActiveOTAJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: 'INSTALLING', progressPercent: 95 } : j))
        );
      } else {
        clearInterval(otaTimer);
        setActiveOTAJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? { ...j, status: 'SUCCESS', progressPercent: 100, completedAt: 'Just now' }
              : j
          )
        );
        // Restore device to ONLINE with new firmware version
        setDevices((prev) =>
          prev.map((d) =>
            d.id === deviceId
              ? {
                  ...d,
                  status: 'ONLINE',
                  metadata: { ...d.metadata, firmwareVersion: targetVersion }
                }
              : d
          )
        );
        showToast(`OTA Firmware updated successfully on ${device.name} (${targetVersion})`);
        addAuditLog(`OTA Firmware flashed ${targetVersion}`, device.name);
      }
    }, 1200);
  }, [devices, publishMQTT, showToast, addAuditLog]);

  const addDevice = useCallback((newDevData: Omit<Device, 'id' | 'createdAt' | 'lastSeen'>) => {
    const id = `esh-dev-${Date.now().toString(36)}`;
    const newDevice: Device = {
      ...newDevData,
      id,
      createdAt: new Date().toISOString(),
      lastSeen: 'Just now'
    };
    setDevices((prev) => [...prev, newDevice]);
    showToast(`New device "${newDevice.name}" registered successfully.`);
    addAuditLog(`Provisioned Device ${newDevice.name}`, id);
    return newDevice;
  }, [showToast, addAuditLog]);

  const deleteDevice = useCallback((deviceId: string) => {
    const dev = devices.find((d) => d.id === deviceId);
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(null);
    }
    showToast(`Device removed.`);
    addAuditLog(`Deleted Device`, dev?.name || deviceId);
  }, [devices, selectedDevice, showToast, addAuditLog]);

  const updateDeviceMetadata = useCallback((deviceId: string, meta: Partial<Device['metadata']>) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId ? { ...d, metadata: { ...d.metadata, ...meta } } : d
      )
    );
  }, []);

  const addTemplate = useCallback((tplData: Omit<ProductTemplate, 'id'>) => {
    const id = `tmpl-${Date.now().toString(36)}`;
    const newTpl: ProductTemplate = { ...tplData, id };
    setTemplates((prev) => [...prev, newTpl]);
    showToast(`Hardware template "${newTpl.name}" created.`);
    addAuditLog(`Created Template ${newTpl.name}`, id);
  }, [showToast, addAuditLog]);

  const toggleAutomation = useCallback((id: string) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextState = !a.enabled;
          showToast(`Automation "${a.name}" ${nextState ? 'Enabled' : 'Paused'}.`);
          return { ...a, enabled: nextState };
        }
        return a;
      })
    );
  }, [showToast]);

  const addAutomation = useCallback((autoData: Omit<Automation, 'id' | 'executionCount'>) => {
    const id = `auto-${Date.now().toString(36)}`;
    const newAuto: Automation = { ...autoData, id, executionCount: 0 };
    setAutomations((prev) => [...prev, newAuto]);
    showToast(`Automation rule "${newAuto.name}" created.`);
    addAuditLog(`Created Automation ${newAuto.name}`, id);
  }, [showToast, addAuditLog]);

  const deleteAutomation = useCallback((id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    showToast('Automation rule removed.');
  }, [showToast]);

  const acknowledgeEvent = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, acknowledged: true } : e))
    );
  }, []);

  const clearAllEvents = useCallback(() => {
    setEvents([]);
    showToast('All system events acknowledged and cleared.');
  }, [showToast]);

  const addRoom = useCallback((roomData: Omit<Room, 'id'>) => {
    const id = `room-${Date.now().toString(36)}`;
    const newRoom: Room = { ...roomData, id, deviceCount: 0 };
    setRooms((prev) => [...prev, newRoom]);
    showToast(`Room "${newRoom.name}" added.`);
  }, [showToast]);

  const addWidget = useCallback((w: Omit<DashboardWidget, 'id'>) => {
    const newW: DashboardWidget = { ...w, id: `w-${Date.now()}` };
    setWidgets((prev) => [...prev, newW]);
    showToast('Widget added to live dashboard.');
  }, [showToast]);

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const setCurrentUserRole = useCallback((role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    showToast(`Switched active RBAC role to ${role}`);
  }, [showToast]);

  return (
    <IoTContext.Provider
      value={{
        homes,
        activeHome,
        setActiveHome,
        rooms,
        addRoom,
        devices,
        selectedDevice,
        setSelectedDevice,
        updateDatastreamValue,
        addDevice,
        deleteDevice,
        updateDeviceMetadata,
        templates,
        addTemplate,
        automations,
        toggleAutomation,
        addAutomation,
        deleteAutomation,
        events,
        acknowledgeEvent,
        clearAllEvents,
        firmwareReleases,
        activeOTAJobs,
        startOTAUpdate,
        mqttMessages,
        publishMQTT,
        clearMQTTLogs,
        widgets,
        addWidget,
        removeWidget,
        users,
        currentUser,
        setCurrentUserRole,
        auditLogs,
        isSimulationActive,
        setIsSimulationActive,
        viewMode,
        setViewMode,
        toastMessage,
        showToast
      }}
    >
      {children}
    </IoTContext.Provider>
  );
};

export const useIoT = () => {
  const context = useContext(IoTContext);
  if (!context) {
    throw new Error('useIoT must be used within an IoTProvider');
  }
  return context;
};
