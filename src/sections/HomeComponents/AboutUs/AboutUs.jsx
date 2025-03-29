"use client"

import { useEffect, useRef } from "react"
import "./About.css"

function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title animate-on-scroll">
            About <span className="highlight">AION AI</span>
          </h2>
          <p className="about-description animate-on-scroll" style={{ animationDelay: "0.2s" }}>
            AION AI was born from the vision to bridge the gap between complex blockchain data and actionable insights.
            Our mission is to democratize machine learning in the blockchain space, making powerful predictive analytics
            accessible to businesses of all sizes.
          </p>
        </div>

        <div className="about-content">
          <div className="about-journey">
            <h3 className="journey-title animate-on-scroll">Our Journey:</h3>
            <ul className="journey-list">
              <li className="journey-item animate-on-scroll" style={{ animationDelay: "0.2s" }}>
                <div className="journey-icon">
                  <div className="journey-icon-inner"></div>
                </div>
                <div className="journey-text">
                  <h4 className="journey-step">Founded by a team of AI and blockchain experts</h4>
                </div>
              </li>
              <li className="journey-item animate-on-scroll" style={{ animationDelay: "0.3s" }}>
                <div className="journey-icon">
                  <div className="journey-icon-inner"></div>
                </div>
                <div className="journey-text">
                  <h4 className="journey-step">Continuously evolving our models to stay ahead of market trends</h4>
                </div>
              </li>
              <li className="journey-item animate-on-scroll" style={{ animationDelay: "0.4s" }}>
                <div className="journey-icon">
                  <div className="journey-icon-inner"></div>
                </div>
                <div className="journey-text">
                  <h4 className="journey-step">Committed to transparency and ethical AI practices</h4>
                </div>
              </li>
            </ul>
          </div>

          <div className="about-team animate-on-scroll">
            <div className="team-card">
              <h3 className="team-title">Meet Our Team:</h3>
              <div className="team-members">
                <div className="team-member">
                  <div className="member-avatar"></div>
                  <div className="member-info">
                    <h4 className="member-name">[Team Member]</h4>
                    <p className="member-bio">...</p>
                  </div>
                </div>
                <div className="team-member">
                  <div className="member-avatar"></div>
                  <div className="member-info">
                    <h4 className="member-name">[Team Member]</h4>
                    <p className="member-bio">...</p>
                  </div>
                </div>
                <div className="team-member">
                  <div className="member-avatar"></div>
                  <div className="member-info">
                    <h4 className="member-name">[Team Member]</h4>
                    <p className="member-bio">...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

