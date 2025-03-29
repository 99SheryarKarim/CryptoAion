"use client"
import { useState, useEffect } from "react"
import "./GoPro.css"

const GoPro = () => {
  const [activePlan, setActivePlan] = useState("3months")
  const [visibleFeatures, setVisibleFeatures] = useState([])
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  const proFeatures = [
    { icon: "🎯", title: "Ad-free experience", description: "Enjoy uninterrupted trading without any advertisements" },
    { icon: "🤖", title: "Advanced AI predictions", description: "Get precise predictions powered by our advanced AI algorithms" },
    { icon: "📊", title: "Multiple coins predicted", description: "Predict multiple cryptocurrencies simultaneously" },
    { icon: "📈", title: "In-depth stats analysis", description: "Access detailed statistical analysis and insights" },
    { icon: "⚡", title: "Real-time alerts", description: "Receive instant notifications for market opportunities" },
    { icon: "🎓", title: "Advanced strategies", description: "Access professional trading strategies and parameters" },
  ]

  const pricingOptions = [
    { id: "1month", duration: "1 month", price: 6.99, priceText: "$6.99/mth" },
    { id: "3months", duration: "3 months", price: 2.99, priceText: "$2.99/mth" },
    { id: "6months", duration: "6 months", price: 1.99, priceText: "$1.99/mth" },
    { id: "12months", duration: "12 months", price: 0.99, priceText: "$0.99/mth" },
  ]

  useEffect(() => {
    setIsPageLoaded(true)

    const animateFeatures = async () => {
      for (let i = 0; i < proFeatures.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setVisibleFeatures((prev) => [...prev, i])
      }
    }

    setTimeout(() => {
      animateFeatures()
    }, 300)
  }, [])

  return (
    <div className="gopro-wrapper">
      <div className="gopro-status-bar"></div>

      <div className="gopro-container">
        <div className="gopro-content">
          <div className="gopro-header">
            <div className="brand-logo-wrapper">
              <div className="brand-logo">
                <div className="logo-outer-circle"></div>
                <div className="logo-inner-bar"></div>
                <div className="logo-node node-top"></div>
                <div className="logo-node node-right"></div>
                <div className="logo-node node-left"></div>
              </div>
            </div>
            <h1 className={`gopro-title ${isPageLoaded ? "visible" : ""}`}>Go Pro now!</h1>
          </div>

          <div className="benefits-grid">
            {proFeatures.map((feature, index) => (
              <div
                key={index}
                className={`benefit-item ${visibleFeatures.includes(index) ? "visible" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="benefit-icon-wrapper">
                  <span className="benefit-icon">{feature.icon}</span>
                </div>
                <div className="benefit-details">
                  <h3 className="benefit-title">{feature.title}</h3>
                  <p className="benefit-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pricing-options">
            {pricingOptions.map((option) => (
              <button
                key={option.id}
                className={`pricing-option ${activePlan === option.id ? "active" : ""}`}
                onClick={() => setActivePlan(option.id)}
              >
                <div className="option-details">
                  <div className="option-header">
                    <span className="option-duration">{option.duration}</span>
                  </div>
                  <div className="option-price">{option.priceText}</div>
                </div>
                <div className="option-selector">
                  {activePlan === option.id && <span className="selector-check">✓</span>}
                </div>
              </button>
            ))}
          </div>

          <button className="purchase-button">
            Get Premium Access
            <span className="button-icon">→</span>
          </button>

          <p className="legal-text">By purchasing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default GoPro
