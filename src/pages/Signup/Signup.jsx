"use client"

import { useState } from "react"
import "./Signup.css"
import { useDispatch } from "react-redux"
import { Register } from "../../RTK/Slices/AuthSlice"

const Signup = () => {
  const dispatch = useDispatch();
     function register(){
      
     }


  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields")
      setLoading(false)
      return

    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Simulate API call
    // setTimeout(() => {
    //   console.log("Form submitted:", formData)
    //   setLoading(false)
    //   // Redirect to dashboard or show success message
    // }, 1500)
console.log(formData)

    dispatch(Register(formData))



  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError("")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo">
              <div className="logo-circle"></div>
              <div className="logo-line"></div>
              <div className="logo-dot dot-1"></div>
              <div className="logo-dot dot-2"></div>
              <div className="logo-dot dot-3"></div>
            </div>
          </div>
          <h1>AION AI</h1>
          <p className="tagline">Your Intelligent Crypto Assistant</p>
        </div>

        <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}

          {isLogin && (
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <div className="button-loader"></div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="toggle-button" onClick={toggleAuthMode}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        <div className="social-auth">
          <div className="divider">
            <span>OR</span>
          </div>
          <button className="social-button google">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Continue with Google
          </button>
          <button className="social-button apple">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M16.498 0c.326 0 .662.088.957.283.296.195.495.452.598.77.103.318.152.65.152.994 0 .344-.05.676-.15.994-.1.318-.298.575-.594.77-.296.195-.631.293-1.005.293-.374 0-.71-.098-1.006-.293-.296-.195-.495-.452-.598-.77-.103-.318-.152-.65-.152-.994 0-.344.05-.676.15-.994.1-.318.298-.575.594-.77C15.74.088 16.075 0 16.4 0h.098zM8.502 24c-.7 0-1.377-.14-2.03-.422-.654-.281-1.257-.703-1.81-1.266-.552-.562-.984-1.17-1.295-1.826-.311-.656-.467-1.311-.467-1.967 0-.708.159-1.377.477-2.008.318-.63.73-1.193 1.235-1.687.505-.495 1.064-.888 1.678-1.18.614-.292 1.208-.437 1.781-.437.573 0 1.128.13 1.664.39.536.261 1.005.62 1.406 1.078V8.96c0-.177.032-.334.096-.47a1.1 1.1 0 0 1 .639-.622c.15-.65.318-.098.503-.098.185 0 .352.033.503.098a1.1 1.1 0 0 1 .639.622c.64.136.96.293.96.47v11.076c0 .177-.32.334-.96.47a1.1 1.1 0 0 1-.639.622 1.068 1.068 0 0 1-.503.098c-.185 0-.353-.033-.503-.098a1.1 1.1 0 0 1-.639-.622 1.063 1.063 0 0 1-.096-.47v-.566a3.951 3.951 0 0 1-1.406 1.078c-.536.26-1.091.39-1.664.39H8.5zm.574-2.52c.796 0 1.493-.24 2.092-.719.598-.479 1.023-1.14 1.274-1.982.064-.24.127-.37.19-.39.064-.21.127-.31.19-.31.064 0 .127.01.19.31.064.2.127.15.19.39.252.843.677 1.503 1.275 1.982.599.48 1.296.719 2.092.719h.383c.326 0 .614-.088.863-.264.25-.177.446-.407.59-.692.143-.286.215-.592.215-.918 0-.328-.072-.634-.215-.919a1.699 1.699 0 0 0-.59-.692 1.558 1.558 0 0 0-.863-.264h-.383c-.391 0-.756-.098-1.093-.293a2.044 2.044 0 0 1-.797-.8 2.203 2.203 0 0 1-.293-1.12c0-.422.098-.809.293-1.16.196-.35.463-.628.8-.83.337-.203.7-.305 1.09-.305h.383c.326 0 .614.088.863.264.25.176.446.407.59.692.143.286.215.591.215.918 0 .328-.072.634-.215.92a1.699 1.699 0 0 1-.59.691 1.558 1.558 0 0 1-.863.264h-.383c-.391 0-.756.098-1.093.293a2.044 2.044 0 0 0-.797.8 2.203 2.203 0 0 0-.293 1.12c0 .422.098.809.293 1.16.196.35.463.628.8.83.337.203.7.305 1.09.305h.383c.326 0 .614-.088.863-.264.25-.177.446-.407.59-.692.143-.286.215-.592.215-.918 0-.328-.072-.634-.215-.919a1.699 1.699 0 0 0-.59-.692 1.558 1.558 0 0 0-.863-.264h-.383c-.391 0-.756-.098-1.093-.293a2.044 2.044 0 0 1-.797-.8 2.203 2.203 0 0 1-.293-1.12c0-.422.098-.809.293-1.16.196-.35.463-.628.8-.83.337-.203.7-.305 1.09-.305h.383c.326 0 .614.088.863.264.25.176.446.407.59.692.143.286.215.591.215.918 0 .328-.072.634-.215.92a1.699 1.699 0 0 1-.59.691 1.558 1.558 0 0 1-.863.264h-.383c-.391 0-.756.098-1.093.293a2.044 2.044 0 0 0-.797.8 2.203 2.203 0 0 0-.293 1.12c0 .422.098.809.293 1.16.196.35.463.628.8.83.337.203.7.305 1.09.305h.383z"
              />
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>

      <div className="auth-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
    </div>
  )
}

export default Signup
