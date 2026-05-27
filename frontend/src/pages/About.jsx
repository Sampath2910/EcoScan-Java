import React from 'react'
import Navbar from '../components/Navbar'

const CORE_VALUES = [
  { 
    icon: '🌱', 
    title: 'Sustainability',
    description: 'Every feature we build prioritizes environmental impact. We measure success by the waste diverted from landfills.',
    color: '#10b981'
  },
  { 
    icon: '🤖', 
    title: 'Innovation',
    description: 'We leverage cutting-edge AI to make recycling effortless. Our ResNet-18 model achieves 95% classification accuracy.',
    color: '#3b82f6'
  },
  { 
    icon: '🤝', 
    title: 'Community',
    description: 'Connecting users with local recyclers creates a circular economy. Together, we build a cleaner future.',
    color: '#8b5cf6'
  },
  { 
    icon: '🎯', 
    title: 'Transparency',
    description: 'Full traceability from waste scan to recycled product. See exactly how your actions make a difference.',
    color: '#f59e0b'
  },
]

const FEATURES = [
  {
    icon: '📸',
    title: 'Instant Classification',
    desc: 'Snap a photo and get results in seconds'
  },
  {
    icon: '🗺️',
    title: 'Local Directory',
    desc: 'Find recycling centers near you with maps'
  },
  {
    icon: '🏆',
    title: 'Gamified Rewards',
    desc: 'Earn points and track your environmental impact'
  },
  {
    icon: '📊',
    title: 'Impact Dashboard',
    desc: 'Visualize your contribution to sustainability'
  },
  {
    icon: '🏢',
    title: 'Reclaimer Portal',
    desc: 'For recycling businesses to connect with users'
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'Your data stays secure and private'
  },
]

const TECH_STACK = [
  { category: 'Backend', items: ['Spring Boot 3', 'Java 17', 'MySQL', 'JPA/Hibernate'] },
  { category: 'Frontend', items: ['React 18', 'Vite', 'CSS3', 'React Router'] },
  { category: 'AI/ML', items: ['DJL PyTorch', 'ResNet-18', 'Computer Vision'] },
  { category: 'DevOps', items: ['Maven', 'Git', 'Docker Ready'] },
]

const TIMELINE = [
  { year: '2024', title: 'Project Inception', desc: 'EcoScan started as a vision to make recycling accessible through AI' },
  { year: '2025', title: 'AI Model Training', desc: 'Trained ResNet-18 on thousands of waste images achieving 95% accuracy' },
  { year: '2026', title: 'Platform Launch', desc: 'Released full platform with user portal, reclaimer network, and rewards system' },
  { year: 'Future', title: 'Global Expansion', desc: 'Planning to expand to more cities and add more waste categories' },
]

export default function About() {
  return (
    <div className="page about-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="hero-badge">
            <span>🌍</span>
            Our Story
          </div>
          <h1 className="about-hero-title">
            Making Recycling <span className="highlight">Smart</span> & <span className="highlight">Rewarding</span>
          </h1>
          <p className="about-hero-subtitle">
            EcoScan combines cutting-edge artificial intelligence with a passion for 
            environmental sustainability. We're building the future of waste management—
            one scan at a time.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="page-content">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">�</div>
              <h2>Our Mission</h2>
              <p>
                To democratize recycling by making it effortless, intelligent, and rewarding. 
                We believe that when technology meets environmental consciousness, 
                every individual can become a climate hero.
              </p>
            </div>
            <div className="mission-card vision">
              <div className="mission-icon">🔮</div>
              <h2>Our Vision</h2>
              <p>
                A world where zero waste is not just an aspiration but a reality. 
                Where AI-powered tools help every person make environmentally conscious 
                decisions effortlessly every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <div className="page-content">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we build</p>
          </div>
          
          <div className="values-grid">
            {CORE_VALUES.map((v, i) => (
              <div key={i} className="value-card" style={{'--value-color': v.color}}>
                <div className="value-icon-wrapper">
                  <span className="value-icon">{v.icon}</span>
                </div>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="platform-section">
        <div className="page-content">
          <div className="section-header light">
            <h2>Platform Features</h2>
            <p>Everything you need to recycle smarter</p>
          </div>
          
          <div className="platform-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="platform-card">
                <div className="platform-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="page-content">
          <div className="section-header">
            <h2>Our Journey</h2>
            <p>Milestones in our mission to revolutionize recycling</p>
          </div>
          
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-year">{t.year}</div>
                <div className="timeline-content">
                  <h4>{t.title}</h4>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section">
        <div className="page-content">
          <div className="section-header light">
            <h2>Built with Modern Technology</h2>
            <p>Powerful, scalable, and reliable stack</p>
          </div>
          
          <div className="tech-grid">
            {TECH_STACK.map((t, i) => (
              <div key={i} className="tech-category">
                <h4>{t.category}</h4>
                <div className="tech-items">
                  {t.items.map((item, j) => (
                    <span key={j} className="tech-item">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Contact CTA */}
      <section className="about-cta">
        <div className="cta-content">
          <div className="cta-icon">💚</div>
          <h2>Join the Movement</h2>
          <p>Ready to make a difference? Start scanning your waste today and be part of the solution.</p>
          <div className="cta-buttons">
            <a href="/upload" className="btn-primary btn-large">
              <span>🚀</span>
              Get Started
            </a>
            <a href="/contact" className="btn-secondary btn-large">
              <span>📧</span>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
