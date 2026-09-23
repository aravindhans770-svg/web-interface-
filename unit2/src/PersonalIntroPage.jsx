import React, { useState } from 'react';

// Header Component
const Header = ({ title, subtitle, isDark, toggleDarkMode }) => {
  return (
    <header style={{...styles.header, ...(isDark ? styles.headerDark : {})}}>
      <div style={styles.headerContent}>
        <div>
          <h1 style={{...styles.title, ...(isDark ? { color: '#ecf0f1' } : {})}}>{title}</h1>
          <p style={{...styles.subtitle, ...(isDark ? { color: '#3498db' } : {})}}>{subtitle}</p>
        </div>
        <button 
          onClick={toggleDarkMode}
          style={{...styles.themeToggle, ...(isDark ? styles.themeToggleDark : {})}}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

// Profile Component
const Profile = ({ name, profession, image, isDark }) => {
  const [imageHovered, setImageHovered] = useState(false);
  
  return (
    <section style={{...styles.card, ...(isDark ? styles.cardDark : {})}}>
      <h2 style={{...styles.sectionTitle, ...(isDark ? { color: '#ecf0f1', borderBottomColor: '#3498db' } : {})}}>Profile</h2>
      <div style={styles.profileContent}>
        <img 
          src={image} 
          alt={name} 
          style={{
            ...styles.profileImage,
            transform: imageHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        />
        <div>
          <p style={{...styles.profileName, ...(isDark ? { color: '#ecf0f1' } : {})}}>{name}</p>
          <p style={{...styles.profileProfession, ...(isDark ? { color: '#3498db' } : {})}}>{profession}</p>
        </div>
      </div>
    </section>
  );
};

// About Component
const About = ({ intro, isDark }) => {
  return (
    <section style={{...styles.card, ...(isDark ? styles.cardDark : {})}}>
      <h2 style={{...styles.sectionTitle, ...(isDark ? { color: '#ecf0f1', borderBottomColor: '#3498db' } : {})}}>About</h2>
      <p style={{...styles.introText, ...(isDark ? { color: '#bdc3c7' } : {})}}>{intro}</p>
    </section>
  );
};

// Skills Component with Filter
const Skills = ({ skills, isDark }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const categories = {
    frontend: ['React.js', 'JavaScript', 'HTML & CSS'],
    backend: ['Node.js', 'Express.js', 'Python'],
    database: ['MongoDB', 'MySQL'],
    tools: ['Git & GitHub', 'REST APIs']
  };

  const getCategory = (skill) => {
    for (let [cat, skillList] of Object.entries(categories)) {
      if (skillList.includes(skill)) return cat;
    }
    return 'tools';
  };

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => getCategory(skill) === selectedCategory);

  return (
    <section style={{...styles.card, ...(isDark ? styles.cardDark : {})}}>
      <h2 style={{...styles.sectionTitle, ...(isDark ? { color: '#ecf0f1', borderBottomColor: '#3498db' } : {})}}>Technical Skills</h2>
      
      <div style={styles.filterButtons}>
        {['all', 'frontend', 'backend', 'database', 'tools'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.filterBtn,
              ...(selectedCategory === cat ? styles.filterBtnActive : {}),
              ...(isDark && selectedCategory === cat ? { backgroundColor: '#3498db', color: 'white' } : {}),
              ...(isDark && selectedCategory !== cat ? { backgroundColor: '#34495e', color: '#bdc3c7', border: '1px solid #7f8c8d' } : {})
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <ul style={styles.skillsList}>
        {filteredSkills.map((skill, index) => (
          <li 
            key={index} 
            style={{
              ...styles.skillItem,
              ...(hoveredSkill === index ? styles.skillItemHovered : {}),
              ...(isDark ? { backgroundColor: '#34495e', borderColor: '#3498db', color: '#ecf0f1' } : {}),
              ...(isDark && hoveredSkill === index ? { backgroundColor: '#3498db', color: 'white', transform: 'translateY(-5px)' } : {})
            }}
            onMouseEnter={() => setHoveredSkill(index)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
};

// Experience Component
const Experience = ({ experiences, isDark }) => {
  return (
    <section style={{...styles.card, ...(isDark ? styles.cardDark : {})}}>
      <h2 style={{...styles.sectionTitle, ...(isDark ? { color: '#ecf0f1', borderBottomColor: '#3498db' } : {})}}>Experience</h2>
      <div style={styles.experienceList}>
        {experiences.map((exp, index) => (
          <div key={index} style={{...styles.experienceItem, ...(isDark ? { borderLeftColor: '#3498db' } : {})}}>
            <h3 style={{...styles.expTitle, ...(isDark ? { color: '#ecf0f1' } : {})}}>{exp.title}</h3>
            <p style={{...styles.expCompany, ...(isDark ? { color: '#3498db' } : {})}}>{exp.company}</p>
            <p style={{...styles.expDate, ...(isDark ? { color: '#bdc3c7' } : {})}}>{exp.date}</p>
            <p style={{...styles.expDescription, ...(isDark ? { color: '#bdc3c7' } : {})}}>{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Projects Component
const Projects = ({ projects, isDark }) => {
  const [expandedProject, setExpandedProject] = useState(null);

  return (
    <section style={{...styles.card, ...(isDark ? styles.cardDark : {})}}>
      <h2 style={{...styles.sectionTitle, ...(isDark ? { color: '#ecf0f1', borderBottomColor: '#3498db' } : {})}}>Projects</h2>
      <div style={styles.projectsGrid}>
        {projects.map((project, index) => (
          <div 
            key={index}
            style={{
              ...styles.projectCard,
              ...(isDark ? styles.projectCardDark : {}),
              maxHeight: expandedProject === index ? '500px' : '200px',
              transition: 'all 0.3s ease'
            }}
          >
            <h3 style={{...styles.projectTitle, ...(isDark ? { color: '#ecf0f1' } : {})}}>{project.name}</h3>
            <p style={{...styles.projectDesc, ...(isDark ? { color: '#bdc3c7' } : {})}}>{project.description}</p>
            {expandedProject === index && (
              <div style={styles.projectDetails}>
                <p style={{...styles.projectTech, ...(isDark ? { color: '#3498db' } : {})}}><strong>Tech:</strong> {project.tech}</p>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{...styles.projectLink, ...(isDark ? { color: '#3498db' } : {})}}
                >
                  View Project →
                </a>
              </div>
            )}
            <button
              onClick={() => setExpandedProject(expandedProject === index ? null : index)}
              style={{...styles.expandBtn, ...(isDark ? styles.expandBtnDark : {})}}
            >
              {expandedProject === index ? '−' : '+'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// Goals Component
const Goals = ({ goal, isDark }) => {
  return (
    <section style={{...styles.card, ...(isDark ? styles.cardDark : {})}}>
      <h2 style={{...styles.sectionTitle, ...(isDark ? { color: '#ecf0f1', borderBottomColor: '#3498db' } : {})}}>Current Objective</h2>
      <div style={{...styles.goalBox, ...(isDark ? styles.goalBoxDark : {})}}>
        <p style={{...styles.goalText, ...(isDark ? { color: '#bdc3c7' } : {})}}>{goal}</p>
      </div>
    </section>
  );
};

// Contact Component with Social Links
const Contact = ({ phone, email, github, linkedin, twitter, isDark }) => {
  return (
    <section style={{...styles.card, ...(isDark ? styles.cardDark : {})}}>
      <h2 style={{...styles.sectionTitle, ...(isDark ? { color: '#ecf0f1', borderBottomColor: '#3498db' } : {})}}>Contact & Social</h2>
      <div style={styles.contactGrid}>
        <div style={{...styles.contactItem, ...(isDark ? { backgroundColor: '#34495e' } : {})}}>
          <span style={{...styles.contactIcon, ...(isDark ? { color: '#3498db' } : {})}}>📞</span>
          <p style={{...styles.contactLabel, ...(isDark ? { color: '#bdc3c7' } : {})}}>{phone}</p>
        </div>
        <div style={{...styles.contactItem, ...(isDark ? { backgroundColor: '#34495e' } : {})}}>
          <span style={{...styles.contactIcon, ...(isDark ? { color: '#3498db' } : {})}}>✉️</span>
          <p style={{...styles.contactLabel, ...(isDark ? { color: '#bdc3c7' } : {})}}>{email}</p>
        </div>
        <a 
          href={github} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{...styles.socialLink, ...(isDark ? { backgroundColor: '#34495e', color: '#3498db' } : {})}}
        >
          <span>🔗 GitHub</span>
        </a>
        <a 
          href={linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{...styles.socialLink, ...(isDark ? { backgroundColor: '#34495e', color: '#3498db' } : {})}}
        >
          <span>💼 LinkedIn</span>
        </a>
        <a 
          href={twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{...styles.socialLink, ...(isDark ? { backgroundColor: '#34495e', color: '#3498db' } : {})}}
        >
          <span>🐦 Twitter</span>
        </a>
      </div>
    </section>
  );
};

// Footer Component
const Footer = ({ message, isDark }) => {
  return (
    <footer style={{...styles.footer, ...(isDark ? styles.footerDark : {})}}>
      <p style={{...styles.footerText, ...(isDark ? { color: '#bdc3c7' } : {})}}>{message}</p>
    </footer>
  );
};

// Main App Component
const App = () => {
  const [isDark, setIsDark] = useState(false);

  const data = {
    header: {
      title: "Aravind",
      subtitle: "Full Stack Developer"
    },
    profile: {
      name: "Aravind",
      profession: "Full Stack Developer | React Enthusiast",
      image: "https://via.placeholder.com/150"
    },
    about: {
      intro: "I am a passionate full stack developer with 5 years of experience in building web applications. I specialize in React, Node.js, and databases. I love learning new technologies and solving complex problems through code. Always eager to take on new challenges and contribute to innovative projects."
    },
    skills: [
      "React.js",
      "JavaScript",
      "HTML & CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Git & GitHub",
      "REST APIs",
      "Python",
      "MySQL"
    ],
    experiences: [
      {
        title: "Senior Developer",
        company: "Tech Solutions Inc.",
        date: "2021 - Present",
        description: "Leading development of web applications using React and Node.js. Mentoring junior developers and improving code quality."
      },
      {
        title: "Full Stack Developer",
        company: "Digital Innovations Ltd.",
        date: "2019 - 2021",
        description: "Developed full-stack web applications using MERN stack. Collaborated with teams to deliver high-quality products."
      },
      {
        title: "Junior Developer",
        company: "StartUp Co.",
        date: "2017 - 2019",
        description: "Built responsive web interfaces and worked on backend APIs. Learned industry best practices and modern development tools."
      }
    ],
    projects: [
      {
        name: "E-Commerce Platform",
        description: "A full-featured e-commerce platform with user authentication, product listings, and payment integration.",
        tech: "React, Node.js, MongoDB, Stripe",
        link: "https://github.com"
      },
      {
        name: "Task Management App",
        description: "A collaborative task management application with real-time updates and team workspace features.",
        tech: "React, Firebase, Tailwind CSS",
        link: "https://github.com"
      },
      {
        name: "Weather Dashboard",
        description: "A real-time weather dashboard with interactive maps and detailed weather forecasts.",
        tech: "React, OpenWeather API, Chart.js",
        link: "https://github.com"
      },
      {
        name: "Blog Platform",
        description: "A modern blogging platform with markdown support, comments, and user profiles.",
        tech: "MERN Stack, Redux, PostgreSQL",
        link: "https://github.com"
      }
    ],
    goals: {
      goal: "Seeking to lead high-impact projects as a Tech Lead, mentoring teams while building scalable solutions. Interested in cloud technologies and AI integration."
    },
    contact: {
      phone: "+1 (555) 123-4567",
      email: "aravindemail.com",
      github: "https://github.com/aravind",
      linkedin: "https://linkedin.com/in/aravind",
      twitter: "https://twitter.com/aravind"
    },
    footer: {
      message: "© 2026 Aravind. All rights reserved. | Designed & Built with ❤️"
    }
  };

  return (
    <div style={{...styles.container, ...(isDark ? styles.containerDark : {})}}>
      <Header 
        title={data.header.title} 
        subtitle={data.header.subtitle}
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)}
      />
      <div style={styles.mainContent}>
        <Profile {...data.profile} isDark={isDark} />
        <About intro={data.about.intro} isDark={isDark} />
        <Skills skills={data.skills} isDark={isDark} />
        <Experience experiences={data.experiences} isDark={isDark} />
        <Projects projects={data.projects} isDark={isDark} />
        <Goals goal={data.goals.goal} isDark={isDark} />
        <Contact {...data.contact} isDark={isDark} />
      </div>
      <Footer message={data.footer.message} isDark={isDark} />
    </div>
  );
};

// CSS Styles
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    lineHeight: '1.6',
    backgroundColor: '#f5f6fa',
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    transition: 'background-color 0.3s ease'
  },
  containerDark: {
    backgroundColor: '#1a1a1a'
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ecf0f1',
    padding: '50px 20px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  headerDark: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
  },
  headerContent: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '3.5em',
    margin: '0 0 10px 0',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  subtitle: {
    fontSize: '1.3em',
    margin: 0,
    fontWeight: '300',
    opacity: 0.9
  },
  themeToggle: {
    fontSize: '1.8em',
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  themeToggleDark: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)'
  },
  mainContent: {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '0 20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    marginBottom: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease'
  },
  cardDark: {
    backgroundColor: '#2d2d2d',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  sectionTitle: {
    fontSize: '2em',
    color: '#667eea',
    borderBottom: '3px solid #667eea',
    paddingBottom: '15px',
    marginTop: 0,
    marginBottom: '20px',
    letterSpacing: '0.5px'
  },
  profileContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px'
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '4px solid #667eea',
    objectFit: 'cover',
    cursor: 'pointer'
  },
  profileName: {
    fontSize: '1.8em',
    margin: '0 0 8px 0',
    color: '#2c3e50',
    fontWeight: 'bold'
  },
  profileProfession: {
    fontSize: '1.1em',
    margin: 0,
    color: '#667eea',
    fontWeight: '500'
  },
  introText: {
    fontSize: '1.05em',
    color: '#555',
    lineHeight: '1.9',
    margin: 0
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: '2px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: '0.9em'
  },
  filterBtnActive: {
    backgroundColor: '#667eea',
    color: 'white',
    borderColor: '#667eea'
  },
  skillsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '15px',
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  skillItem: {
    backgroundColor: '#f8f9fa',
    padding: '14px 16px',
    borderRadius: '8px',
    border: '2px solid #667eea',
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.95em'
  },
  skillItemHovered: {
    backgroundColor: '#667eea',
    color: 'white',
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)'
  },
  experienceList: {
    position: 'relative'
  },
  experienceItem: {
    paddingLeft: '25px',
    marginBottom: '25px',
    borderLeft: '4px solid #667eea',
    paddingBottom: '20px'
  },
  expTitle: {
    fontSize: '1.3em',
    margin: '0 0 5px 0',
    color: '#2c3e50',
    fontWeight: 'bold'
  },
  expCompany: {
    fontSize: '1.05em',
    margin: '5px 0',
    color: '#667eea',
    fontWeight: '500'
  },
  expDate: {
    fontSize: '0.9em',
    color: '#999',
    margin: '0 0 10px 0'
  },
  expDescription: {
    fontSize: '0.95em',
    color: '#666',
    margin: 0,
    lineHeight: '1.6'
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  projectCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #667eea',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  projectCardDark: {
    backgroundColor: '#34495e',
    borderColor: '#3498db'
  },
  projectTitle: {
    fontSize: '1.2em',
    margin: '0 0 10px 0',
    color: '#667eea',
    fontWeight: 'bold'
  },
  projectDesc: {
    fontSize: '0.95em',
    color: '#666',
    margin: '0 0 10px 0',
    lineHeight: '1.6'
  },
  projectDetails: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #ddd'
  },
  projectTech: {
    fontSize: '0.85em',
    color: '#667eea',
    margin: '10px 0'
  },
  projectLink: {
    fontSize: '0.9em',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-block'
  },
  expandBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  expandBtnDark: {
    backgroundColor: '#3498db'
  },
  goalBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    borderLeft: '4px solid #667eea',
    fontStyle: 'italic'
  },
  goalBoxDark: {
    backgroundColor: '#34495e',
    borderLeftColor: '#3498db'
  },
  goalText: {
    fontSize: '1.05em',
    color: '#555',
    margin: 0,
    lineHeight: '1.8'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px'
  },
  contactItem: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #667eea',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  contactIcon: {
    fontSize: '2em',
    display: 'block',
    marginBottom: '10px'
  },
  contactLabel: {
    fontSize: '0.95em',
    margin: 0,
    color: '#666',
    wordBreak: 'break-word'
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px solid #667eea',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  footer: {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    textAlign: 'center',
    padding: '30px 20px',
    marginTop: '50px',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
  },
  footerDark: {
    backgroundColor: '#1a1a1a'
  },
  footerText: {
    margin: 0,
    fontSize: '0.95em'
  }
};

export default App;
