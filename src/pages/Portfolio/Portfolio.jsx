"use client"

import { useState, useEffect, useRef } from "react"
import "./Portfolio.css"

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAddAssetModal, setShowAddAssetModal] = useState(false)
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [portfolioChange, setPortfolioChange] = useState(0)
  const [assets, setAssets] = useState([])
  const [chartData, setChartData] = useState([])
  const [selectedTimeframe, setSelectedTimeframe] = useState("1W")
  const chartRef = useRef(null)
  const allocationChartRef = useRef(null)

  // Mock data for portfolio assets
  const mockAssets = [
    { id: 1, name: "Bitcoin", symbol: "BTC", amount: 0.5, value: 28500, change: 2.4, color: "#F7931A" },
    { id: 2, name: "Ethereum", symbol: "ETH", amount: 3.2, value: 6200, change: -1.2, color: "#627EEA" },
    { id: 3, name: "Solana", symbol: "SOL", amount: 25, value: 2750, change: 5.7, color: "#00FFA3" },
    { id: 4, name: "Apple Inc.", symbol: "AAPL", amount: 10, value: 1850, change: 0.8, color: "#A2AAAD" },
    { id: 5, name: "Tesla", symbol: "TSLA", amount: 5, value: 1200, change: -2.1, color: "#CC0000" },
  ]

  // Mock data for portfolio performance
  const generateMockChartData = (timeframe) => {
    const data = []
    let days = 7

    switch (timeframe) {
      case "1D":
        days = 1
        break
      case "1W":
        days = 7
        break
      case "1M":
        days = 30
        break
      case "3M":
        days = 90
        break
      case "1Y":
        days = 365
        break
      case "ALL":
        days = 730
        break
      default:
        days = 7
    }

    let value = 35000
    const now = new Date()

    for (let i = days; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Add some randomness to the value
      const change = (Math.random() - 0.45) * 500
      value += change

      data.push({
        date: date.toISOString().split("T")[0],
        value: value,
      })
    }

    return data
  }

  // Initialize data on component mount
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setAssets(mockAssets)
      setChartData(generateMockChartData(selectedTimeframe))

      // Calculate total portfolio value and change
      const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0)
      const weightedChange = mockAssets.reduce((sum, asset) => sum + asset.change * (asset.value / totalValue), 0)

      setPortfolioValue(totalValue)
      setPortfolioChange(weightedChange)

      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Update chart data when timeframe changes
  useEffect(() => {
    if (isLoaded) {
      setChartData(generateMockChartData(selectedTimeframe))
    }
  }, [selectedTimeframe, isLoaded])

  // Draw performance chart
  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      const canvas = chartRef.current
      const ctx = canvas.getContext("2d")

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set dimensions
      const width = canvas.width
      const height = canvas.height

      // Find min and max values for scaling
      const values = chartData.map((item) => item.value)
      const minValue = Math.min(...values) * 0.95
      const maxValue = Math.max(...values) * 1.05
      const valueRange = maxValue - minValue

      // Draw chart
      ctx.beginPath()
      ctx.moveTo(0, height - ((chartData[0].value - minValue) / valueRange) * height)

      chartData.forEach((item, index) => {
        const x = (index / (chartData.length - 1)) * width
        const y = height - ((item.value - minValue) / valueRange) * height
        ctx.lineTo(x, y)
      })

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "rgba(62, 184, 176, 0.8)")
      gradient.addColorStop(1, "rgba(62, 184, 176, 0.1)")

      // Draw line
      ctx.strokeStyle = "#3eb8b0"
      ctx.lineWidth = 3
      ctx.stroke()

      // Fill area under the line
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()
    }
  }, [chartData])

  // Draw allocation chart
  useEffect(() => {
    if (allocationChartRef.current && assets.length > 0) {
      const canvas = allocationChartRef.current
      const ctx = canvas.getContext("2d")

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set dimensions
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(centerX, centerY) * 0.8

      // Calculate total value
      const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)

      // Draw pie chart
      let startAngle = 0

      assets.forEach((asset) => {
        const sliceAngle = (asset.value / totalValue) * 2 * Math.PI

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()

        ctx.fillStyle = asset.color
        ctx.fill()

        startAngle += sliceAngle
      })

      // Draw center circle (donut hole)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
      ctx.fillStyle = "#1c2030"
      ctx.fill()
    }
  }, [assets])

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  // Educational resources data
  const educationalResources = [
    {
      id: 1,
      title: "Diversification 101: Balancing Risk and Reward",
      description: "Learn how to build a balanced portfolio that minimizes risk while maximizing potential returns.",
      readTime: "8 min read",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 2,
      title: "Dollar-Cost Averaging vs. Lump Sum Investing: Pros and Cons",
      description:
        "Explore different investment strategies and find out which approach works best for your financial goals.",
      readTime: "10 min read",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 3,
      title: "Tax-Efficient Investing Strategies for Crypto and Stocks",
      description:
        "Optimize your investment returns by understanding the tax implications of different assets and accounts.",
      readTime: "12 min read",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 4,
      title: "Understanding Market Cycles: When to Buy and When to Sell",
      description: "Learn to recognize market patterns and make informed decisions about timing your investments.",
      readTime: "9 min read",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 5,
      title: "Risk Management: Protecting Your Portfolio in Volatile Markets",
      description:
        "Discover strategies to safeguard your investments during market downturns and high volatility periods.",
      readTime: "11 min read",
      image: "/placeholder.svg?height=200&width=350",
    },
  ]

  return (
    <div className="portfolio-container">
      {!isLoaded ? (
        <div className="portfolio-loading">
          <div className="loading-spinner"></div>
          <p>Loading your financial dashboard...</p>
        </div>
      ) : (
        <>
          <header className="portfolio-header">
            <h1 className="portfolio-title">Portfolio</h1>
            <p className="portfolio-subtitle">Your Personal Financial Command Center</p>

            <div className="portfolio-summary">
              <div className="portfolio-value">
                <h2>{formatCurrency(portfolioValue)}</h2>
                <span className={`portfolio-change ${portfolioChange >= 0 ? "positive" : "negative"}`}>
                  {formatPercentage(portfolioChange)} Today
                </span>
              </div>
              <button className="add-asset-button" onClick={() => setShowAddAssetModal(true)}>
                + Add Asset
              </button>
            </div>
          </header>

          <nav className="portfolio-tabs">
            <button
              className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => handleTabChange("overview")}
            >
              Overview
            </button>
            <button
              className={`tab-button ${activeTab === "assets" ? "active" : ""}`}
              onClick={() => handleTabChange("assets")}
            >
              Assets
            </button>
            <button
              className={`tab-button ${activeTab === "insights" ? "active" : ""}`}
              onClick={() => handleTabChange("insights")}
            >
              Insights
            </button>
            <button
              className={`tab-button ${activeTab === "education" ? "active" : ""}`}
              onClick={() => handleTabChange("education")}
            >
              Education
            </button>
          </nav>

          <main className="portfolio-content">
            {activeTab === "overview" && (
              <div className="overview-tab">
                <section className="performance-section">
                  <div className="section-header">
                    <h2>Portfolio Performance</h2>
                    <div className="timeframe-selector">
                      {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((timeframe) => (
                        <button
                          key={timeframe}
                          className={`timeframe-button ${selectedTimeframe === timeframe ? "active" : ""}`}
                          onClick={() => setSelectedTimeframe(timeframe)}
                        >
                          {timeframe}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="chart-container">
                    <canvas ref={chartRef} width="800" height="300"></canvas>
                  </div>
                </section>

                <div className="overview-grid">
                  <section className="allocation-section">
                    <h2>Asset Allocation</h2>
                    <div className="allocation-chart-container">
                      <canvas ref={allocationChartRef} width="300" height="300"></canvas>
                    </div>
                    <div className="allocation-legend">
                      {assets.map((asset) => (
                        <div key={asset.id} className="legend-item">
                          <span className="legend-color" style={{ backgroundColor: asset.color }}></span>
                          <span className="legend-name">{asset.name}</span>
                          <span className="legend-value">{((asset.value / portfolioValue) * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="top-performers-section">
                    <h2>Top Performers</h2>
                    <div className="performers-list">
                      {assets
                        .sort((a, b) => b.change - a.change)
                        .slice(0, 3)
                        .map((asset) => (
                          <div key={asset.id} className="performer-item">
                            <div className="performer-info">
                              <span className="performer-symbol">{asset.symbol}</span>
                              <span className="performer-name">{asset.name}</span>
                            </div>
                            <span className={`performer-change ${asset.change >= 0 ? "positive" : "negative"}`}>
                              {formatPercentage(asset.change)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </section>

                  <section className="alerts-section">
                    <h2>Alerts & Notifications</h2>
                    <div className="alerts-list">
                      <div className="alert-item">
                        <div className="alert-icon price-alert"></div>
                        <div className="alert-content">
                          <h3>Price Alert</h3>
                          <p>Bitcoin (BTC) is up 5% in the last 24 hours</p>
                        </div>
                      </div>
                      <div className="alert-item">
                        <div className="alert-icon news-alert"></div>
                        <div className="alert-content">
                          <h3>News Alert</h3>
                          <p>New regulations announced for cryptocurrency exchanges</p>
                        </div>
                      </div>
                      <div className="alert-item">
                        <div className="alert-icon portfolio-alert"></div>
                        <div className="alert-content">
                          <h3>Portfolio Alert</h3>
                          <p>Your portfolio has reached your target value of $35,000</p>
                        </div>
                      </div>
                    </div>
                    <button className="manage-alerts-button">Manage Alerts</button>
                  </section>

                  <section className="quick-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-grid">
                      <button className="quick-action-button">
                        <div className="action-icon buy-icon"></div>
                        <span>Buy</span>
                      </button>
                      <button className="quick-action-button">
                        <div className="action-icon sell-icon"></div>
                        <span>Sell</span>
                      </button>
                      <button className="quick-action-button">
                        <div className="action-icon transfer-icon"></div>
                        <span>Transfer</span>
                      </button>
                      <button className="quick-action-button">
                        <div className="action-icon alert-icon"></div>
                        <span>Set Alert</span>
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {activeTab === "assets" && (
              <div className="assets-tab">
                <div className="assets-header">
                  <h2>Your Assets</h2>
                  <div className="assets-actions">
                    <button className="filter-button">Filter</button>
                    <button className="sort-button">Sort</button>
                    <button className="add-asset-button" onClick={() => setShowAddAssetModal(true)}>
                      + Add Asset
                    </button>
                  </div>
                </div>

                <div className="assets-table-container">
                  <table className="assets-table">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Amount</th>
                        <th>Price</th>
                        <th>Value</th>
                        <th>24h Change</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map((asset) => (
                        <tr key={asset.id} className="asset-row">
                          <td className="asset-name-cell">
                            <div className="asset-icon" style={{ backgroundColor: asset.color }}></div>
                            <div className="asset-name-info">
                              <span className="asset-name">{asset.name}</span>
                              <span className="asset-symbol">{asset.symbol}</span>
                            </div>
                          </td>
                          <td>{asset.amount}</td>
                          <td>{formatCurrency(asset.value / asset.amount)}</td>
                          <td>{formatCurrency(asset.value)}</td>
                          <td className={`change-cell ${asset.change >= 0 ? "positive" : "negative"}`}>
                            {formatPercentage(asset.change)}
                          </td>
                          <td className="actions-cell">
                            <button className="asset-action-button">Buy</button>
                            <button className="asset-action-button">Sell</button>
                            <button className="asset-action-button more-button">•••</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <section className="track-investments-section">
                  <h2>Track Your Investments</h2>
                  <div className="features-grid">
                    <div className="feature-card">
                      <div className="feature-icon add-holdings-icon"></div>
                      <h3>Add Your Holdings</h3>
                      <p>Add your cryptocurrency and stock holdings to track your entire portfolio in one place.</p>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon real-time-icon"></div>
                      <h3>Real-Time Tracking</h3>
                      <p>View real-time portfolio value and performance with automatic price updates.</p>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon alerts-icon"></div>
                      <h3>Custom Alerts</h3>
                      <p>Set custom alerts for price movements, news, and important market events.</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "insights" && (
              <div className="insights-tab">
                <section className="insights-header-section">
                  <h2>Portfolio Insights</h2>
                  <p>Advanced analytics to help you make informed investment decisions</p>
                </section>

                <div className="insights-grid">
                  <section className="allocation-insights-section">
                    <h2>Asset Allocation</h2>
                    <div className="allocation-chart-container">
                      <canvas ref={allocationChartRef} width="300" height="300"></canvas>
                    </div>
                    <div className="allocation-analysis">
                      <h3>Analysis</h3>
                      <p>
                        Your portfolio is well-diversified across different asset classes, with a healthy balance
                        between cryptocurrencies and stocks.
                      </p>
                      <div className="recommendation">
                        <h4>Recommendation</h4>
                        <p>Consider adding some fixed-income assets to further reduce volatility.</p>
                      </div>
                    </div>
                  </section>

                  <section className="risk-assessment-section">
                    <h2>Risk Assessment</h2>
                    <div className="risk-meter-container">
                      <div className="risk-meter">
                        <div className="risk-indicator" style={{ left: "65%" }}></div>
                        <div className="risk-labels">
                          <span>Low</span>
                          <span>Moderate</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                    <div className="risk-details">
                      <div className="risk-detail-item">
                        <h3>Volatility</h3>
                        <div className="risk-bar">
                          <div className="risk-fill" style={{ width: "70%" }}></div>
                        </div>
                        <p>Your portfolio has higher than average volatility due to cryptocurrency holdings.</p>
                      </div>
                      <div className="risk-detail-item">
                        <h3>Correlation</h3>
                        <div className="risk-bar">
                          <div className="risk-fill" style={{ width: "45%" }}></div>
                        </div>
                        <p>Assets show moderate correlation, providing some diversification benefits.</p>
                      </div>
                      <div className="risk-detail-item">
                        <h3>Concentration</h3>
                        <div className="risk-bar">
                          <div className="risk-fill" style={{ width: "55%" }}></div>
                        </div>
                        <p>Portfolio has moderate concentration in top holdings.</p>
                      </div>
                    </div>
                  </section>

                  <section className="performance-insights-section">
                    <h2>Performance Analysis</h2>
                    <div className="performance-metrics">
                      <div className="metric-card">
                        <h3>YTD Return</h3>
                        <span className="metric-value positive">+18.7%</span>
                        <p>vs. S&P 500: +12.3%</p>
                      </div>
                      <div className="metric-card">
                        <h3>1-Year Return</h3>
                        <span className="metric-value positive">+32.4%</span>
                        <p>vs. S&P 500: +24.1%</p>
                      </div>
                      <div className="metric-card">
                        <h3>Sharpe Ratio</h3>
                        <span className="metric-value">1.8</span>
                        <p>Above average risk-adjusted return</p>
                      </div>
                    </div>
                    <div className="performance-chart-container">
                      <canvas ref={chartRef} width="800" height="300"></canvas>
                    </div>
                  </section>

                  <section className="opportunities-section">
                    <h2>Investment Opportunities</h2>
                    <div className="opportunities-list">
                      <div className="opportunity-card">
                        <h3>Rebalancing Opportunity</h3>
                        <p>
                          Your Bitcoin allocation has grown to 40% of your portfolio. Consider rebalancing to maintain
                          your target allocation.
                        </p>
                        <button className="opportunity-action-button">Rebalance</button>
                      </div>
                      <div className="opportunity-card">
                        <h3>Tax-Loss Harvesting</h3>
                        <p>
                          You have potential tax-loss harvesting opportunities with Tesla stock that could offset
                          capital gains.
                        </p>
                        <button className="opportunity-action-button">View Details</button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="education-tab">
                <section className="education-header-section">
                  <h2>Educational Resources</h2>
                  <p>Expand your investment knowledge with our curated educational content</p>
                </section>

                <div className="education-resources">
                  {educationalResources.map((resource) => (
                    <div key={resource.id} className="resource-card">
                      <div className="resource-image">
                        <img src={resource.image || "/placeholder.svg"} alt={resource.title} />
                      </div>
                      <div className="resource-content">
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        <div className="resource-footer">
                          <span className="read-time">{resource.readTime}</span>
                          <button className="read-button">Read Article</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <section className="learning-paths-section">
                  <h2>Learning Paths</h2>
                  <div className="learning-paths-grid">
                    <div className="learning-path-card beginner">
                      <h3>Beginner</h3>
                      <p>Start your investment journey with fundamental concepts and strategies.</p>
                      <ul className="path-modules">
                        <li>Understanding Market Basics</li>
                        <li>Building Your First Portfolio</li>
                        <li>Risk Management Fundamentals</li>
                      </ul>
                      <button className="start-path-button">Start Path</button>
                    </div>
                    <div className="learning-path-card intermediate">
                      <h3>Intermediate</h3>
                      <p>Deepen your knowledge with more advanced investment strategies.</p>
                      <ul className="path-modules">
                        <li>Technical Analysis</li>
                        <li>Fundamental Analysis</li>
                        <li>Portfolio Optimization</li>
                      </ul>
                      <button className="start-path-button">Start Path</button>
                    </div>
                    <div className="learning-path-card advanced">
                      <h3>Advanced</h3>
                      <p>Master complex investment techniques and strategies.</p>
                      <ul className="path-modules">
                        <li>Derivatives and Options</li>
                        <li>Algorithmic Trading</li>
                        <li>Advanced Tax Strategies</li>
                      </ul>
                      <button className="start-path-button">Start Path</button>
                    </div>
                  </div>
                </section>

                <section className="webinars-section">
                  <h2>Upcoming Webinars</h2>
                  <div className="webinars-list">
                    <div className="webinar-card">
                      <div className="webinar-date">
                        <span className="month">MAR</span>
                        <span className="day">15</span>
                      </div>
                      <div className="webinar-details">
                        <h3>Navigating Crypto Market Cycles</h3>
                        <p>Learn how to identify market cycles and adjust your strategy accordingly.</p>
                        <div className="webinar-info">
                          <span className="webinar-time">2:00 PM EST</span>
                          <span className="webinar-duration">60 min</span>
                        </div>
                      </div>
                      <button className="register-button">Register</button>
                    </div>
                    <div className="webinar-card">
                      <div className="webinar-date">
                        <span className="month">MAR</span>
                        <span className="day">22</span>
                      </div>
                      <div className="webinar-details">
                        <h3>Tax Strategies for Crypto Investors</h3>
                        <p>Expert advice on minimizing tax liability for your crypto investments.</p>
                        <div className="webinar-info">
                          <span className="webinar-time">1:00 PM EST</span>
                          <span className="webinar-duration">90 min</span>
                        </div>
                      </div>
                      <button className="register-button">Register</button>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </main>

          {showAddAssetModal && (
            <div className="modal-overlay" onClick={() => setShowAddAssetModal(false)}>
              <div className="add-asset-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Add New Asset</h2>
                  <button className="close-modal-button" onClick={() => setShowAddAssetModal(false)}>
                    ×
                  </button>
                </div>
                <div className="modal-content">
                  <div className="asset-type-selector">
                    <button className="asset-type-button active">Cryptocurrency</button>
                    <button className="asset-type-button">Stock</button>
                    <button className="asset-type-button">Other</button>
                  </div>

                  <div className="form-group">
                    <label htmlFor="asset-search">Search Asset</label>
                    <input type="text" id="asset-search" placeholder="Search by name or ticker symbol" />
                  </div>

                  <div className="popular-assets">
                    <h3>Popular Assets</h3>
                    <div className="popular-assets-grid">
                      <div className="popular-asset-item">
                        <div className="asset-icon" style={{ backgroundColor: "#F7931A" }}></div>
                        <span>Bitcoin (BTC)</span>
                      </div>
                      <div className="popular-asset-item">
                        <div className="asset-icon" style={{ backgroundColor: "#627EEA" }}></div>
                        <span>Ethereum (ETH)</span>
                      </div>
                      <div className="popular-asset-item">
                        <div className="asset-icon" style={{ backgroundColor: "#00FFA3" }}></div>
                        <span>Solana (SOL)</span>
                      </div>
                      <div className="popular-asset-item">
                        <div className="asset-icon" style={{ backgroundColor: "#345D9D" }}></div>
                        <span>Cardano (ADA)</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="asset-amount">Amount</label>
                    <input type="number" id="asset-amount" placeholder="Enter amount" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="purchase-price">Purchase Price (optional)</label>
                    <input type="number" id="purchase-price" placeholder="Enter purchase price" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="purchase-date">Purchase Date (optional)</label>
                    <input type="date" id="purchase-date" />
                  </div>

                  <div className="modal-actions">
                    <button className="cancel-button" onClick={() => setShowAddAssetModal(false)}>
                      Cancel
                    </button>
                    <button className="add-button">Add Asset</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Portfolio

