import { useState } from "react";
import { buildSeed, semKeys } from "./store.js";
import StudentEditor from "./StudentEditor.jsx";

export default function AdminPanel({ students, setStudents, onLogout }) {
  const [editing, setEditing] = useState(null); // null | "new" | regNo
  const [query, setQuery] = useState("");

  if (editing) {
    const initial = editing === "new" ? null : students.find((s) => s.regNo === editing);
    const save = (draft) => {
      setStudents((list) =>
        initial ? list.map((s) => (s.regNo === initial.regNo ? draft : s)) : [...list, draft]
      );
      setEditing(null);
    };
    return (
      <StudentEditor
        initial={initial}
        takenRegNos={students.filter((s) => s !== initial).map((s) => s.regNo.toLowerCase())}
        onSave={save}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const remove = (s) => {
    if (window.confirm(`Remove ${s.name} (${s.regNo}) and all their results?`))
      setStudents((list) => list.filter((x) => x.regNo !== s.regNo));
  };
  const reset = () => {
    if (window.confirm("Replace all data with the original sample students?")) setStudents(buildSeed());
  };
  const shown = students.filter((s) =>
    `${s.name} ${s.regNo} ${s.department}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section>
      <div className="bar">
        <h2>Students ({students.length})</h2>
        <input className="search" placeholder="Search name, reg. no. or department" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="primary" onClick={() => setEditing("new")}>Add student</button>
        <button className="ghost" onClick={reset}>Reset to sample data</button>
        <button className="ghost" onClick={onLogout}>Sign out</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Reg. no.</th><th>Name</th><th>Department</th><th>Semesters</th><th></th></tr></thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.regNo}>
                <td>{s.regNo}</td>
                <td>{s.name}</td>
                <td>{s.department}</td>
                <td>{semKeys(s).join(", ") || "None"}</td>
                <td className="actions">
                  <button className="ghost" onClick={() => setEditing(s.regNo)}>Edit</button>
                  <button className="danger" onClick={() => remove(s)}>Remove</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan="5" className="muted">No students match. Add a student to get started.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
