import { useState } from "react";
import ReportCard from "./ReportCard.jsx";

export default function StudentPortal({ students }) {
  const [regNo, setRegNo] = useState("");
  const [sem, setSem] = useState("1");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const lookup = (e) => {
    e.preventDefault();
    const student = students.find((s) => s.regNo.toLowerCase() === regNo.trim().toLowerCase());
    if (!student) {
      setResult(null);
      setError("No student found with that registration number. Check it and try again.");
    } else if (!student.semesters[sem] || student.semesters[sem].length === 0) {
      setResult(null);
      setError(`No results are published for semester ${sem}. Choose another semester.`);
    } else {
      setError("");
      setResult({ student, sem: Number(sem) });
    }
  };

  return (
    <section>
      <form className="lookup" onSubmit={lookup}>
        <label>
          Registration number
          <input value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder="e.g. 2201CS001" required />
        </label>
        <label>
          Semester
          <select value={sem} onChange={(e) => setSem(e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>Semester {n}</option>
            ))}
          </select>
        </label>
        <button className="primary" type="submit">View report card</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <ReportCard student={result.student} sem={result.sem} />}
      {!result && !error && (
        <p className="hint">Enter your registration number and semester to see your grades, SGPA and CGPA.</p>
      )}
    </section>
  );
}
