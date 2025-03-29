"use client"

import { useState } from "react"
import "./Contact.css"

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({
      name: "",
      email: "",
      contactNo: "",
      message: "",
    })
    alert("Thank you for your message. We will get back to you shortly!")
  }

  return (
    <div className="contact-container">
      <div className="contact-wrapper">
        <h1 className="contact-title">Get in Touch with AION AI</h1>
        <p className="contact-subtitle">
          Reach out to us for any inquiries, feedback, or assistance. We're here to help you navigate the world of cryptocurrency.
        </p>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Let's Start Working Together</h2>
            <p>Whether you have questions or need support, our team is ready to assist.</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">🏠</span>
                <span className="contact-text">support@aionai.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-text">+1 (888) AI-AION-1</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span className="contact-text"> Available 24/7 on our website</span>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h3>Get In Touch</h3>
            <p>Share your details and message, and our team will get back to you promptly.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="contactNo">Contact No</label>
                <input type="tel" id="contactNo" name="contactNo" value={formData.contactNo} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
