"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "../Info/Info.css"

function Info() {
  const [openFAQ, setOpenFAQ] = useState(null)
  const [showQuestions, setShowQuestions] = useState(false)

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      setShowQuestions(true)
    }
  }, [inView])

  const faqData = [
    { question: "What's the difference between cryptocurrencies and stocks?", answer: "Cryptocurrencies are digital assets using blockchain technology, while stocks represent ownership in companies..." },
    { question: "How do I start investing in cryptocurrencies?", answer: "Begin by researching reputable exchanges, understanding wallet security, and starting with a small amount..." },
    { question: "What are the risks of trading stocks and cryptocurrencies?", answer: "Both markets involve volatility risk, but cryptocurrencies often experience more extreme price swings..." },
    { question: "What tax implications should I be aware of when trading?", answer: "Cryptocurrency and stock trades may be subject to capital gains tax. Consult a tax professional for personalized advice..." },
    { question: "Are cryptocurrency transactions anonymous?", answer: "Cryptocurrency transactions are pseudonymous..." },
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div ref={ref} className="faq-container">
      <h1 className="faq-heading">Frequently Asked Questions</h1>
      <p className="faq-subtitle">
        Get quick answers to common queries in our FAQ section.
      </p>

      <div className="faq-grid">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            className={`faq-item ${openFAQ === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={showQuestions ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <motion.span
                className="faq-icon"
                animate={{ rotate: openFAQ === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {openFAQ === index ? "−" : "+"}
              </motion.span>
            </div>
            <motion.div
              className="faq-answer"
              initial={{ height: 0, opacity: 0 }}
              animate={openFAQ === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <p>{faq.answer}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Info
