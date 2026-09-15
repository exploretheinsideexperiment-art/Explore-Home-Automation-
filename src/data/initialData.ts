import {
  Device,
  ProductTemplate,
  Room,
  Home,
  Automation,
  SystemEvent,
  FirmwareRelease,
  UserAccount,
  AuditLogItem,
  DashboardWidget
} from '../types';

export const INITIAL_HOMES: Home[] = [
  { id: 'home-1', name: 'My Smart Residence', address: '742 Evergreen Terrace', isDefault: true },
  { id: 'home-2', name: 'Summer Lake House', address: '12 Crystal Cove Blvd', isDefault: false },
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'room-living', homeId: 'home-1', name: 'Living Room', icon: 'Sofa', deviceCount: 3 },
  { id: 'room-bed', homeId: 'home-1', name: 'Master Bedroom', icon: 'Bed', deviceCount: 2 },
  { id: 'room-kitchen', homeId: 'home-1', name: 'Kitchen', icon: 'Utensils', deviceCount: 2 },
  { id: 'room-garage', homeId: 'home-1', name: 'Garage & Workshop', icon: 'Warehouse', deviceCount: 1 },
  { id: 'room-garden', homeId: 'home-1', name: 'Garden & Patio', icon: 'Flower2', deviceCount: 1 },
];

export const INITIAL_TEMPLATES: ProductTemplate[] = [
  {
    id: 'tmpl-relay8',
    code: 'ESH-RELAY-8',
    name: 'Explore Smart Relay 8CH',
    description: 'Industrial-grade 8-channel relay controller with optocoupler isolation, current telemetry, and active status LEDs.',
    hardwareType: 'ESP32',
    category: 'Relays',
    firmwareVersion: 'v1.3.0',
    icon: 'Cpu',
    tags: ['ESP32', 'Relay', 'High-Load', 'MQTT'],
    defaultDatastreams: [
      { id: 'relay_1', pin: 'V1', name: 'Channel 1 (Main Light)', dataType: 'Boolean', defaultValue: false, readOnly: false },
      { id: 'relay_2', pin: 'V2', name: 'Channel 2 (Ceiling Fan)', dataType: 'Boolean', defaultValue: false, readOnly: false },
      { id: 'relay_3', pin: 'V3', name: 'Channel 3 (AC Compressor)', dataType: 'Boolean', defaultValue: false, readOnly: false },
      { id: 'relay_4', pin: 'V4', name: 'Channel 4 (Water Heater)', dataType: 'Boolean', defaultValue: false, readOnly: false },
      { id: 'relay_5', pin: 'V5', name: 'Channel 5 (Balcony Spots)', dataType: 'Boolean', defaultValue: false, readOnly: false },
      { id: 'relay_6', pin: 'V6', name: 'Channel 6 (Exhaust Fan)', dataType: 'Boolean', defaultValue: false, readOnly: false },
      { id: 'relay_7', pin: 'V7', name: 'Channel 7 (Garden Pumps)', dataType: 'Boolean', defaultValue: false, readOnly: false },
      { id: 'relay_8', pin: 'V8', name: 'Channel 8 (Auxiliary)', dataType: 'Boolean', defaultValue: false, readOnly: false },
      { id: 'total_current', pin: 'V9', name: 'Load Current', dataType: 'Float', unit: 'A', minValue: 0, maxValue: 40, historyEnabled: true, readOnly: true },
      { id: 'board_temp', pin: 'V10', name: 'PCB Temperature', dataType: 'Float', unit: '°C', minValue: 0, maxValue: 85, historyEnabled: true, readOnly: true }
    ]
  },
  {
    id: 'tmpl-climate',
    code: 'ESH-CLIMATE-ESP32',
    name: 'Explore Climate & Air Node',
    description: 'Precision environmental monitor equipped with SHT40 sensor, TVOC air quality probe, and PIR motion radar.',
    hardwareType: 'ESP32-C3',
    category: 'Climate',
    firmwareVersion: 'v1.2.4',
    icon: 'Thermometer',
    tags: ['ESP32-C3', 'Sensors', 'BLE-Provisioning', 'Battery-Capable'],
    defaultDatastreams: [
      { id: 'temperature', pin: 'V1', name: 'Ambient Temperature', dataType: 'Float', unit: '°C', minValue: -20, maxValue: 60, defaultValue: 23.5, historyEnabled: true, readOnly: true },
      { id: 'humidity', pin: 'V2', name: 'Relative Humidity', dataType: 'Float', unit: '%', minValue: 0, maxValue: 100, defaultValue: 48, historyEnabled: true, readOnly: true },
      { id: 'air_quality', pin: 'V3', name: 'Air Quality Index (AQI)', dataType: 'Integer', unit: 'AQI', minValue: 0, maxValue: 500, defaultValue: 28, historyEnabled: true, readOnly: true },
      { id: 'motion_pir', pin: 'V4', name: 'Motion Detected', dataType: 'Boolean', defaultValue: false, readOnly: true },
      { id: 'lux_level', pin: 'V5', name: 'Ambient Light', dataType: 'Integer', unit: 'Lux', minValue: 0, maxValue: 10000, defaultValue: 420, historyEnabled: true, readOnly: true }
    ]
  },
  {
    id: 'tmpl-rgb-light',
    code: 'ESH-LIGHT-RGB',
    name: 'Explore Smart Dimmer & RGB',
    description: 'PWM dimmer with smooth fading, dynamic scene sequencing, and FastLED/NeoPixel WS2812B integration.',
    hardwareType: 'ESP32-S3',
    category: 'Lights',
    firmwareVersion: 'v1.3.0',
    icon: 'Sun',
    tags: ['ESP32-S3', 'PWM', 'Lighting', 'FastLED'],
    defaultDatastreams: [
      { id: 'power', pin: 'V1', name: 'Power Switch', dataType: 'Boolean', defaultValue: true, readOnly: false },
      { id: 'brightness', pin: 'V2', name: 'Dimmer Brightness', dataType: 'Integer', unit: '%', minValue: 0, maxValue: 100, defaultValue: 80, readOnly: false },
      { id: 'color_hex', pin: 'V3', name: 'RGB Color', dataType: 'String', defaultValue: '#38bdf8', readOnly: false },
      { id: 'preset_scene', pin: 'V4', name: 'Lighting Scene', dataType: 'Enum', defaultValue: 'WARM_WHITE', readOnly: false }
    ]
  },
  {
    id: 'tmpl-energy',
    code: 'ESH-ENERGY-PLUG',
    name: 'Explore Smart Plug 16A',
    description: 'High-power smart plug featuring BL0937/HLW8032 electricity measurement, surge protection, and auto-cutoff.',
    hardwareType: 'ESP8266',
    category: 'Energy',
    firmwareVersion: 'v1.1.8',
    icon: 'Zap',
    tags: ['ESP8266', 'Energy', 'Power-Meter'],
    defaultDatastreams: [
      { id: 'relay_state', pin: 'V1', name: 'Socket Switch', dataType: 'Boolean', defaultValue: true, readOnly: false },
      { id: 'voltage', pin: 'V2', name: 'Grid Voltage', dataType: 'Float', unit: 'V', minValue: 85, maxValue: 265, defaultValue: 230.2, readOnly: true, historyEnabled: true },
      { id: 'current', pin: 'V3', name: 'Current Draw', dataType: 'Float', unit: 'A', minValue: 0, maxValue: 16, defaultValue: 1.45, readOnly: true, historyEnabled: true },
      { id: 'active_power', pin: 'V4', name: 'Active Power', dataType: 'Float', unit: 'W', minValue: 0, maxValue: 3680, defaultValue: 334, readOnly: true, historyEnabled: true },
      { id: 'total_energy_kwh', pin: 'V5', name: 'Total Energy', dataType: 'Float', unit: 'kWh', minValue: 0, maxValue: 99999, defaultValue: 14.8, readOnly: true, historyEnabled: true }
    ]
  }
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'esh-esp32-living-relay',
    name: 'Living Room 8CH Controller',
    templateId: 'tmpl-relay8',
    token: 'eha_tok_live_79a40b92ec84',
    status: 'ONLINE',
    homeId: 'home-1',
    roomId: 'room-living',
    category: 'Relays',
    metadata: {
      macAddress: '24:6F:28:8A:4C:10',
      ipAddress: '192.168.1.142',
      firmwareVersion: 'v1.3.0',
      hardwareVersion: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      rssi: -52,
      uptimeSec: 345620,
      freeHeapBytes: 218400,
      connectionType: 'WiFi-MQTT-TLS'
    },
    lastSeen: 'Just now',
    createdAt: '2026-08-10T08:30:00Z',
    datastreams: [
      { id: 'relay_1', pin: 'V1', name: 'Main Chandelier', dataType: 'Boolean', currentValue: true, readOnly: false },
      { id: 'relay_2', pin: 'V2', name: 'Ceiling Fan', dataType: 'Boolean', currentValue: true, readOnly: false },
      { id: 'relay_3', pin: 'V3', name: 'Air Conditioner', dataType: 'Boolean', currentValue: false, readOnly: false },
      { id: 'relay_4', pin: 'V4', name: 'TV Backlight', dataType: 'Boolean', currentValue: true, readOnly: false },
      { id: 'relay_5', pin: 'V5', name: 'Reading Corner Lamp', dataType: 'Boolean', currentValue: false, readOnly: false },
      { id: 'relay_6', pin: 'V6', name: 'Air Purifier', dataType: 'Boolean', currentValue: true, readOnly: false },
      { id: 'relay_7', pin: 'V7', name: 'Balcony LED Accent', dataType: 'Boolean', currentValue: false, readOnly: false },
      { id: 'relay_8', pin: 'V8', name: 'Subwoofer Power', dataType: 'Boolean', currentValue: true, readOnly: false },
      { id: 'total_current', pin: 'V9', name: 'Current Load', dataType: 'Float', unit: 'A', currentValue: 4.82, readOnly: true, historyEnabled: true },
      { id: 'board_temp', pin: 'V10', name: 'PCB Temp', dataType: 'Float', unit: '°C', currentValue: 38.4, readOnly: true, historyEnabled: true }
    ]
  },
  {
    id: 'esh-esp32-climate-01',
    name: 'Living Room Climate & Radar',
    templateId: 'tmpl-climate',
    token: 'eha_tok_live_c1308a8f1109',
    status: 'ONLINE',
    homeId: 'home-1',
    roomId: 'room-living',
    category: 'Climate',
    metadata: {
      macAddress: '30:AE:A4:07:3E:9B',
      ipAddress: '192.168.1.145',
      firmwareVersion: 'v1.2.4',
      hardwareVersion: 'ESP32-C3 RISC-V 160MHz',
      rssi: -47,
      uptimeSec: 182400,
      freeHeapBytes: 189200,
      connectionType: 'WiFi-MQTT-TLS'
    },
    lastSeen: '12s ago',
    createdAt: '2026-08-14T11:20:00Z',
    datastreams: [
      { id: 'temperature', pin: 'V1', name: 'Ambient Temperature', dataType: 'Float', unit: '°C', currentValue: 24.2, readOnly: true, historyEnabled: true },
      { id: 'humidity', pin: 'V2', name: 'Relative Humidity', dataType: 'Float', unit: '%', currentValue: 49.5, readOnly: true, historyEnabled: true },
      { id: 'air_quality', pin: 'V3', name: 'Air Quality (AQI)', dataType: 'Integer', unit: 'AQI', currentValue: 24, readOnly: true, historyEnabled: true },
      { id: 'motion_pir', pin: 'V4', name: 'Human Presence', dataType: 'Boolean', currentValue: true, readOnly: true },
      { id: 'lux_level', pin: 'V5', name: 'Light Level', dataType: 'Integer', unit: 'Lux', currentValue: 540, readOnly: true, historyEnabled: true }
    ]
  },
  {
    id: 'esh-light-s3-bed',
    name: 'Master Bed Ambient Strip',
    templateId: 'tmpl-rgb-light',
    token: 'eha_tok_live_8f0a256d013e',
    status: 'ONLINE',
    homeId: 'home-1',
    roomId: 'room-bed',
    category: 'Lights',
    metadata: {
      macAddress: 'F4:12:FA:73:99:1C',
      ipAddress: '192.168.1.150',
      firmwareVersion: 'v1.3.0',
      hardwareVersion: 'ESP32-S3 Dual AI Core',
      rssi: -61,
      uptimeSec: 92400,
      freeHeapBytes: 312000,
      connectionType: 'WiFi-MQTT-TLS'
    },
    lastSeen: 'Just now',
    createdAt: '2026-08-20T14:15:00Z',
    datastreams: [
      { id: 'power', pin: 'V1', name: 'Power Switch', dataType: 'Boolean', currentValue: true, readOnly: false },
      { id: 'brightness', pin: 'V2', name: 'Brightness', dataType: 'Integer', unit: '%', currentValue: 65, readOnly: false },
      { id: 'color_hex', pin: 'V3', name: 'Color Hex', dataType: 'String', currentValue: '#f59e0b', readOnly: false },
      { id: 'preset_scene', pin: 'V4', name: 'Preset Scene', dataType: 'Enum', currentValue: 'COZY_SUNSET', readOnly: false }
    ]
  },
  {
    id: 'esh-plug-kitchen',
    name: 'Espresso Machine Smart Plug',
    templateId: 'tmpl-energy',
    token: 'eha_tok_live_14b9c8e42211',
    status: 'ONLINE',
    homeId: 'home-1',
    roomId: 'room-kitchen',
    category: 'Energy',
    metadata: {
      macAddress: '5C:CF:7F:1B:6D:88',
      ipAddress: '192.168.1.156',
      firmwareVersion: 'v1.1.8',
      hardwareVersion: 'ESP8266 Tensilica L106',
      rssi: -68,
      uptimeSec: 610000,
      freeHeapBytes: 38400,
      connectionType: 'WiFi-MQTT-TLS'
    },
    lastSeen: '3s ago',
    createdAt: '2026-08-01T09:00:00Z',
    datastreams: [
      { id: 'relay_state', pin: 'V1', name: 'Plug Relay', dataType: 'Boolean', currentValue: true, readOnly: false },
      { id: 'voltage', pin: 'V2', name: 'Mains Voltage', dataType: 'Float', unit: 'V', currentValue: 231.4, readOnly: true, historyEnabled: true },
      { id: 'current', pin: 'V3', name: 'Current', dataType: 'Float', unit: 'A', currentValue: 4.15, readOnly: true, historyEnabled: true },
      { id: 'active_power', pin: 'V4', name: 'Power Consumption', dataType: 'Float', unit: 'W', currentValue: 960, readOnly: true, historyEnabled: true },
      { id: 'total_energy_kwh', pin: 'V5', name: 'Accumulated kWh', dataType: 'Float', unit: 'kWh', currentValue: 24.3, readOnly: true, historyEnabled: true }
    ]
  },
  {
    id: 'esh-garage-door-node',
    name: 'Garage Door & Safety Radar',
    templateId: 'tmpl-relay8',
    token: 'eha_tok_live_90ab33ef1994',
    status: 'ONLINE',
    homeId: 'home-1',
    roomId: 'room-garage',
    category: 'Security',
    metadata: {
      macAddress: '24:6F:28:90:3A:42',
      ipAddress: '192.168.1.160',
      firmwareVersion: 'v1.2.0',
      hardwareVersion: 'ESP32-WROOM-32',
      rssi: -72,
      uptimeSec: 42000,
      freeHeapBytes: 204000,
      connectionType: 'WiFi-MQTT-TLS'
    },
    lastSeen: '25s ago',
    createdAt: '2026-08-25T16:00:00Z',
    datastreams: [
      { id: 'relay_1', pin: 'V1', name: 'Motor Trigger', dataType: 'Boolean', currentValue: false, readOnly: false },
      { id: 'relay_2', pin: 'V2', name: 'Flood Lights', dataType: 'Boolean', currentValue: false, readOnly: false },
      { id: 'relay_3', pin: 'V3', name: 'Lock Bolt', dataType: 'Boolean', currentValue: true, readOnly: false }
    ]
  }
];

export const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: 'auto-1',
    name: 'Smart Cooling on High Temperature',
    description: 'When living room temperature exceeds 28°C and someone is home, turn ON Ceiling Fan and notify user.',
    enabled: true,
    trigger: {
      type: 'datastream_value',
      deviceId: 'esh-esp32-climate-01',
      datastreamId: 'temperature',
      operator: '>',
      threshold: 28
    },
    conditions: [
      {
        type: 'time_range',
        startTime: '08:00',
        endTime: '22:00'
      }
    ],
    actions: [
      {
        type: 'set_datastream',
        deviceId: 'esh-esp32-living-relay',
        datastreamId: 'relay_2',
        targetValue: true
      },
      {
        type: 'send_notification',
        message: 'Living Room Fan turned ON automatically (Temperature > 28°C)',
        severity: 'INFO'
      }
    ],
    lastTriggered: 'Yesterday at 15:42',
    executionCount: 14
  },
  {
    id: 'auto-2',
    name: 'Night Motion Security Alert',
    description: 'If motion detected in living room between 00:00 and 05:00, turn on security spotlight & trigger warning event.',
    enabled: true,
    trigger: {
      type: 'datastream_value',
      deviceId: 'esh-esp32-climate-01',
      datastreamId: 'motion_pir',
      operator: '==',
      threshold: true
    },
    conditions: [
      {
        type: 'time_range',
        startTime: '00:00',
        endTime: '05:30'
      }
    ],
    actions: [
      {
        type: 'send_notification',
        message: 'Security Alert: Motion detected after midnight in Living Room',
        severity: 'WARNING'
      }
    ],
    lastTriggered: '3 days ago',
    executionCount: 2
  },
  {
    id: 'auto-3',
    name: 'Energy Overload Safeguard',
    description: 'Instantly cut off auxiliary circuits if main panel current exceeds 25 Amps.',
    enabled: true,
    trigger: {
      type: 'datastream_value',
      deviceId: 'esh-esp32-living-relay',
      datastreamId: 'total_current',
      operator: '>',
      threshold: 25.0
    },
    conditions: [],
    actions: [
      {
        type: 'set_datastream',
        deviceId: 'esh-esp32-living-relay',
        datastreamId: 'relay_4',
        targetValue: false
      },
      {
        type: 'send_notification',
        message: 'CRITICAL: High load cut-off executed to protect electrical wiring!',
        severity: 'CRITICAL'
      }
    ],
    lastTriggered: 'Never',
    executionCount: 0
  }
];

export const INITIAL_EVENTS: SystemEvent[] = [
  {
    id: 'evt-1',
    deviceId: 'esh-esp32-living-relay',
    deviceName: 'Living Room 8CH Controller',
    severity: 'INFO',
    message: 'Device connected to MQTT Broker over TLS (1.3) successfully.',
    timestamp: '10 minutes ago',
    acknowledged: true,
    category: 'connectivity'
  },
  {
    id: 'evt-2',
    deviceId: 'esh-esp32-climate-01',
    deviceName: 'Living Room Climate Node',
    severity: 'WARNING',
    message: 'Ambient temperature reached 27.8°C (threshold: 28.0°C).',
    timestamp: '2 hours ago',
    acknowledged: false,
    category: 'telemetry'
  },
  {
    id: 'evt-3',
    deviceId: 'esh-plug-kitchen',
    deviceName: 'Espresso Machine Smart Plug',
    severity: 'INFO',
    message: 'Peak power surge 1250W handled normally.',
    timestamp: '4 hours ago',
    acknowledged: true,
    category: 'telemetry'
  },
  {
    id: 'evt-4',
    deviceId: 'esh-garage-door-node',
    deviceName: 'Garage Door & Safety Radar',
    severity: 'INFO',
    message: 'WiFi signal level -72 dBm (Moderate connection).',
    timestamp: 'Yesterday',
    acknowledged: true,
    category: 'connectivity'
  }
];

export const INITIAL_FIRMWARE: FirmwareRelease[] = [
  {
    id: 'fw-130',
    version: 'v1.3.0',
    hardwareTarget: 'ESP32',
    filename: 'exploreha-esp32-v1.3.0-prod.bin',
    fileSizeBytes: 1492992,
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    releaseNotes: 'Optimized MQTT TLS handshake latency, improved softAP DNS capture, and added fast relay debounce protection.',
    uploadedAt: '2026-09-01',
    isStable: true,
    activeDeployments: 4
  },
  {
    id: 'fw-124',
    version: 'v1.2.4',
    hardwareTarget: 'ESP32-C3',
    filename: 'exploreha-c3-riscv-v1.2.4.bin',
    fileSizeBytes: 1184000,
    checksumSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    releaseNotes: 'Enhanced deep-sleep power consumption for battery-powered environmental radar nodes.',
    uploadedAt: '2026-08-15',
    isStable: true,
    activeDeployments: 1
  },
  {
    id: 'fw-140-rc',
    version: 'v1.4.0-rc1',
    hardwareTarget: 'ESP32',
    filename: 'exploreha-esp32-v1.4.0-rc1.bin',
    fileSizeBytes: 1542100,
    checksumSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    releaseNotes: 'Experimental Matter-over-Thread bridging support and mDNS local fallback control.',
    uploadedAt: '2026-09-10',
    isStable: false,
    activeDeployments: 0
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Chief IoT Architect (You)',
    email: 'admin@exploreha.io',
    role: 'OWNER',
    organization: 'Explore Automation Labs',
    lastLogin: 'Active now',
    status: 'ACTIVE'
  },
  {
    id: 'usr-2',
    name: 'DevOps & Firmware Lead',
    email: 'firmware@exploreha.io',
    role: 'ADMIN',
    organization: 'Explore Automation Labs',
    lastLogin: '1 hour ago',
    status: 'ACTIVE'
  },
  {
    id: 'usr-3',
    name: 'Smart Home Operator',
    email: 'operator@exploreha.io',
    role: 'OPERATOR',
    organization: 'Explore Automation Labs',
    lastLogin: 'Yesterday',
    status: 'ACTIVE'
  },
  {
    id: 'usr-4',
    name: 'Guest / Family Viewer',
    email: 'guest@exploreha.io',
    role: 'VIEWER',
    organization: 'Explore Automation Labs',
    lastLogin: '3 days ago',
    status: 'ACTIVE'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    user: 'admin@exploreha.io',
    action: 'CONTROL: Toggle Relay 1 (Main Chandelier)',
    target: 'Living Room 8CH Controller',
    ip: '192.168.1.100',
    timestamp: '2 mins ago',
    status: 'SUCCESS'
  },
  {
    id: 'aud-2',
    user: 'SYSTEM: Automation Engine',
    action: 'AUTO: Turn ON Ceiling Fan (Temp > 28°C)',
    target: 'Ceiling Fan (V2)',
    ip: '127.0.0.1',
    timestamp: '18 mins ago',
    status: 'SUCCESS'
  },
  {
    id: 'aud-3',
    user: 'admin@exploreha.io',
    action: 'OTA: Firmware Rollout scheduled v1.3.0',
    target: '4 Devices',
    ip: '192.168.1.100',
    timestamp: '2 hours ago',
    status: 'SUCCESS'
  },
  {
    id: 'aud-4',
    user: 'operator@exploreha.io',
    action: 'CONFIG: Datastream Threshold Updated',
    target: 'Air Quality (AQI)',
    ip: '192.168.1.108',
    timestamp: '5 hours ago',
    status: 'SUCCESS'
  }
];

export const INITIAL_WIDGETS: DashboardWidget[] = [
  { id: 'w-1', title: 'Main Chandelier', type: 'switch', deviceId: 'esh-esp32-living-relay', datastreamId: 'relay_1', color: '#10b981', width: 1 },
  { id: 'w-2', title: 'Ceiling Fan', type: 'switch', deviceId: 'esh-esp32-living-relay', datastreamId: 'relay_2', color: '#3b82f6', width: 1 },
  { id: 'w-3', title: 'TV Backlight', type: 'switch', deviceId: 'esh-esp32-living-relay', datastreamId: 'relay_4', color: '#8b5cf6', width: 1 },
  { id: 'w-4', title: 'Air Purifier', type: 'switch', deviceId: 'esh-esp32-living-relay', datastreamId: 'relay_6', color: '#06b6d4', width: 1 },
  { id: 'w-5', title: 'Room Temperature', type: 'temperature', deviceId: 'esh-esp32-climate-01', datastreamId: 'temperature', width: 2 },
  { id: 'w-6', title: 'Humidity Level', type: 'humidity', deviceId: 'esh-esp32-climate-01', datastreamId: 'humidity', width: 2 },
  { id: 'w-7', title: 'Total Current Load', type: 'gauge', deviceId: 'esh-esp32-living-relay', datastreamId: 'total_current', width: 2 },
  { id: 'w-8', title: 'Master Bed Dimmer', type: 'slider', deviceId: 'esh-light-s3-bed', datastreamId: 'brightness', color: '#f59e0b', width: 2 },
  { id: 'w-9', title: 'Espresso Machine Power', type: 'energy', deviceId: 'esh-plug-kitchen', datastreamId: 'active_power', width: 2 },
  { id: 'w-10', title: 'PCB Temp & Health', type: 'chart', deviceId: 'esh-esp32-living-relay', datastreamId: 'board_temp', width: 4 }
];

export const GENERATE_HISTORICAL_TELEMETRY = () => {
  const points = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now - i * 3600 * 1000);
    const hour = time.getHours();
    // Realistic temperature curve peaking in afternoon
    const baseTemp = 21 + Math.sin((hour - 8) / 24 * Math.PI * 2) * 5;
    const temp = Number((baseTemp + (Math.random() * 0.8 - 0.4)).toFixed(1));
    const humidity = Number((55 - (baseTemp - 20) * 1.5 + (Math.random() * 2 - 1)).toFixed(1));
    const power = Number((300 + (hour >= 18 && hour <= 23 ? 950 : hour >= 7 && hour <= 9 ? 600 : 120) + Math.random() * 80).toFixed(0));
    const current = Number((power / 230).toFixed(2));

    points.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      temperature: temp,
      humidity: humidity,
      power: power,
      current: current
    });
  }
  return points;
};
