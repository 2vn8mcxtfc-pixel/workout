import { useState, useEffect, useRef } from "react";

const DEFAULT_DAYS = [
  {
    id: "WED", title: "Push I", sub: "Chest · Shoulders", accent: "#e8f44d",
    tracker: [{ label: "Chest", today: 6, total: 12 }, { label: "Shoulders", today: 4, total: 12 }],
    exercises: [
      { name: "Wide Push-Ups", tag: "Chest", sets: "3", reps: "15", load: "Bodyweight", mmc: "Imagine pushing the floor apart sideways — feel the outer pec stretch at bottom, squeeze hard at top.", fail: true, c: "#e8f44d" },
      { name: "Feet-Elevated Push-Ups", tag: "Upper Chest", sets: "3", reps: "15", load: "Bodyweight", mmc: "Upper chest fires here. Feel the clavicular pec — squeeze both sides together at the top.", fail: true, c: "#e8f44d" },
      { name: "Dips — Chest Lean", tag: "Chest + Triceps", sets: "3", reps: "15", load: "Bodyweight", mmc: "Lean forward 20°. Let the pec fully stretch at the bottom. Today is chest, not triceps.", fail: true, c: "#e8f44d" },
      { name: "Pike Push-Ups", tag: "Shoulders", sets: "3", reps: "15", load: "Bodyweight", mmc: "Hips high, press the floor away with your SHOULDERS. Front delt does the work, not triceps.", fail: true, c: "#e8f44d" },
      { name: "DB Lateral Raises", tag: "Side Delt", sets: "2", reps: "15", load: "Light — 3 sec lowering", mmc: "Lead with elbows, not wrists. Feel the SIDE delt. Slow on the way down — that's where growth is.", fail: true, c: "#4db8f4" },
      { name: "Plank", tag: "Abs", sets: "3", reps: "30–45 sec", load: "Bodyweight", mmc: "Brace like you're about to get punched. Don't forget to breathe.", fail: false, c: "#f44d7b" },
    ],
    tip: "Chest is the priority. Squeeze your pec consciously before each set — 5 sec activation. Strong MMC means you need fewer sets to hit the stimulus.",
  },
  {
    id: "THU", title: "Lower I", sub: "Quads · Glutes · Hips", accent: "#4df4a0",
    tracker: [{ label: "Quads", today: 6, total: 11 }, { label: "Glutes", today: 6, total: 12 }, { label: "Hip Abductors", today: 5, total: 10 }, { label: "Hamstrings", today: 3, total: 10 }],
    exercises: [
      { name: "Goblet Squat", tag: "Quads + Glutes", sets: "4", reps: "15", load: "Dumbbell/KB — 30–50% BW", mmc: "Push knees OUT, sit INTO the stretch. Feel quads loading on the way down — control the descent.", fail: true, c: "#4db8f4" },
      { name: "Walking Lunges", tag: "Quads + Glutes", sets: "3", reps: "15 each leg", load: "Bodyweight or light DBs", mmc: "Drive through the HEEL of the front foot — that's your glute. If you only feel quad, shift your weight back.", fail: true, c: "#4db8f4" },
      { name: "Hip Thrusts", tag: "Glutes", sets: "3", reps: "15", load: "Bodyweight → add plate/barbell", mmc: "SQUEEZE glutes hard at the top and hold 1 full second. If you don't feel it, you're not squeezing hard enough.", fail: true, c: "#4db8f4" },
      { name: "Lateral Band Walks", tag: "Hip Abductors", sets: "3", reps: "15 steps each way", load: "Light–medium band", mmc: "Feel the SIDE of your glute (glute medius) burning. This directly fixes waddling — don't rush it.", fail: true, c: "#4db8f4" },
      { name: "Clamshells", tag: "Hip Abductors", sets: "2", reps: "15 each side", load: "Bodyweight → add band", mmc: "ONLY the hip rotates — pelvis stays still. Tiny perfect range of motion beats big sloppy reps.", fail: true, c: "#4db8f4" },
      { name: "Dead Bug", tag: "Abs", sets: "3", reps: "10 each side", load: "Bodyweight", mmc: "Lower back pressed into the floor the ENTIRE time. Extend opposite arm/leg without losing contact.", fail: false, c: "#f44d7b" },
    ],
    tip: "Lateral band walks + clamshells are the most important exercises in this whole plan for fixing your gait. Glute medius weakness = waddling. Don't skip or rush them.",
  },
  {
    id: "FRI", title: "Pull + Traps", sub: "Back · Traps · Abs", accent: "#4db8f4",
    tracker: [{ label: "Traps", today: 5, total: 10 }],
    exercises: [
      { name: "Pull-Ups (Slow)", tag: "Back + Biceps", sets: "5", reps: "3 slow", load: "Bodyweight — 3 sec up, 3 sec down", mmc: "Pull your ELBOWS down toward your hips — not your hands up. The lat is the engine, not your arms.", fail: true, c: "#e8f44d" },
      { name: "Inverted Rows", tag: "Mid-Back + Rear Delts", sets: "4", reps: "15", load: "Bodyweight (elevate feet to progress)", mmc: "Squeeze shoulder blades together, hold 1 sec at top. Feel mid-back contracting — not just arms.", fail: true, c: "#e8f44d" },
      { name: "DB Shrugs", tag: "Traps", sets: "3", reps: "15", load: "30–50% estimated 1RM", mmc: "Straight UP only — no rolling. Hold top for 1 full second. Feel upper traps, not neck tension.", fail: true, c: "#4db8f4" },
      { name: "Band Pull-Aparts", tag: "Traps + Rear Delts", sets: "2", reps: "15", load: "Light resistance band", mmc: "Pull to chest height, all the way apart. Feel mid-traps and rear delts — not your biceps.", fail: true, c: "#4db8f4" },
      { name: "Hollow Body Hold", tag: "Abs", sets: "3", reps: "20–30 sec", load: "Bodyweight", mmc: "Ribs DOWN. Lower back flat. Full-body tension — harder than it looks when done right.", fail: false, c: "#f44d7b" },
      { name: "Hanging Leg Raises", tag: "Abs (lower)", sets: "3", reps: "15", load: "Bodyweight — use pull-up bar", mmc: "Tilt pelvis backward at the top to fully crunch the lower abs. Zero swinging.", fail: true, c: "#f44d7b" },
    ],
    tip: "Pull-ups: 5 sets × 3 perfect reps = 15 high-quality reps. Never sacrifice form for quantity. Track these weekly — they'll double in 6–8 weeks.",
  },
  {
    id: "SAT", title: "Push II", sub: "Chest · Shoulders · Dips", accent: "#f4944d",
    tracker: [{ label: "Chest", today: 6, total: 12, done: true }, { label: "Shoulders", today: 4, total: 12 }],
    exercises: [
      { name: "Dips — Main Event", tag: "Chest + Triceps", sets: "4", reps: "15", load: "Bodyweight → add weight when 15 feels easy", mmc: "Lean forward for chest. Full stretch at the bottom — don't cut depth. Squeeze pec hard at top.", fail: true, c: "#e8f44d" },
      { name: "Diamond Push-Ups", tag: "Inner Chest + Triceps", sets: "3", reps: "15", load: "Bodyweight", mmc: "Hands close together. Feel inner chest and triceps — squeeze hard at the top of each rep.", fail: true, c: "#e8f44d" },
      { name: "DB Overhead Press", tag: "Shoulders", sets: "3", reps: "15", load: "30–50% estimated 1RM", mmc: "Feel all three delt heads working. Don't let traps take over by shrugging up — keep them relaxed.", fail: true, c: "#4db8f4" },
      { name: "DB Lateral Raises", tag: "Side Delt", sets: "2", reps: "15", load: "Light — no momentum", mmc: "Lead with elbows. Feel the SIDE delt — not your upper trap. Slow and controlled.", fail: true, c: "#4db8f4" },
      { name: "Prone Y-T Raises", tag: "Traps + Rear Delts", sets: "3", reps: "15", load: "No weight → 2.5–5 lb plates", mmc: "Lie face down. Squeeze shoulder blades together. Feel mid and lower traps — not your neck.", fail: true, c: "#e8f44d" },
      { name: "Plank Shoulder Taps", tag: "Abs", sets: "3", reps: "20 taps", load: "Bodyweight", mmc: "Hips completely still — fight the rotation. That's your core working.", fail: false, c: "#f44d7b" },
    ],
    tip: "Chest weekly target DONE after today (12 sets). Dips are your signature — add a small weight the moment 15 clean reps feels easy.",
  },
  {
    id: "MON", title: "Lower II", sub: "Hamstrings · Glutes · Hips", accent: "#d44df4",
    tracker: [{ label: "Quads", today: 5, total: 11, done: true }, { label: "Glutes", today: 6, total: 12, done: true }, { label: "Hip Abductors", today: 5, total: 10, done: true }, { label: "Hamstrings", today: 7, total: 10, done: true }],
    exercises: [
      { name: "Bulgarian Split Squats", tag: "Quads + Glutes + Hamstrings", sets: "4", reps: "15 each leg", load: "Bodyweight → hold DBs", mmc: "Stay upright for quad bias, lean slightly forward for more glute. Front leg does ALL the work.", fail: true, c: "#4db8f4" },
      { name: "Romanian Deadlift (DB)", tag: "Hamstrings + Glutes", sets: "4", reps: "15", load: "40–60% estimated 1RM", mmc: "Hinge at hips — FEEL the hamstring lengthening. Stop when you feel the stretch, not when your back rounds.", fail: true, c: "#4db8f4" },
      { name: "Hip Thrusts", tag: "Glutes", sets: "3", reps: "15", load: "Heavier than Thursday", mmc: "Full hip extension, hard glute squeeze, 1-second hold at top. Load this progressively every week.", fail: true, c: "#4db8f4" },
      { name: "Fire Hydrants", tag: "Hip Abductors", sets: "3", reps: "15 each side", load: "Bodyweight → add ankle weight", mmc: "Only the hip moves — torso stays perfectly still. Feel glute medius contracting on the side.", fail: true, c: "#4db8f4" },
      { name: "Donkey Kicks", tag: "Hip Abductors + Glutes", sets: "2", reps: "15 each side", load: "Bodyweight → ankle weight", mmc: "Squeeze the glute hard at the top of each kick. Don't rotate your hip — pure extension.", fail: true, c: "#4db8f4" },
      { name: "Bicycle Crunches", tag: "Abs", sets: "3", reps: "20 each side", load: "Bodyweight", mmc: "SLOW — feel the oblique and rectus abdominis on every rep. No momentum, no neck strain.", fail: true, c: "#f44d7b" },
    ],
    tip: "All lower body weekly targets complete after today. Bulgarian split squats — start light until you master the balance. The instability is part of the training stimulus.",
  },
  {
    id: "TUE", title: "Shoulders + Traps + Arms", sub: "Shoulders · Traps · Dips · Abs", accent: "#f44d7b",
    tracker: [{ label: "Shoulders", today: 4, total: 12, done: true }, { label: "Traps", today: 5, total: 10, done: true }],
    exercises: [
      { name: "DB Overhead Press", tag: "Shoulders", sets: "3", reps: "15", load: "Same or slightly heavier than Saturday", mmc: "Full lockout at the top. Feel all three delt heads. Keep traps relaxed — don't shrug the weight up.", fail: true, c: "#4db8f4" },
      { name: "Pike Push-Ups", tag: "Shoulders", sets: "2", reps: "15", load: "Bodyweight", mmc: "Calisthenics shoulder volume. Front delts pressing — control the descent fully.", fail: true, c: "#e8f44d" },
      { name: "DB Lateral Raises", tag: "Side Delt", sets: "2", reps: "15", load: "Light — 3-sec lowering", mmc: "The eccentric (lowering) phase is where the growth is. 3 seconds down, every single rep.", fail: true, c: "#4db8f4" },
      { name: "Heavy DB Shrugs", tag: "Traps", sets: "4", reps: "15", load: "Heaviest of the week", mmc: "Straight up, 1 full second squeeze at top, slow descent. Build trap thickness over time.", fail: true, c: "#4db8f4" },
      { name: "Band Pull-Aparts", tag: "Traps + Rear Delts", sets: "2", reps: "15", load: "Light band", mmc: "All the way apart. Feel mid-traps and rear delts contracting. Don't let arms do the work.", fail: true, c: "#4db8f4" },
      { name: "Dips — Upright", tag: "Triceps", sets: "3", reps: "15", load: "Bodyweight", mmc: "Stay UPRIGHT today — tricep version. Feel the long head of the tricep fully stretch at the bottom.", fail: true, c: "#e8f44d" },
      { name: "DB Curls", tag: "Biceps", sets: "2", reps: "15", load: "Light — full ROM", mmc: "Squeeze the peak hard. 3-second eccentric. Feel the bicep — don't swing.", fail: true, c: "#4db8f4" },
    ],
    tip: "All weekly targets complete. Shoulders and traps both hit 10–12 sets this week. Push the shoulder weight hard — this is your heaviest shoulder session.",
  },
];

function Field({ value, onChange, style, multiline, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef(null);

  useEffect(() => { setVal(value); }, [value]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const commit = () => { setEditing(false); if (val !== value) onChange(val); };

  if (!editing) {
    return (
      <span onClick={e => { e.stopPropagation(); setEditing(true); }}
        style={{ cursor: "text", borderBottom: "1px dashed #2a2a2a", ...style }}
        title="Tap to edit">
        {val || <span style={{ color: "#333" }}>{placeholder}</span>}
      </span>
    );
  }

  const inputStyle = {
    background: "#1a1a1a", border: "1px solid #444", color: "#eee",
    padding: "2px 4px", borderRadius: "2px", fontFamily: "inherit",
    fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit",
    width: multiline ? "100%" : "auto", ...style,
  };

  return multiline
    ? <textarea ref={ref} value={val} rows={2}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        onClick={e => e.stopPropagation()}
        style={{ ...inputStyle, resize: "vertical", display: "block" }} />
    : <input ref={ref} value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => e.key === "Enter" && commit()}
        onClick={e => e.stopPropagation()}
        style={inputStyle} />;
}

export default function WorkoutPlan() {
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [dayIdx, setDayIdx] = useState(0);
  const [openEx, setOpenEx] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("workout-days");
      if (stored) setDays(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (newDays) => {
    try {
      localStorage.setItem("workout-days", JSON.stringify(newDays));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {}
  };

  const updateDays = (newDays) => { setDays(newDays); save(newDays); };

  const updateExercise = (di, ei, field, val) => {
    const d = days.map((day, i) => i !== di ? day : {
      ...day,
      exercises: day.exercises.map((ex, j) => j !== ei ? ex : { ...ex, [field]: val })
    });
    updateDays(d);
  };

  const updateDay = (di, field, val) => {
    const d = days.map((day, i) => i !== di ? day : { ...day, [field]: val });
    updateDays(d);
  };

  const addExercise = (di) => {
    const d = days.map((day, i) => i !== di ? day : {
      ...day,
      exercises: [...day.exercises, { name: "New Exercise", tag: "Muscle Group", sets: "3", reps: "15", load: "Bodyweight", mmc: "Feel the target muscle contracting on every rep.", fail: false, c: "#4db8f4" }]
    });
    updateDays(d);
    setOpenEx(days[di].exercises.length);
  };

  const removeExercise = (di, ei) => {
    const d = days.map((day, i) => i !== di ? day : {
      ...day, exercises: day.exercises.filter((_, j) => j !== ei)
    });
    updateDays(d);
    setOpenEx(null);
  };

  const resetToDefault = () => { updateDays(DEFAULT_DAYS); };

  const day = days[dayIdx];

  return (
    <div style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif", background: "#080808", minHeight: "100vh", color: "#eee" }}>

      {/* TOP BAR */}
      <div style={{ padding: "14px 12px 10px", background: "#080808", borderBottom: "1px solid #161616", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "8px", letterSpacing: "4px", color: "#2a2a2a", textTransform: "uppercase" }}>Huberman · Hypertrophy Protocol</div>
            <div style={{ fontSize: "18px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px" }}>Calisthenics Build</div>
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {saved && <span style={{ fontSize: "9px", color: "#4df4a0", letterSpacing: "1px" }}>SAVED ✓</span>}
            <button onClick={() => setEditMode(!editMode)}
              style={{ background: editMode ? day.accent : "#1a1a1a", color: editMode ? "#080808" : "#555",
                border: `1px solid ${editMode ? day.accent : "#2a2a2a"}`, padding: "5px 10px",
                fontSize: "9px", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase",
                cursor: "pointer", borderRadius: "2px", fontFamily: "inherit" }}>
              {editMode ? "✓ EDITING" : "EDIT"}
            </button>
          </div>
        </div>

        {/* Protocol pills */}
        <div style={{ display: "flex", gap: "5px", marginTop: "8px", flexWrap: "wrap" }}>
          {[["10–15 sets", "/wk per muscle"], ["15 reps", "per set"], ["30–80%", "of 1RM"], ["Last set", "to failure"]].map(([v, s]) => (
            <div key={v} style={{ background: "#111", border: "1px solid #1a1a1a", padding: "3px 7px", borderRadius: "2px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: day.accent }}>{v} </span>
              <span style={{ fontSize: "8px", color: "#2a2a2a", textTransform: "uppercase", letterSpacing: "1px" }}>{s}</span>
            </div>
          ))}
        </div>

        {editMode && (
          <div style={{ marginTop: "8px", fontSize: "9px", color: "#444", letterSpacing: "1px" }}>
            TAP ANY TEXT TO EDIT · CHANGES SAVE AUTOMATICALLY
            <button onClick={resetToDefault}
              style={{ marginLeft: "10px", background: "transparent", border: "1px solid #2a2a2a", color: "#333",
                fontSize: "8px", padding: "2px 6px", cursor: "pointer", fontFamily: "inherit", borderRadius: "2px" }}>
              RESET TO DEFAULT
            </button>
          </div>
        )}
      </div>

      {/* DAY TABS */}
      <div style={{ display: "flex", background: "#080808", borderBottom: "1px solid #161616", overflowX: "auto", scrollbarWidth: "none", position: "sticky", top: editMode ? "120px" : "100px", zIndex: 19 }}>
        {days.map((d, i) => (
          <button key={d.id} onClick={() => { setDayIdx(i); setOpenEx(null); }}
            style={{ flex: "0 0 auto", padding: "10px 12px", background: "transparent", border: "none",
              borderBottom: dayIdx === i ? `3px solid ${d.accent}` : "3px solid transparent",
              color: dayIdx === i ? d.accent : "#2a2a2a", fontSize: "12px", fontWeight: "800",
              letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}>
            {d.id}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "14px 12px 60px" }}>

        {/* Day header */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "inline-block", background: day.accent, color: "#080808", fontSize: "8px", fontWeight: "900", letterSpacing: "3px", padding: "2px 7px", marginBottom: "4px", textTransform: "uppercase" }}>
            {day.id} · 45 MIN
          </div>
          <div style={{ fontSize: "22px", fontWeight: "900", textTransform: "uppercase", lineHeight: 1 }}>
            {editMode
              ? <Field value={day.title} onChange={v => updateDay(dayIdx, "title", v)}
                  style={{ fontSize: "22px", fontWeight: "900", textTransform: "uppercase", color: "#eee", width: "100%" }} />
              : day.title}
          </div>
          <div style={{ fontSize: "10px", color: "#3a3a3a", letterSpacing: "2px", marginTop: "3px", textTransform: "uppercase" }}>
            {editMode
              ? <Field value={day.sub} onChange={v => updateDay(dayIdx, "sub", v)}
                  style={{ fontSize: "10px", color: "#3a3a3a", letterSpacing: "2px", textTransform: "uppercase" }} />
              : day.sub}
          </div>
        </div>

        {/* Weekly tracker */}
        <div style={{ background: "#0e0e0e", border: "1px solid #161616", padding: "10px 12px", borderRadius: "2px", marginBottom: "12px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#2a2a2a", textTransform: "uppercase", marginBottom: "8px" }}>Weekly sets after today (target: 10–15)</div>
          {day.tracker.map(({ label, today, total, done }) => (
            <div key={label} style={{ marginBottom: "7px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: done ? "#4df4a0" : "#555" }}>
                  {label}{done ? "  ✓ DONE" : ""}
                </span>
                <span style={{ fontSize: "9px", color: "#2a2a2a" }}>{today} today · {total} total</span>
              </div>
              <div style={{ height: "3px", background: "#161616", borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${Math.round((total / 15) * 100)}%`, background: done ? "#4df4a0" : day.accent, opacity: done ? 1 : 0.4, borderRadius: "2px" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
          {[["#e8f44d", "Calisthenics"], ["#4db8f4", "Weighted"], ["#f44d7b", "Abs"]].map(([col, lbl]) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: col }} />
              <span style={{ fontSize: "8px", color: "#2a2a2a", letterSpacing: "1.5px", textTransform: "uppercase" }}>{lbl}</span>
            </div>
          ))}
          {!editMode && <span style={{ marginLeft: "auto", fontSize: "8px", color: "#1e1e1e", letterSpacing: "1px" }}>TAP → MMC CUE</span>}
        </div>

        {/* Exercise cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {day.exercises.map((ex, i) => {
            const isOpen = openEx === i;
            return (
              <div key={i}
                onClick={() => !editMode && setOpenEx(isOpen ? null : i)}
                style={{ borderLeft: `3px solid ${ex.c}`, background: isOpen ? "#131313" : "#0e0e0e",
                  padding: "11px 12px", cursor: editMode ? "default" : "pointer", borderRadius: "2px", position: "relative" }}>

                {editMode && (
                  <button onClick={() => removeExercise(dayIdx, i)}
                    style={{ position: "absolute", top: "8px", right: "8px", background: "#1a1a1a",
                      border: "1px solid #2a2a2a", color: "#555", width: "20px", height: "20px",
                      cursor: "pointer", fontSize: "12px", borderRadius: "2px", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", paddingRight: editMode ? "28px" : "0" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      {editMode
                        ? <Field value={ex.name} onChange={v => updateExercise(dayIdx, i, "name", v)}
                            style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", color: "#eee", minWidth: "120px" }} />
                        : <span style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{ex.name}</span>
                      }
                      {ex.fail && !editMode && (
                        <span style={{ fontSize: "7px", fontWeight: "900", letterSpacing: "1px", color: "#ff5555", background: "#ff000012", border: "1px solid #ff000020", padding: "2px 4px", borderRadius: "2px", whiteSpace: "nowrap" }}>
                          LAST → FAIL
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "9px", color: "#2e2e2e", marginTop: "2px", letterSpacing: "1px", textTransform: "uppercase" }}>
                      {editMode
                        ? <Field value={ex.tag} onChange={v => updateExercise(dayIdx, i, "tag", v)}
                            style={{ fontSize: "9px", color: "#2e2e2e", letterSpacing: "1px", textTransform: "uppercase" }} />
                        : ex.tag}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: day.accent, lineHeight: 1 }}>
                      {editMode ? (
                        <span style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: "flex-end" }}>
                          <Field value={ex.sets} onChange={v => updateExercise(dayIdx, i, "sets", v)}
                            style={{ fontSize: "14px", fontWeight: "800", color: day.accent, width: "28px", textAlign: "center" }} />
                          <span style={{ color: "#444" }}>×</span>
                          <Field value={ex.reps} onChange={v => updateExercise(dayIdx, i, "reps", v)}
                            style={{ fontSize: "14px", fontWeight: "800", color: day.accent, width: "60px", textAlign: "center" }} />
                        </span>
                      ) : `${ex.sets} × ${ex.reps}`}
                    </div>
                    <div style={{ fontSize: "9px", color: "#2a2a2a", marginTop: "2px" }}>
                      {editMode
                        ? <Field value={ex.load} onChange={v => updateExercise(dayIdx, i, "load", v)}
                            style={{ fontSize: "9px", color: "#2a2a2a", textAlign: "right", width: "120px" }} />
                        : ex.load}
                    </div>
                  </div>
                </div>

                {(isOpen || editMode) && (
                  <div style={{ marginTop: "9px", paddingTop: "9px", borderTop: "1px solid #1a1a1a" }}>
                    <div style={{ fontSize: "8px", letterSpacing: "2px", color: ex.c, marginBottom: "4px", textTransform: "uppercase" }}>Mind-Muscle Cue</div>
                    {editMode
                      ? <Field value={ex.mmc} onChange={v => updateExercise(dayIdx, i, "mmc", v)}
                          multiline style={{ fontSize: "12px", color: "#888", fontStyle: "italic", width: "100%" }} />
                      : <div style={{ fontSize: "13px", color: "#888", lineHeight: "1.55", fontStyle: "italic" }}>"{ex.mmc}"</div>
                    }
                    {editMode && (
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "8px", color: "#333", letterSpacing: "1px", textTransform: "uppercase" }}>Last set to failure:</span>
                        <button onClick={() => updateExercise(dayIdx, i, "fail", !ex.fail)}
                          style={{ background: ex.fail ? "#ff000022" : "#1a1a1a", border: `1px solid ${ex.fail ? "#ff3333" : "#2a2a2a"}`,
                            color: ex.fail ? "#ff5555" : "#444", fontSize: "8px", fontWeight: "800", letterSpacing: "1px",
                            padding: "2px 7px", cursor: "pointer", borderRadius: "2px", fontFamily: "inherit" }}>
                          {ex.fail ? "ON" : "OFF"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {editMode && (
          <button onClick={() => addExercise(dayIdx)}
            style={{ width: "100%", marginTop: "8px", background: "#0e0e0e", border: `1px dashed #2a2a2a`,
              color: "#333", padding: "12px", fontSize: "10px", fontWeight: "800", letterSpacing: "3px",
              textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", fontFamily: "inherit" }}>
            + ADD EXERCISE
          </button>
        )}

        {/* Coach tip */}
        <div style={{ marginTop: "12px", background: "#0e0e0e", borderTop: `2px solid ${day.accent}`, padding: "12px", borderRadius: "2px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", color: day.accent, textTransform: "uppercase", marginBottom: "5px" }}>Coach's Note</div>
          {editMode
            ? <Field value={day.tip} onChange={v => updateDay(dayIdx, "tip", v)}
                multiline style={{ fontSize: "13px", color: "#666", width: "100%" }} />
            : <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{day.tip}</div>
          }
        </div>

      </div>
    </div>
  );
}
