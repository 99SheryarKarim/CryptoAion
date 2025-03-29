"use client"
import { motion } from "framer-motion"
import "./Hero.css"
import hero from "../../../assets/hero.webp"

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" },
  }),
}

const Hero = () => {
  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
      <section className="hero">
        <div className="hero-left">
          <motion.h1 variants={textVariants} initial="hidden" animate="visible" custom={0}>
          Welcome to AION AI - The Future of Predictive Blockchain Analytics
          </motion.h1>

          <motion.p variants={textVariants} initial="hidden" animate="visible" custom={1}>
           
AION AI is a cutting-edge prediction model bot designed to revolutionize blockchain interoperability and scalability. Our advanced AI-driven platform empowers businesses and developers with accurate forecasting, explainable AI, and seamless integration capabilities.
          </motion.p>

          <div className="hero-buttons">
            <motion.button
              className="pricing-btn"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              whileHover={{ scale: 1.05, backgroundColor: "#ff7b00" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Get Started
            </motion.button>

            <motion.button
              className="download-btn"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              whileHover={{ scale: 1.05, backgroundColor: "#008aff" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Learn more
            </motion.button>
          </div>
        </div>
        <div className="hero-right">
          <motion.img
            src={hero || "/placeholder.svg?height=500&width=500"}
            alt="SAIGE AI Cryptocurrency Platform"
            className="hero-image"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          />
        </div>
      </section>
    </div>
  )
}

export default Hero

