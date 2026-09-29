import { useState } from "react";
import { gradeOf, semKeys } from "./store.js";

export default function StudentEditor({ initial, takenRegNos, onSave, onCancel }) {
  const [draft, setDraft] = useState(() =>
    initial ? structuredClone(initial) : { regNo: "", name: "", department: "", semesters: { 1: [] } }
  );
  const keys = semKeys(draft);
  const [active, setActive] = useState(keys[0] ?? 1);
  const [error, setError] = useState("");

  const setField = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const setSubjects = (sem, fn) =>
    setDraft((d) => ({ ...d, semesters: { ...d.semesters, [sem]: fn(d.semesters[sem] || []) } }));
  const editSubject = (i, k, v) =>
    setSubjects(active, (list) => list.map((s, j) => (j === i ? { ...s, [k]: v } : s)));

  const addSemester = () => {
    const next = (keys.length ? Math.max(...keys) : 0) + 1;
    setDraft((d) => ({ ...d, semesters: { ...d.semesters, [next]: [] } }));
    setActive(next);
  };
  const removeSemester = () => {
    if (!window.confirm(`Remove semester ${active} and its subjects?`)) return;
    const rest = { ...draft.semesters };
    delete rest[active];
    setDraft({ ...draft, semesters: rest });
    setActive(Object.keys(rest).map(Number).sort((a, b) => a - b)[0] ?? 1);
  };

  const save = () => {
    const regNo = draft.regNo.trim();
    if (!regNo || !draft.name.trim() || !draft.department.trim())
      return setError("Registration number, name and department are required.");
    if (takenRegNos.includes(regNo.toLowerCase()))
      return setError("Another student already has this registration number.");
    const semesters = {};
    for (const k of keys)
      semesters[k] = draft.semesters[k].map((s) => ({
        ...s,
        credits: Math.max(0, Number(s.credits) || 0),
        marks: Math.min(100, Math.max(0, Number(s.marks) || 0)),
      }));
    onSave({ ...draft, regNo, name: draft.name.trim(), department: draft.department.trim(), semesters });
  };

  const subjects = draft.semesters[active] || [];

  return (
    <section className="editor">
      <h2>{initial ? `Edit ${initial.name}` : "Add student"}</h2>
      <div className="grid3">
        <label>Registration number<input value={draft.regNo} onChange={(e) => setField("regNo", e.target.value)} /></label>
        <label>Name<input value={draft.name} onChange={(e) => setField("name", e.target.value)} /></label>
        <label>Department<input value={draft.department} onChange={(e) => setField("department", e.target.value)} /></label>
      </div>

      <div className="sem-tabs">
        {keys.map((k) => (
          <button key={k} className={k === active ? "on" : ""} onClick={() => setActive(k)}>Semester {k}</button>
        ))}
        <button className="ghost" onClick={addSemester}>Add semester</button>
      </div>

      {keys.length === 0 ? (
        <p className="hint">No semesters yet. Add a semester to enter subjects and marks.</p>
      ) : (
        <>
          <div className="table-wrap">
            <table className="edit-table">
              <thead><tr><th>Code</th><th>Subject</th><th>Credits</th><th>Marks (0-100)</th><th>Grade</th><th></th></tr></thead>
              <tbody>
                {subjects.map((s, i) => (
                  <tr key={i}>
                    <td><input value={s.code} onChange={(e) => editSubject(i, "code", e.target.value)} /></td>
                    <td><input value={s.name} onChange={(e) => editSubject(i, "name", e.target.value)} /></td>
                    <td><input type="number" min="0" value={s.credits} onChange={(e) => editSubject(i, "credits", e.target.value)} /></td>
                    <td><input type="number" min="0" max="100" value={s.marks} onChange={(e) => editSubject(i, "marks", e.target.value)} /></td>
                    <td>{gradeOf(s.marks).grade}</td>
                    <td><button className="danger" onClick={() => setSubjects(active, (l) => l.filter((_, j) => j !== i))}>Remove</button></td>
                  </tr>
                ))}
                {subjects.length === 0 && <tr><td colSpan="6" className="muted">No subjects in this semester. Add one below.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="bar">
            <button className="ghost" onClick={() => setSubjects(active, (l) => [...l, { code: "", name: "", credits: 3, marks: 0 }])}>Add subject</button>
            <button className="danger" onClick={removeSemester}>Remove semester {active}</button>
          </div>
        </>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      <div className="bar">
        <button className="primary" onClick={save}>Save changes</button>
        <button className="ghost" onClick={onCancel}>Cancel</button>
      </div>
    </section>
  );
}
