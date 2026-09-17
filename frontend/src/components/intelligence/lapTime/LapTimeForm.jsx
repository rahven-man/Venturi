"use client";

import { useMemo, useState } from "react";

const initialForm = {
  driver: "", team: "", event_name: "", compound: "SOFT",
  lap_number: 20, stint: 2, tyre_life: 8, fresh_tyre: false,
  grid_position: 3, season: 2026,
  current_position: 3, last_lap_time: "",
  is_safety_car_active: false, is_vsc_active: false, is_restart_lap: false,
  laps_since_sc_started: 0, laps_since_vsc_started: 0, sc_deployment_count: 0,
  air_temp: 28, track_temp: 38, humidity: 45, pressure: 1012, rainfall: 0, wind_speed: 12, wind_direction: 180,
};

function SelectField({ label, value, onChange, options, disabled }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const borderColor = focused ? "#e10600" : hovered ? "#5483b3" : "rgba(193,232,255,0.2)";
  return (
    <label className="flex flex-col gap-2" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className="text-[10px] tracking-[0.18em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-12 rounded-md px-3 outline-none transition-all duration-200"
        style={{ background: "rgba(1,8,23,0.72)", border: `1px solid ${borderColor}`, boxShadow: focused ? "0 0 0 3px rgba(225,6,0,0.15)" : "none", color: "#c1e8ff", fontFamily: "var(--font-body)" }}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => <option key={o} value={o}>{o.replaceAll("_", " ")}</option>)}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange, min, max, step = 1 }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const borderColor = focused ? "#e10600" : hovered ? "#5483b3" : "rgba(193,232,255,0.2)";

  function clamp(v) {
    let n = Number(v);
    if (Number.isNaN(n)) n = 0;
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    return n;
  }

  return (
    <label className="flex flex-col gap-2" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className="text-[10px] tracking-[0.18em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>{label}</span>
      <div className="flex h-12 items-center overflow-hidden rounded-md transition-all duration-200" style={{ background: "rgba(1,8,23,0.72)", border: `1px solid ${borderColor}`, boxShadow: focused ? "0 0 0 3px rgba(225,6,0,0.15)" : "none" }}>
        <button type="button" onClick={() => onChange(clamp(Number(value || 0) - step))} className="h-full w-10 shrink-0 text-lg transition-colors duration-150 hover:bg-[rgba(225,6,0,0.18)]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>−</button>
        <input
          type="number"
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ color: "#c1e8ff", fontFamily: "var(--font-body)" }}
        />
        <button type="button" onClick={() => onChange(clamp(Number(value || 0) + step))} className="h-full w-10 shrink-0 text-lg transition-colors duration-150 hover:bg-[rgba(225,6,0,0.18)]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>+</button>
      </div>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-[rgba(193,232,255,0.05)]" style={{ background: "rgba(1,8,23,0.5)", border: "1px solid rgba(193,232,255,0.16)" }} onClick={() => onChange(!checked)}>
      <span className="text-xs tracking-[0.15em]" style={{ color: "#c1e8ff", fontFamily: "var(--font-technical)" }}>{label}</span>
      <span className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300" style={{ background: checked ? "#e10600" : "rgba(193,232,255,0.2)" }}>
        <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300" style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }} />
      </span>
    </div>
  );
}

export default function LapTimeForm({ options, onSubmit, predicting, loadingOptions }) {
  const [form, setForm] = useState(initialForm);
  const [advanced, setAdvanced] = useState(false);
  const available = options ?? { drivers: [], teams: [], events: [], compounds: [] };
  const ready = useMemo(() => form.driver && form.team && form.event_name && form.compound, [form]);
  const update = (key, value) => setForm((c) => ({ ...c, [key]: value }));

  function submit(e) {
    e.preventDefault();
    const numeric = ["lap_number", "stint", "tyre_life", "grid_position", "season", "current_position", "laps_since_sc_started", "laps_since_vsc_started", "sc_deployment_count", "air_temp", "track_temp", "humidity", "pressure", "rainfall", "wind_speed", "wind_direction"];
    const payload = { ...form };
    numeric.forEach((k) => { payload[k] = Number(payload[k] || 0); });
    payload.last_lap_time = form.last_lap_time ? Number(form.last_lap_time) : 0;
    onSubmit(payload);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-3xl rounded-2xl p-6 md:p-8" style={{ background: "rgba(2,16,36,0.56)", border: "1px solid rgba(193,232,255,0.2)", backdropFilter: "blur(6px)" }}>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-6 w-1" style={{ background: "#e10600" }} />
        <div>
          <h2 className="text-xl" style={{ color: "#ffffff", fontFamily: "var(--font-display)", fontWeight: 600 }}>RACE INPUTS</h2>
          <p className="text-xs" style={{ color: "#7da0ca", fontFamily: "var(--font-body)" }}>Set the race context to predict lap time</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Driver" value={form.driver} onChange={(v) => update("driver", v)} options={available.drivers} disabled={loadingOptions} />
        <SelectField label="Team" value={form.team} onChange={(v) => update("team", v)} options={available.teams} disabled={loadingOptions} />
        <SelectField label="Event / Circuit" value={form.event_name} onChange={(v) => update("event_name", v)} options={available.events} disabled={loadingOptions} />
        <SelectField label="Compound" value={form.compound} onChange={(v) => update("compound", v)} options={available.compounds} disabled={loadingOptions} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <NumberField label="Lap Number" value={form.lap_number} onChange={(v) => update("lap_number", v)} min={1} />
        <NumberField label="Stint" value={form.stint} onChange={(v) => update("stint", v)} min={1} />
        <NumberField label="Tyre Life" value={form.tyre_life} onChange={(v) => update("tyre_life", v)} min={0} />
        <NumberField label="Grid Position" value={form.grid_position} onChange={(v) => update("grid_position", v)} min={1} />
        <NumberField label="Season" value={form.season} onChange={(v) => update("season", v)} min={1950} />
      </div>

      <div className="mt-4">
        <Toggle label="Fresh Tyre" checked={form.fresh_tyre} onChange={(v) => update("fresh_tyre", v)} />
      </div>

      <button type="button" onClick={() => setAdvanced((v) => !v)} className="mt-6 flex w-full items-center justify-between rounded-md px-4 py-3 text-xs tracking-[0.18em] transition-colors duration-200 hover:bg-[rgba(193,232,255,0.06)]" style={{ border: "1px solid rgba(193,232,255,0.16)", color: "#7da0ca", fontFamily: "var(--font-technical)" }}>
        <span>ADVANCED CONDITIONS (OPTIONAL)</span>
        <span style={{ display: "inline-block", transform: advanced ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>▾</span>
      </button>

      {advanced && (
        <div className="mt-4 space-y-6 rounded-lg p-5" style={{ background: "rgba(1,8,23,0.4)", border: "1px solid rgba(193,232,255,0.1)" }}>
          <div>
            <p className="mb-3 text-[10px] tracking-[0.2em]" style={{ color: "#e10600", fontFamily: "var(--font-technical)" }}>RACE STATE</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Current Position" value={form.current_position} onChange={(v) => update("current_position", v)} min={1} />
              <NumberField label="Last Lap Time (s)" value={form.last_lap_time} onChange={(v) => update("last_lap_time", v)} min={0} step={0.1} />
              <NumberField label="SC Deployments" value={form.sc_deployment_count} onChange={(v) => update("sc_deployment_count", v)} min={0} />
              <NumberField label="Laps Since SC" value={form.laps_since_sc_started} onChange={(v) => update("laps_since_sc_started", v)} min={0} />
              <NumberField label="Laps Since VSC" value={form.laps_since_vsc_started} onChange={(v) => update("laps_since_vsc_started", v)} min={0} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Toggle label="Safety Car" checked={form.is_safety_car_active} onChange={(v) => update("is_safety_car_active", v)} />
              <Toggle label="VSC" checked={form.is_vsc_active} onChange={(v) => update("is_vsc_active", v)} />
              <Toggle label="Restart Lap" checked={form.is_restart_lap} onChange={(v) => update("is_restart_lap", v)} />
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] tracking-[0.2em]" style={{ color: "#e10600", fontFamily: "var(--font-technical)" }}>TRACK & WEATHER</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Air Temp (°C)" value={form.air_temp} onChange={(v) => update("air_temp", v)} />
              <NumberField label="Track Temp (°C)" value={form.track_temp} onChange={(v) => update("track_temp", v)} />
              <NumberField label="Humidity (%)" value={form.humidity} onChange={(v) => update("humidity", v)} min={0} max={100} />
              <NumberField label="Pressure (hPa)" value={form.pressure} onChange={(v) => update("pressure", v)} />
              <NumberField label="Rainfall (mm)" value={form.rainfall} onChange={(v) => update("rainfall", v)} min={0} step={0.1} />
              <NumberField label="Wind Speed (km/h)" value={form.wind_speed} onChange={(v) => update("wind_speed", v)} min={0} />
              <NumberField label="Wind Direction (°)" value={form.wind_direction} onChange={(v) => update("wind_direction", v)} min={0} max={360} />
            </div>
          </div>
        </div>
      )}

      <button disabled={!ready || predicting} className="mt-7 h-14 w-full rounded-md text-sm tracking-[0.2em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(225,6,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50" style={{ background: "#e10600", color: "#ffffff", fontFamily: "var(--font-technical)" }}>
        {predicting ? "ANALYZING..." : "PREDICT LAP TIME →"}
      </button>
    </form>
  );
}