// Explore Home Automation - Global TypeScript Definitions

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'PROVISIONING' | 'ERROR' | 'UPDATING';

export type HardwareType = 'ESP32' | 'ESP32-C3' | 'ESP32-S3' | 'ESP8266' | 'RaspberryPi-PicoW' | 'Custom';

export type DatastreamType = 'Digital' | 'Integer' | 'Float' | 'Boolean' | 'String' | 'Enum' | 'JSON';

export type EventSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';

export interface Datastream {
  id: string;
  pin?: string; // e.g. V1, V2, GPIO4
  name: string;
  dataType: DatastreamType;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  defaultValue?: any;
  currentValue: any;
  readOnly?: boolean;
  historyEnabled?: boolean;
  updateIntervalSec?: number;
}

export interface DeviceMetadata {
  macAddress: string;
  ipAddress: string;
  firmwareVersion: string;
  hardwareVersion: string;
  rssi: number; // dBm e.g. -48
  uptimeSec: number;
  freeHeapBytes: number;
  connectionType: 'WiFi-MQTT-TLS' | 'Ethernet' | 'Cellular';
  bssid?: string;
}

export interface Device {
  id: string;
  name: string;
  templateId: string;
  token: string;
  status: DeviceStatus;
  homeId: string;
  roomId: string;
  category: 'Relays' | 'Lights' | 'Climate' | 'Sensors' | 'Energy' | 'Irrigation' | 'Security';
  metadata: DeviceMetadata;
  datastreams: Datastream[];
  lastSeen: string;
  createdAt: string;
}

export interface ProductTemplate {
  id: string;
  code: string; // e.g. ESH-RELAY-8
  name: string;
  description: string;
  hardwareType: HardwareType;
  category: string;
  firmwareVersion: string;
  icon: string;
  defaultDatastreams: Omit<Datastream, 'currentValue'>[];
  defaultAutomationsCount?: number;
  tags: string[];
}

export interface Room {
  id: string;
  homeId: string;
  name: string;
  icon: string;
  deviceCount?: number;
}

export interface Home {
  id: string;
  name: string;
  address?: string;
  isDefault?: boolean;
}

export interface AutomationTrigger {
  type: 'datastream_value' | 'device_state' | 'schedule' | 'webhook';
  deviceId?: string;
  datastreamId?: string;
  operator?: '>' | '<' | '==' | '!=' | '>=' | '<=';
  threshold?: any;
  cronExpression?: string;
  time?: string;
}

export interface AutomationCondition {
  type: 'time_range' | 'device_state' | 'datastream_value';
  startTime?: string;
  endTime?: string;
  deviceId?: string;
  datastreamId?: string;
  operator?: string;
  value?: any;
}

export interface AutomationAction {
  type: 'set_datastream' | 'send_notification' | 'delay' | 'webhook' | 'mqtt_publish';
  deviceId?: string;
  datastreamId?: string;
  targetValue?: any;
  message?: string;
  severity?: EventSeverity;
  delaySec?: number;
  webhookUrl?: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  lastTriggered?: string;
  executionCount: number;
}

export interface SystemEvent {
  id: string;
  deviceId?: string;
  deviceName?: string;
  severity: EventSeverity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  category: 'telemetry' | 'connectivity' | 'ota' | 'security' | 'automation';
}

export interface FirmwareRelease {
  id: string;
  version: string;
  hardwareTarget: HardwareType;
  filename: string;
  fileSizeBytes: number;
  checksumSha256: string;
  releaseNotes: string;
  uploadedAt: string;
  isStable: boolean;
  activeDeployments: number;
}

export interface OTAJob {
  id: string;
  deviceId: string;
  deviceName: string;
  targetVersion: string;
  status: 'PENDING' | 'DOWNLOADING' | 'INSTALLING' | 'SUCCESS' | 'FAILED';
  progressPercent: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface TelemetryPoint {
  timestamp: string;
  value: number;
}

export interface MQTTMessage {
  id: string;
  topic: string;
  payload: string;
  direction: 'IN' | 'OUT';
  timestamp: string;
  qos: 0 | 1 | 2;
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organization: string;
  lastLogin: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'switch' | 'slider' | 'gauge' | 'chart' | 'led' | 'temperature' | 'humidity' | 'energy' | 'battery' | 'camera';
  deviceId: string;
  datastreamId: string;
  color?: string;
  width?: number; // 1 to 4 cols
}
