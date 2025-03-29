"use client"

import { useEffect, useRef } from "react"
import "./WhyChoose.css"

function WhyChoose() {
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

  const features = [
    {
      title: "Unparalleled Accuracy",
      description: "Our advanced machine learning algorithms provide industry-leading prediction accuracy.",
    },
    {
      title: "Transparency",
      description: "With Explainable AI (XAI), understand the 'why' behind every prediction.",
    },
    {
      title: "Ease of Use",
      description: "Our low-code/no-code approach makes AI accessible to all, regardless of technical expertise.",
    },
    {
      title: "Comprehensive Solution",
      description: "From data ingestion to model deployment, we cover the entire AI lifecycle.",
    },
    {
      title: "Scalability",
      description: "Built to handle high-volume data processing and analysis for blockchain networks.",
    },
    {
      title: "Customization",
      description: "Tailor our models to your specific business needs and use cases.",
    },
  ]

  return (
    <section id="why-choose" ref={sectionRef} className="why-choose-section">
      {/* Background Elements */}
      <div className="why-choose-bg">
        <div className="why-choose-bg-circle-1"></div>
        <div className="why-choose-bg-circle-2"></div>
      </div>

      <div className="why-choose-container">
        <div className="why-choose-header">
          <h2 className="why-choose-title animate-on-scroll">
            Why Choose <span className="highlight">AION AI</span>?
          </h2>
          <p className="why-choose-description animate-on-scroll" style={{ animationDelay: "0.2s" }}>
            Choose AION AI for a future-proof, intelligent blockchain analytics solution.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card animate-on-scroll"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                    stroke="#22D3EE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 4L12 14.01L9 11.01"
                    stroke="#22D3EE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChoose

