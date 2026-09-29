import { useMemo, useState } from "react";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Aarav Mehta", email: "aarav.mehta@northstar.edu", rollNumber: "CS-24018", department: "Computer Science", semester: 6, cgpa: 9.2, attendance: 96, status: "Active", photo: "https://i.pravatar.cc/100?img=12" },
  { id: 2, name: "Ananya Bose", email: "ananya.bose@northstar.edu", rollNumber: "DS-24024", department: "Data Science", semester: 4, cgpa: 8.8, attendance: 92, status: "Active", photo: "https://i.pravatar.cc/100?img=47" },
  { id: 3, name: "Rohan Kapoor", email: "rohan.kapoor@northstar.edu", rollNumber: "EC-23009", department: "Electronics", semester: 6, cgpa: 7.4, attendance: 78, status: "At risk", photo: "https://i.pravatar.cc/100?img=33" },
  { id: 4, name: "Mira Sen", email: "mira.sen@northstar.edu", rollNumber: "IT-24031", department: "Information Technology", semester: 4, cgpa: 8.5, attendance: 89, status: "Active", photo: "https://i.pravatar.cc/100?img=44" },
  { id: 5, name: "Kabir Nair", email: "kabir.nair@northstar.edu", rollNumber: "CS-22007", department: "Computer Science", semester: 8, cgpa: 9.6, attendance: 98, status: "Active", photo: "https://i.pravatar.cc/100?img=60" },
  { id: 6, name: "Isha Patel", email: "isha.patel@northstar.edu", rollNumber: "DS-23016", department: "Data Science", semester: 6, cgpa: 8.1, attendance: 84, status: "Review", photo: "https://i.pravatar.cc/100?img=49" },
];

const departments = ["Computer Science", "Data Science", "Electronics", "Information Technology"];

function StudentTable({ students }) {
  return (
    <div className="table-scroll">
      <table className="student-table">
        <thead>
          <tr><th>Student</th><th>Student ID</th><th>Department</th><th>Semester</th><th>CGPA</th><th>Attendance</th><th>Status</th></tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td><div className="student-identity"><img src={student.photo} alt="" /><span><strong>{student.name}</strong><small>{student.email}</small></span></div></td>
              <td className="muted-cell">{student.rollNumber}</td>
              <td>{student.department}</td>
              <td>Semester {student.semester}</td>
              <td><span className="grade-value">{student.cgpa.toFixed(1)}</span><span className="grade-total"> / 10</span></td>
              <td><span className={`attendance-value ${student.attendance < 80 ? "attendance-low" : ""}`}>{student.attendance}%</span></td>
              <td><span className={`status-pill status-${student.status.toLowerCase().replace(" ", "-")}`}><i />{student.status}</span></td>
            </tr>
          ))}
          {students.length === 0 && <tr><td className="empty-state" colSpan="7">No students match your search.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function AddStudentDialog({ onClose, onAdd }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onAdd({
      id: Date.now(),
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      rollNumber: formData.get("rollNumber").trim(),
      department: formData.get("department"),
      semester: Number(formData.get("semester")),
      cgpa: Number(formData.get("cgpa")),
      attendance: 100,
      status: "Active",
      photo: `https://i.pravatar.cc/100?u=${encodeURIComponent(formData.get("email"))}`,
    });
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="student-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-heading"><div><p className="eyebrow">STUDENT RECORD</p><h2 id="dialog-title">Add a student</h2></div><button className="icon-button close-button" onClick={onClose} aria-label="Close dialog">×</button></div>
        <form onSubmit={handleSubmit}>
          <label>Full name<input name="name" placeholder="e.g. Samira Roy" required /></label>
          <label>Email address<input name="email" type="email" placeholder="student@northstar.edu" required /></label>
          <div className="form-row"><label>Student ID<input name="rollNumber" placeholder="CS-24042" required /></label><label>Department<select name="department">{departments.map((department) => <option key={department}>{department}</option>)}</select></label></div>
          <div className="form-row"><label>Semester<input name="semester" type="number" min="1" max="8" defaultValue="1" required /></label><label>CGPA<input name="cgpa" type="number" min="0" max="10" step="0.1" defaultValue="0" required /></label></div>
          <div className="dialog-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">Add student <span>↗</span></button></div>
        </form>
      </section>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [sortOrder, setSortOrder] = useState("name");
  const [activeView, setActiveView] = useState("Overview");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredStudents = useMemo(() => students
    .filter((student) => department === "All departments" || student.department === department)
    .filter((student) => `${student.name} ${student.email} ${student.rollNumber}`.toLowerCase().includes(search.toLowerCase()))
    .sort((first, second) => sortOrder === "cgpa" ? second.cgpa - first.cgpa : first.name.localeCompare(second.name)), [students, department, search, sortOrder]);
  const averageCgpa = students.length ? (students.reduce((total, student) => total + student.cgpa, 0) / students.length).toFixed(1) : "0.0";
  const activeStudents = students.filter((student) => student.status === "Active").length;

  function addStudent(student) {
    setStudents((current) => [student, ...current]);
    setDialogOpen(false);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setActiveView("Overview")}><span className="brand-mark">N</span><span>northstar<small>ACADEMIC PORTAL</small></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {[{ name: "Overview", icon: "◫" }, { name: "Students", icon: "♧" }, { name: "Academic results", icon: "↗" }].map((item) => <button key={item.name} className={`nav-item ${activeView === item.name ? "nav-active" : ""}`} onClick={() => setActiveView(item.name)}><span className="nav-icon">{item.icon}</span>{item.name}{item.name === "Students" && <span className="nav-count">{students.length}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="term-card"><span className="term-dot" />CURRENT TERM<strong>Fall semester 2026</strong><small>Aug 24 — Dec 18, 2026</small></div><button className="profile-button"><span className="profile-avatar">JD</span><span><strong>Jordan Davis</strong><small>Administrator</small></span><span className="profile-more">···</span></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <strong>{activeView}</strong></div><div className="topbar-actions"><span className="today-label">Monday, September 28, 2026</span><button className="icon-button notification-button" aria-label="Notifications">♧<i /></button><span className="top-avatar">JD</span></div></header>
        <div className="page-content">
          <section className="page-heading"><div><p className="eyebrow">MONDAY, SEPTEMBER 28, 2026</p><h1>{activeView === "Overview" ? "Good morning, Jordan" : activeView}</h1><p className="page-subtitle">{activeView === "Overview" ? "Here’s what’s happening across your campus today." : activeView === "Students" ? "Browse, search, and manage your student records." : "A quick look at student achievement this term."}</p></div><button className="button button-primary add-button" onClick={() => setDialogOpen(true)}><span className="add-symbol">+</span> Add student</button></section>

          <section className="stats-grid" aria-label="Student statistics">
            <article className="stat-card"><div className="stat-top"><span>Total students</span><span className="stat-icon icon-blue">♧</span></div><strong>{students.length.toString().padStart(2, "0")}</strong><div className="stat-foot"><span className="trend-up">↗ 8.2%</span><span>vs last semester</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Active students</span><span className="stat-icon icon-green">✓</span></div><strong>{activeStudents.toString().padStart(2, "0")}</strong><div className="stat-foot"><span className="stat-note">{students.length ? Math.round(activeStudents / students.length * 100) : 0}%</span><span>of total enrollment</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Average CGPA</span><span className="stat-icon icon-gold">✳</span></div><strong>{averageCgpa}<small className="out-of"> / 10</small></strong><div className="stat-foot"><span className="trend-up">↗ 0.3</span><span>vs last semester</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Needs attention</span><span className="stat-icon icon-coral">!</span></div><strong>{students.filter((student) => student.status !== "Active").length.toString().padStart(2, "0")}</strong><div className="stat-foot"><span className="attention-note">Attendance or grades</span></div></article>
          </section>

          {activeView !== "Students" && <section className="insights-grid">
            <article className="insight-panel department-panel"><div className="panel-heading"><div><p className="eyebrow">ENROLLMENT</p><h2>Students by department</h2></div><span className="panel-period">This term⌄</span></div><div className="department-bars">{departments.map((item, index) => { const count = students.filter((student) => student.department === item).length; const percentage = students.length ? Math.max(count / students.length * 100, 4) : 0; return <div className="department-row" key={item}><div className="department-label"><span>{item}</span><strong>{count.toString().padStart(2, "0")}</strong></div><div className="bar-track"><span className={`bar-fill bar-${index}`} style={{ width: `${percentage}%` }} /></div></div>; })}</div></article>
            <article className="insight-panel highlight-panel"><div className="highlight-top"><span className="highlight-icon">✳</span><span className="highlight-label">ACADEMIC HIGHLIGHT</span></div><p>Small steps add up.</p><h2>{students.filter((student) => student.cgpa >= 8.5).length} students are currently achieving a CGPA of 8.5 or above.</h2><button className="text-link" onClick={() => { setActiveView("Academic results"); setSortOrder("cgpa"); }}>Explore academic results <span>↗</span></button><div className="highlight-orbit orbit-one" /><div className="highlight-orbit orbit-two" /></article>
          </section>}

          <section className="roster-section">
            <div className="roster-heading"><div><p className="eyebrow">PEOPLE DIRECTORY</p><h2>{activeView === "Academic results" ? "Academic results" : "Student directory"}<span className="result-count">{students.length}</span></h2></div><button className="button button-outline export-button" onClick={() => window.print()}><span>⇩</span> Export</button></div>
            <div className="table-toolbar"><label className="search-field"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." aria-label="Search students" /><kbd>⌘ K</kbd></label><div className="table-filters"><label className="select-wrap"><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></label><label className="select-wrap sort-select"><span>Sort by</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="name">Name</option><option value="cgpa">Highest CGPA</option></select></label></div></div>
            <StudentTable students={filteredStudents} />
            <div className="table-footer"><span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span><div className="pagination"><button disabled aria-label="Previous page">‹</button><button className="page-current">1</button><button disabled aria-label="Next page">›</button></div></div>
          </section>
          <footer className="page-footer"><span>© 2026 Northstar University</span><span>Student information system <i /> All systems operational</span></footer>
        </div>
      </main>
      {dialogOpen && <AddStudentDialog onClose={() => setDialogOpen(false)} onAdd={addStudent} />}
    </div>
  );
}

export default App;
