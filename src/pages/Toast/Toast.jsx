"use client"

import { useEffect, useState } from "react"
import "./Toast.css"

export function Toast({ message, type = "success", duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return isVisible ? (
    <div className={`toast ${type} ${isVisible ? "visible" : ""}`}>
      {type === "success" && <span className="toast-icon">✓</span>}
      {type === "error" && <span className="toast-icon">✕</span>}
      {message}
    </div>
  ) : null
}

export default Toast

