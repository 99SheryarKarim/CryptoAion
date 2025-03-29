"use client"

import { useEffect, useRef, useState } from "react"
import "./Services.css"

function Services() {
  const sectionRef = useRef(null)
  const [activeTab, setActiveTab] = useState("predictive")

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

  const services = [
    {
      id: "predictive",
      title: "Predictive Modeling",
      items: [
        { icon: "chart-bar", text: "Classification and regression analysis" },
        { icon: "clock", text: "Time series forecasting" },
        { icon: "alert-triangle", text: "Anomaly detection (e.g., game bot detection)" },
      ],
    },
    {
      id: "xai",
      title: "Explainable AI (XAI) Solutions",
      items: [
        { icon: "lightbulb", text: "LIME and SHAP implementations" },
        { icon: "database", text: "Custom explanation generators for complex models" },
      ],
    },
    {
      id: "lifecycle",
      title: "AI Lifecycle Management",
      items: [
        { icon: "layers", text: "Data exploration and transformation" },
        { icon: "code", text: "Model training and optimization" },
        { icon: "zap", text: "Deployment and monitoring (MLOps)" },
      ],
    },
    {
      id: "lowcode",
      title: "Low-Code/No-Code Platform",
      items: [
        { icon: "zap", text: "Intuitive interface for model building" },
        { icon: "database", text: "Automated feature engineering" },
      ],
    },
    {
      id: "integration",
      title: "Integration Services",
      items: [
        { icon: "link", text: "Seamless connection with various data sources" },
        { icon: "cloud", text: "Integration with major cloud platforms" },
      ],
    },
    {
      id: "consulting",
      title: "Consulting and Support",
      items: [
        { icon: "message-square", text: "AI strategy development" },
        { icon: "tool", text: "Custom model design and implementation" },
      ],
    },
  ]

  const getIcon = (iconName) => {
    switch (iconName) {
      case "chart-bar":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="3"
              y="12"
              width="6"
              height="8"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="9"
              y="8"
              width="6"
              height="12"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="15"
              y="4"
              width="6"
              height="16"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "clock":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6V12L16 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "alert-triangle":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.6415 19.6871 1.81442 19.9905C1.98734 20.2939 2.23672 20.5467 2.53773 20.7238C2.83875 20.9009 3.18058 20.9962 3.53 21H20.47C20.8194 20.9962 21.1613 20.9009 21.4623 20.7238C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case "lightbulb":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 22H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M15.09 14C15.7 13.4 16.24 12.74 16.58 12C17.7 9.67 16.96 6.94 15 5.25C13.04 3.56 10.19 3.12 7.91 4.25C5.63 5.38 4.26 7.96 4.59 10.58C4.81 12.22 5.63 13.72 6.88 14.76C7.34 15.15 7.76 15.59 8.13 16.07C8.5 16.55 8.75 17 9 17.5H15C14.7 17.01 14.42 16.52 14.13 16.07C13.84 15.62 13.53 15.15 15.09 14Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "database":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse
              cx="12"
              cy="5"
              rx="9"
              ry="3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12C21 13.66 16.97 15 12 15C7.03 15 3 13.66 3 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 5V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "layers":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "code":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 18L22 12L16 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 6L2 12L8 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "zap":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "link":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 13C10.4295 13.5741 10.9774 14.0492 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6898C16.4231 14.4392 17.0331 14.0471 17.54 13.54L20.54 10.54C21.4774 9.59763 22.0074 8.32368 22.0074 7.00001C22.0074 5.67634 21.4774 4.40239 20.54 3.46001C19.6026 2.51763 18.3287 1.98755 17.005 1.98755C15.6813 1.98755 14.4074 2.51763 13.47 3.46001L11.75 5.17001"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11C13.5705 10.4259 13.0226 9.95082 12.3935 9.60706C11.7643 9.2633 11.0685 9.05889 10.3534 9.00768C9.63821 8.95646 8.92041 9.05964 8.24866 9.31023C7.5769 9.56082 6.96689 9.95294 6.46 10.46L3.46 13.46C2.52263 14.4024 1.99255 15.6763 1.99255 17C1.99255 18.3237 2.52263 19.5976 3.46 20.54C4.40239 21.4774 5.67634 22.0075 7.00001 22.0075C8.32368 22.0075 9.59763 21.4774 10.54 20.54L12.26 18.82"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "cloud":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 10H16.74C16.3659 8.551 15.5928 7.23599 14.5086 6.2193C13.4245 5.20261 12.0727 4.52799 10.6069 4.28824C9.14112 4.04848 7.63307 4.25626 6.28029 4.88612C4.9275 5.51598 3.79014 6.53894 3.0127 7.81843C2.23527 9.09792 1.85519 10.5765 1.92311 12.0686C1.99103 13.5607 2.50413 14.9953 3.39017 16.1932C4.27622 17.3911 5.49937 18.3007 6.89999 18.8123C8.30062 19.3239 9.81985 19.4148 11.27 19.07"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 16.92C22 18.0705 21.5523 19.1734 20.7552 19.9706C19.9581 20.7677 18.8551 21.2154 17.7046 21.2154C16.5541 21.2154 15.4512 20.7677 14.654 19.9706C13.8569 19.1734 13.4092 18.0705 13.4092 16.92C13.4092 13.4 17.7046 10.26 17.7046 10.26C17.7046 10.26 22 13.4 22 16.92Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "message-square":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "tool":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.7 6.30001C14.5132 6.48694 14.4125 6.73826 14.4125 7.00001C14.4125 7.26176 14.5132 7.51308 14.7 7.70001L16.3 9.30001C16.4869 9.48694 16.7382 9.58773 17 9.58773C17.2617 9.58773 17.5131 9.48694 17.7 9.30001L21.47 5.53001C21.9728 6.6412 22.1252 7.87247 21.9065 9.06937C21.6878 10.2663 21.1087 11.3783 20.2463 12.2407C19.3838 13.1032 18.2718 13.6823 17.0749 13.9009C15.878 14.1196 14.6467 13.9672 13.5355 13.4644L6.80001 20.2C6.61308 20.3869 6.36176 20.4877 6.10001 20.4877C5.83826 20.4877 5.58694 20.3869 5.40001 20.2L3.80001 18.6C3.61308 18.4131 3.51229 18.1618 3.51229 17.9C3.51229 17.6383 3.61308 17.3869 3.80001 17.2L10.5355 10.4644C10.0328 9.35325 9.88036 8.12198 10.099 6.92508C10.3177 5.72818 10.8968 4.61618 11.7593 3.75373C12.6217 2.89128 13.7337 2.31221 14.9306 2.09355C16.1275 1.87489 17.3588 2.02732 18.47 2.53001L14.71 6.29001L14.7 6.30001Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <section id="services" ref={sectionRef} className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title animate-on-scroll">
            Our <span className="highlight">Services</span>
          </h2>
        </div>

        <div className="services-tabs animate-on-scroll">
          <div className="tabs-header">
            {services.map((service) => (
              <button
                key={service.id}
                className={`tab-button ${activeTab === service.id ? "active" : ""}`}
                onClick={() => setActiveTab(service.id)}
              >
                {service.title}
              </button>
            ))}
          </div>

          <div className="tabs-content">
            {services.map((service) => (
              <div key={service.id} className={`tab-panel ${activeTab === service.id ? "active" : ""}`}>
                <h3 className="panel-title">{service.title}</h3>
                <ul className="panel-list">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="panel-item">
                      <div className="item-icon">{getIcon(item.icon)}</div>
                      <span className="item-text">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services

