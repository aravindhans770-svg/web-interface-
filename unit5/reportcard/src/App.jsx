import { useEffect, useState } from "react";
import { loadStudents, saveStudents } from "./store.js";
import StudentPortal from "./StudentPortal.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminPanel from "./AdminPanel.jsx";

export default function App() {
  const [students, setStudents] = useState(loadStudents);
  const [view, setView] = useState("student");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => saveStudents(students), [students]);

  const logout = () => {
    setIsAdmin(false);
    setView("student");
  };

  return (
    <div className="shell">
      <header className="top">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">தமிழ்</span>
          <div>
            <h1>Semester Report Card</h1>
            <p>Examination results portal</p>
          </div>
        </div>
        <nav className="tabs">
          <button className={view === "student" ? "on" : ""} onClick={() => setView("student")}>Student</button>
          <button className={view === "admin" ? "on" : ""} onClick={() => setView("admin")}>Admin</button>
        </nav>
      </header>

      <main>
        {view === "student" && <StudentPortal students={students} />}
        {view === "admin" && !isAdmin && <AdminLogin onSuccess={() => setIsAdmin(true)} />}
        {view === "admin" && isAdmin && (
          <AdminPanel students={students} setStudents={setStudents} onLogout={logout} />
        )}
      </main>
    </div>
  );
}
