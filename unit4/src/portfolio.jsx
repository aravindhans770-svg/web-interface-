
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="cyber-portfolio">
        <style>{`
          .cyber-portfolio {
            font-family: Arial, sans-serif;
            background: #07111f;
            color: #e5e7eb;
            min-height: 100vh;
          }

          .cyber-portfolio * {
            box-sizing: border-box;
          }

          .cyber-portfolio .navbar {
            background: #0b1728;
            border-bottom: 1px solid #00ff88;
            padding: 20px 8%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
          }

          .cyber-portfolio .logo {
            color: #00ff88;
            font-size: 22px;
            font-weight: bold;
          }

          .cyber-portfolio .nav-links {
            display: flex;
            gap: 25px;
          }

          .cyber-portfolio .nav-links a {
            color: #e5e7eb;
            text-decoration: none;
            font-weight: bold;
          }

          .cyber-portfolio .nav-links a:hover {
            color: #00ff88;
          }

          .cyber-portfolio .page {
            max-width: 1000px;
            margin: auto;
            padding: 70px 25px;
          }

          .cyber-portfolio .hero {
            text-align: center;
            padding: 100px 25px;
          }

          .cyber-portfolio h1 {
            color: #00ff88;
            font-size: 40px;
            margin-bottom: 20px;
          }

          .cyber-portfolio h2 {
            color: #38bdf8;
            margin-bottom: 20px;
          }

          .cyber-portfolio p {
            line-height: 1.8;
            margin-bottom: 15px;
          }

          .cyber-portfolio .btn {
            display: inline-block;
            margin: 20px 8px;
            padding: 12px 24px;
            border: 1px solid #00ff88;
            border-radius: 5px;
            color: #00ff88;
            text-decoration: none;
          }

          .cyber-portfolio .btn:hover {
            background: #00ff88;
            color: #07111f;
          }
..333.
<div className=".3"></div>
          .cyber-portfolio .card {
            background: #0b1728;
            border: 1px solid #1e3a52;
            border-radius: 8px;
            padding: 30px;
            max-width: 750px;
            margin: auto;
          }

          .cyber-portfolio .card h2 {
            color: #00ff88;
          }

          .cyber-portfolio .contact-info {
            margin-top: 25px;
            color: #38bdf8;
          }

          .cyber-portfolio footer {
            text-align: center;
            padding: 25px;
            border-top: 1px solid #1e3a52;
            color: #64748b;
          }

          @media (max-width: 600px) {
            .cyber-portfolio .navbar {
              justify-content: center;
            }

            .cyber-portfolio .nav-links {
              gap: 15px;
              flex-wrap: wrap;
              justify-content: center;
            }

            .cyber-portfolio h1 {
              font-size: 30px;
            }
          }
        `}</style>

        <nav className="navbar">
          <div className="logo">{"<CyberStudent />"}</div>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <footer>
          © 2026 Cyber Student Portfolio
        </footer>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="page hero">
      <p style={{ color: "#00ff88" }}>Hello, World!_</p>

      <h1>I'm a Cyber Security Student</h1>

      <h2>Ethical Hacking | Networking | Web Security</h2>

      <p>
        Welcome to my personal portfolio. I am passionate about
        cybersecurity, ethical hacking, and building secure
        web applications.
      </p>

      <Link to="/about" className="btn">
        About Me
      </Link>

      <Link to="/contact" className="btn">
        Contact Me
      </Link>
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <div className="card">
        <h1>About Me</h1>

        <h2>Cyber Security Student</h2>

        <p>
          I am a cybersecurity student interested in ethical
          hacking, network security, and secure software development.
        </p>

        <p>
          I enjoy learning how systems work, identifying
          vulnerabilities in authorized environments, and
          developing practical security skills.
        </p>

        <p>
          My goal is to become a cybersecurity professional
          and contribute to building safer digital systems.
        </p>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="page">
      <div className="card">
        <h1>Contact Me</h1>

        <p>
          Feel free to reach out to me for collaboration,
          learning opportunities, or cybersecurity discussions.
        </p>

        <div className="contact-info">
          <p>Email: aravind@gmail.com</p>
          <p>GitHub: github.com/aravind</p>
          <p>LinkedIn: linkedin.com/in/aravind</p>
        </div>
      </div>
    </div>
  );
}

export default App;