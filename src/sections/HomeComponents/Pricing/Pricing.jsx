"use client";

import { Check, X } from 'lucide-react';
import { useState } from "react";
import { motion } from "framer-motion";
import "./Pricing.css";

export default function Pricing() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const plans = [
    {
      name: "Basic",
      description: "Beginner-friendly with standard trading and basic portfolio tools.",
      price: "$9.00",
      features: [
        { name: "Real-time market data", included: true },
        { name: "Basic portfolio tracking", included: true },
        { name: "Limited customer support", included: true },
        { name: "24/7 customer support", included: false },
        { name: "Access research reports", included: false },
      ],
    },
    {
      name: "Standard",
      description: "Enhanced trading tools, analytics, and 24/7 chat support.",
      price: "$19.00",
      features: [
        { name: "Real-time market data", included: true },
        { name: "Basic portfolio tracking", included: true },
        { name: "Limited customer support", included: true },
        { name: "24/7 customer support", included: true },
        { name: "Access research reports", included: false },
      ],
    },
    {
      name: "Premium",
      description: "Top-tier features, advanced analytics, and priority support.",
      price: "$29.00",
      features: [
        { name: "Real-time market data", included: true },
        { name: "Basic portfolio tracking", included: true },
        { name: "Limited customer support", included: true },
        { name: "24/7 customer support", included: true },
        { name: "Access research reports", included: true },
      ],
    },
  ];

  return (
    <motion.div 
      className="pricing-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="content">
        <h2>Why Choose Us?</h2>
        <p>
          We provide cutting-edge solutions tailored to your needs, ensuring efficiency, reliability, and innovation.
        </p>
      </div>

      <div className="pricing-container">
        <motion.div 
          className="pricing-grid"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="pricing-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.2 }}
              viewport={{ once: true }}
              style={{
                transform: hoveredCard === index ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hoveredCard === index
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-content">
                <h2 className="plan-name">{plan.name}</h2>
                <p className="plan-description">{plan.description}</p>

                <div className="price-container">
                  <span className="price">{plan.price}</span>
                  <span className="price-period">/Month</span>
                </div>

                <div className="divider"></div>

                <ul className="feature-list">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="feature-item">
                      <div className={`icon-container ${feature.included ? "included" : "excluded"}`}>
                        {feature.included ? <Check className="icon" /> : <X className="icon" />}
                      </div>
                      <span className="feature-text">{feature.name}</span>
                    </li>
                  ))}
                </ul>

                <div className="divider"></div>

                <button className="get-started-button">Get Started</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
