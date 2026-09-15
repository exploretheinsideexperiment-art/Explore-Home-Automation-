import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Cpu,
  Sliders,
  Sparkles,
  Search,
  ExternalLink,
  Code,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { ProductTemplate, HardwareType } from '../../types';

export const TemplatesView: React.FC = () => {
  const { templates, addTemplate, devices } = useIoT();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New template form state
  const [code, setCode] = useState('ESH-CUSTOM-01');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hardwareType, setHardwareType] = useState<HardwareType>('ESP32');
  const [category, setCategory] = useState('Custom');

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.hardwareType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTemplate({
      code,
      name,
      description: description || 'Custom hardware template for connected IoT sensors.',
      hardwareType,
      category,
      firmwareVersion: 'v1.0.0',
      icon: 'Cpu',
      tags: [hardwareType, category, 'Custom'],
      defaultDatastreams: [
        { id: 'power', pin: 'V1', name: 'Main Power Switch', dataType: 'Boolean', defaultValue: false },
        { id: 'status', pin: 'V2', name: 'Telemetry Signal', dataType: 'Integer', defaultValue: 0 }
      ]
    });

    setShowAddModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Product Templates & Hardware Definitions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-configured hardware blueprints defining datastreams, firmware, and default dashboard widgets.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-500/15"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Template</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter templates by name, model code, or chipset..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => {
          const deviceCount = devices.filter((d) => d.templateId === template.id).length;

          return (
            <div
              key={template.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-emerald-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{template.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                          {template.code}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {template.hardwareType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {deviceCount} {deviceCount === 1 ? 'Device' : 'Devices'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 my-3">{template.description}</p>

                {/* Datastreams Summary */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{template.defaultDatastreams.length} Datastreams Configured</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      FW: {template.firmwareVersion}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {template.defaultDatastreams.slice(0, 6).map((ds) => (
                      <span
                        key={ds.id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {ds.pin || ds.id}
                      </span>
                    ))}
                    {template.defaultDatastreams.length > 6 && (
                      <span className="text-[10px] text-slate-500 px-1 py-0.5">
                        +{template.defaultDatastreams.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  Ready to Provision
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Template */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Create Product Template</h3>
            <p className="text-xs text-slate-400 mb-4">
              Define the hardware profile and default datastream channel mapping for a device model.
            </p>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Template Code (SKU / Model)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. ESH-MOTOR-4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Template Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Explore Quad Motor & Valve Controller"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Hardware Target</label>
                  <select
                    value={hardwareType}
                    onChange={(e) => setHardwareType(e.target.value as HardwareType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="ESP32">ESP32 (Standard)</option>
                    <option value="ESP32-C3">ESP32-C3 (RISC-V)</option>
                    <option value="ESP32-S3">ESP32-S3 (AI Core)</option>
                    <option value="ESP8266">ESP8266</option>
                    <option value="RaspberryPi-PicoW">RP2040 Pico W</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="Relays">Relays & Switches</option>
                    <option value="Lights">Lights & Dimming</option>
                    <option value="Climate">Climate & Radar</option>
                    <option value="Energy">Energy Meters</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Custom">Custom / Prototype</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe pins, recommended sensors, and use case..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
