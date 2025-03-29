import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import Home from "./pages/Home"
import ContactUs from "./pages/ContactUs/Contact"
import Coins from "./pages/Coins/Coins"
import Predict from "./pages/Predict/Predict"
import GoPro from "./pages/GoPro/GoPro"
import Portfolio from "./pages/Portfolio/Portfolio"
import Signup from "./pages/Signup/Signup"
import Info from "./pages/Info/Info"
import Services from "./sections/HomeComponents/Services/Services"
import About from "./sections/HomeComponents/AboutUs/AboutUs"
import Header from "./pages/Header/Header"
import Loader from "./sections/HomeComponents/Loader/Loader"

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.body.style.overflow = "hidden" // Prevent scrolling while loading

    setTimeout(() => {
      setLoading(false)
      document.body.style.overflow = "auto" // Re-enable scrolling
    }, 2000) 
  }, []) 

  if (loading) {
    return <Loader />
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/gopro" element={<GoPro />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/info" element={<Info />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
