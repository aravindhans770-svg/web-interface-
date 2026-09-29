export const STORAGE_KEY = "report_portal_students_v1";
export const ADMIN_PASSWORD = "admin123";

const BANDS = [
  [91, "O", 10],
  [81, "A+", 9],
  [71, "A", 8],
  [61, "B+", 7],
  [51, "B", 6],
  [41, "C", 5],
];

export function gradeOf(marks) {
  const m = Number(marks) || 0;
  for (const [min, grade, points] of BANDS) if (m >= min) return { grade, points };
  return { grade: "F", points: 0 };
}

export const semKeys = (student) =>
  Object.keys(student.semesters).map(Number).sort((a, b) => a - b);

function gpa(subjectLists) {
  let credits = 0;
  let weighted = 0;
  for (const list of subjectLists)
    for (const s of list) {
      const c = Number(s.credits) || 0;
      credits += c;
      weighted += c * gradeOf(s.marks).points;
    }
  return credits ? weighted / credits : 0;
}

export const sgpa = (student, sem) => gpa([student.semesters[sem] || []]);

export const cgpa = (student, upTo) =>
  gpa(semKeys(student).filter((k) => k <= upTo).map((k) => student.semesters[k]));

/* ---------- seed data ---------- */
const COMMON = {
  1: [["Engineering Mathematics I", 4], ["Engineering Physics", 3], ["Engineering Chemistry", 3], ["Technical English", 3]],
  2: [["Engineering Mathematics II", 4], ["Problem Solving and Python", 3], ["Materials Science", 3], ["Engineering Graphics", 3]],
};

const DEPTS = {
  CS: { name: "Computer Science and Engineering", 3: [["Data Structures", 4], ["Digital Logic Design", 3], ["Discrete Mathematics", 4], ["Object Oriented Programming", 3]], 4: [["Database Management Systems", 4], ["Operating Systems", 4], ["Design and Analysis of Algorithms", 3], ["Computer Organization", 3]] },
  EC: { name: "Electronics and Communication Engineering", 3: [["Electronic Circuits", 4], ["Signals and Systems", 4], ["Network Analysis", 3], ["Digital Electronics", 3]], 4: [["Analog Communication", 4], ["Linear Integrated Circuits", 3], ["Electromagnetic Fields", 4], ["Microprocessors", 3]] },
  ME: { name: "Mechanical Engineering", 3: [["Engineering Mechanics", 4], ["Thermodynamics", 4], ["Manufacturing Processes", 3], ["Fluid Mechanics", 3]], 4: [["Kinematics of Machinery", 4], ["Strength of Materials", 4], ["Heat and Mass Transfer", 3], ["Metrology", 3]] },
  CE: { name: "Civil Engineering", 3: [["Surveying", 3], ["Construction Materials", 3], ["Mechanics of Solids", 4], ["Fluid Mechanics", 4]], 4: [["Structural Analysis", 4], ["Soil Mechanics", 4], ["Concrete Technology", 3], ["Highway Engineering", 3]] },
  EE: { name: "Electrical and Electronics Engineering", 3: [["Electric Circuit Analysis", 4], ["Electromagnetic Theory", 4], ["Electrical Machines I", 3], ["Analog Electronics", 3]], 4: [["Electrical Machines II", 4], ["Transmission and Distribution", 3], ["Control Systems", 4], ["Measurements and Instrumentation", 3]] },
};

const PEOPLE = [
  ["2201CS001", "Arun Karthik", "CS"],
  ["2201CS002", "Thamizharasi Muthu", "CS"],
  ["2201EC001", "Meenakshi Sundaram", "EC"],
  ["2201EC002", "Vignesh Ramasamy", "EC"],
  ["2201ME001", "Karthikeyan Murugan", "ME"],
  ["2201ME002", "Priyadharshini Velu", "ME"],
  ["2201CE001", "Harish Annamalai", "CE"],
  ["2201CE002", "Kavya Selvam", "CE"],
  ["2201EE001", "Nandhini Subramanian", "EE"],
  ["2201EE002", "Sathish Kumar Pandian", "EE"],
];

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildSeed() {
  return PEOPLE.map(([regNo, name, dk], i) => {
    const rand = rng(1000 + i * 77);
    const base = 58 + rand() * 30;
    const semesters = {};
    for (let sem = 1; sem <= 4; sem++) {
      const list = sem <= 2 ? COMMON[sem] : DEPTS[dk][sem];
      semesters[sem] = list.map(([subject, credits], j) => ({
        code: `${dk}${sem}0${j + 1}`,
        name: subject,
        credits,
        marks: Math.max(38, Math.min(99, Math.round(base + (rand() - 0.5) * 26))),
      }));
    }
    return { regNo, name, department: DEPTS[dk].name, semesters };
  });
}

export function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to seed */
  }
  return buildSeed();
}

export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch {
    /* storage unavailable */
  }
}
