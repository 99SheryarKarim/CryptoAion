"use client"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "./Discover.css"
import discoverImage from "../../../assets/chip.webp" // Ensure this path is correct

const Discover = () => {
  // Hooks for intersection observer
  const { ref: leftRef, inView: leftInView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { ref: rightRef, inView: rightInView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { ref: empowerRef, inView: empowerInView } = useInView({ triggerOnce: true, threshold: 0.2 })

  // Current date for news articles
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // News categories
  const categories = {
    MARKET: "Market Analysis",
    TECH: "Technology",
    REGULATION: "Regulation",
    DEFI: "DeFi",
    BLOCKCHAIN: "Blockchain",
    MINING: "Mining",
    INVESTMENT: "Investment",
    AI: "AI & Crypto",
  }

  // News articles with metadata
  const newsArticles = [
    {
      id: 1,
      category: categories.MARKET,
      title: "Bitcoin ETFs Surpass $15 Billion in Assets Under Management",
      summary:
        "Institutional adoption accelerates as spot Bitcoin ETFs continue to attract significant capital inflows.",
      date: currentDate,
      // readTime: "3 min read",
    },
    {
      id: 2,
      category: categories.TECH,
      title: "Ethereum's Dencun Upgrade Reduces Layer-2 Transaction Costs",
      summary: "Transaction fees drop by up to 90% following the successful implementation of EIP-4844.",
      date: currentDate,
      // readTime: "4 min read",
    },
    {
      id: 3,
      category: categories.MARKET,
      title: "Stablecoin Market Cap Exceeds $160 Billion",
      summary: "Cross-border payment use cases drive growth as businesses seek faster settlement options.",
      date: currentDate,
      // readTime: "3 min read",
    },
    {
      id: 4,
      category: categories.REGULATION,
      title: "Regulatory Clarity Emerges Across Global Markets",
      summary: "37 countries now have comprehensive crypto frameworks in place, providing certainty for businesses.",
      date: currentDate,
      // readTime: "5 min read",
    },
    {
      id: 5,
      category: categories.DEFI,
      title: "DeFi TVL Grows 40% Year-to-Date",
      summary: "Total value locked reaches $95 billion across multiple blockchains as yield opportunities expand.",
      date: currentDate,
      // readTime: "4 min read",
    },
    {
      id: 6,
      category: categories.BLOCKCHAIN,
      title: "Solana Ecosystem Surpasses 2 Million Daily Active Addresses",
      summary: "High-performance blockchain continues to challenge Ethereum's dominance in the smart contract space.",
      date: currentDate,
      // readTime: "3 min read",
    },
    {
      id: 7,
      category: categories.MINING,
      title: "Bitcoin Mining Becomes Greener with Renewable Energy Push",
      summary: "52% of global hash rate now powered by renewable energy sources as miners prioritize sustainability.",
      date: currentDate,
      // readTime: "4 min read",
    },
    {
      id: 8,
      category: categories.INVESTMENT,
      title: "Real-World Asset Tokenization Market Projected to Reach $16 Trillion",
      summary: "Institutional investors driving adoption of tokenized securities, real estate, and commodities.",
      date: currentDate,
      // readTime: "5 min read",
    },
    {
      id: 9,
      category: categories.AI,
      title: "AI-Powered Trading Algorithms Outperform Traditional Strategies",
      summary: "Machine learning models show 23% better performance in volatile market conditions.",
      date: currentDate,
      // readTime: "4 min read",
    },
  ]

  return (
    <>
      {/* Discover Section */}
      <section className="discover">
        {/* Left Section - Image */}
        <motion.div
          ref={leftRef}
          className="discover-left"
          initial={{ opacity: 0, x: -50 }}
          animate={leftInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <img style={{marginTop:'80px'}} src={discoverImage || "/placeholder.svg"} alt="Discover Crypto" className="discover-image" />
        </motion.div>

        {/* Right Section - Text */}
        <motion.div
          ref={rightRef}
          className="discover-right"
          initial={{ opacity: 0, x: 50 }}
          animate={rightInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
        >
          <h2>
            Discover the Future of Finance with <span className="highlight">AION AI</span>
          </h2>

          <div className="news-container">
            {newsArticles.map((article) => (
              <div className="news-item" key={article.id}>
                <div className="news-header">
                  <span className="news-category">{article.category}</span>
                  <div className="news-meta">
                    {/* <span className="news-date">{article.date}</span> */}
                    {/* <span className="news-dot">•</span> */}
                    {/* <span className="news-read-time">{article.readTime}</span> */}
                  </div>
                </div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-summary">{article.summary}</p>
                <div className="news-footer">
                  {/* <button className="news-read-more">Read More</button> */}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Crypto Section */}
      <section className="crypto">
        <motion.div
          ref={empowerRef}
          className="empower"
          initial={{ opacity: 0, y: 50 }}
          animate={empowerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <h1>
            Empowering Your Cryptocurrency <br /> Journey
          </h1>
        </motion.div>
      </section>

      {/* Video Section */}
      <div className="animvideo">
        <video width="100%" height="auto" autoPlay loop muted playsInline>
          <source src="64b0e26d47182da9cb63e551_-ebb1-4a54-ad70-1c3c8ebd2d34-transcode.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  )
}

export default Discover

