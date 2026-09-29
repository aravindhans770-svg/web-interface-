import { gradeOf, sgpa, cgpa } from "./store.js";

export default function ReportCard({ student, sem }) {
  const subjects = student.semesters[sem];
  const failed = subjects.filter((s) => gradeOf(s.marks).grade === "F").length;

  return (
    <article className="card">
      <div className="card-head">
        <div>
          <h2>{student.name}</h2>
          <p>{student.department}</p>
          <p className="muted">Reg. no. {student.regNo}</p>
        </div>
        <div className="sem-badge">Semester {sem}</div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Code</th><th>Subject</th><th>Credits</th><th>Marks</th><th>Grade</th><th>Result</th></tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => {
              const { grade } = gradeOf(s.marks);
              return (
                <tr key={i}>
                  <td>{s.code}</td>
                  <td>{s.name}</td>
                  <td>{s.credits}</td>
                  <td>{s.marks}</td>
                  <td><span className={`grade g-${grade === "F" ? "f" : "p"}`}>{grade}</span></td>
                  <td>{grade === "F" ? "Re-appear" : "Pass"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="gpa">
        <div><span>SGPA</span><strong>{sgpa(student, sem).toFixed(2)}</strong></div>
        <div><span>CGPA up to semester {sem}</span><strong>{cgpa(student, sem).toFixed(2)}</strong></div>
        <div><span>Status</span><strong className="status">{failed ? `${failed} arrear${failed > 1 ? "s" : ""}` : "All cleared"}</strong></div>
      </div>
      <button className="ghost no-print" onClick={() => window.print()}>Print report card</button>
    </article>
  );
}
