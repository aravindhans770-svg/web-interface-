import { useState } from "react";

function Project2() {
  const [students, setStudents] = useState([
    { id: 1, name: "Arun", present: false },
    { id: 2, name: "Bala", present: false },
    { id: 3, name: "Karthik", present: false },
    { id: 4, name: "Rahul", present: false },
    { id: 5, name: "Vijay", present: false },
    { id: 6, name: "Ram", present: false },
    { id: 7, name: "Raja", present: false },
    { id: 8, name: "Suresh", present: false },
    { id: 9, name: "Kumar", present: false },
    { id: 10, name: "Mani", present: false },
    { id: 11, name: "Ramesh", present: false },
    { id: 12, name: "Sathish", present: false },
    { id: 13, name: "Vasanth", present: false },
    { id: 14, name: "Praveen", present: false },
    { id: 15, name: "Ganesh", present: false },
    { id: 16, name: "Karthikeyan", present: false },
    { id: 17, name: "Aravind", present: false },
    { id: 18, name: "Naveen", present: false },
    { id: 19, name: "Sanjay", present: false },
    { id: 20, name: "Vignesh", present: false },
  ]);

  const toggleAttendance = (id) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const present = students.filter((s) => s.present).length;
  const absent = students.length - present;

  return (
    <>
      <style>{`
        .attendance-container {
          width: 500px;
          max-width: 90%;
          margin: 50px auto;
          padding: 25px;
          background: #ffffff;
          color: #111827;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          border: 1px solid #e5e7eb;
        }

        .attendance-container h1 {
          text-align: center;
          color: #111827 !important;
          font-size: 26px;
          margin-bottom: 12px;
        }

        .attendance-container .count {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
        }

        .attendance-container .count h3 {
          color: #374151 !important;
          margin: 0;
          font-size: 18px;
        }

        .attendance-container .student {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          margin: 10px 0;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: #f9fafb;
          color: #111827 !important;
          font-weight: 500;
        }

        .attendance-container .student span {
          color: #111827 !important;
          font-size: 16px;
          font-weight: 600;
        }

        .attendance-container button {
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          color: #ffffff !important;
          font-weight: bold;
          cursor: pointer;
        }

        .attendance-container .present {
          background-color: #16a34a !important;
        }

        .attendance-container .absent {
          background-color: #dc2626 !important;
        }
      `}</style>

      <div className="attendance-container">
        <h1>Student Attendance Tracker</h1>

        <div className="count">
          <h3>Present: {present}</h3>
          <h3>Absent: {absent}</h3>
        </div>

        {students.map((student) => (
          <div className="student" key={student.id}>
            <span>{student.name}</span>

            <button
              className={student.present ? "present" : "absent"}
              onClick={() => toggleAttendance(student.id)}
            >
              {student.present ? "Present" : "Absent"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Project2;