"use client"

import { useEffect, useState } from "react"
import "../Loader/Loader.css"

const Loader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((prev) => Math.min(prev + 1, 100))
      } else {
        onLoadingComplete()
      }
    }, 30)

    return () => clearTimeout(timer)
  }, [progress, onLoadingComplete])

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="logo-container">
          {/* Use a normal <img> tag since Vite doesn't support next/image */}
          <img src="/logoooo.png" alt="AION-AI Logo" width={100} height={100} className="crypto-logo" />
        </div>

        <h1 className="loader-title">AION-AI</h1>

        <div className="loader-subtitle">Professional Trading Solutions</div>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            <div className="progress-glow"></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        <div className="loader-blocks">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="loader-block"
              style={{
                opacity: progress > index * 16 ? 1 : 0.2,
                transform: progress > index * 16 ? "translateY(0)" : "translateY(10px)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loader
