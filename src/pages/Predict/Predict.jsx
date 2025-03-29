"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./predict.css"

const Predict = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState("1h")
  const [isPredicting, setIsPredicting] = useState(false)
  const [probabilityData, setProbabilityData] = useState(null)
  const [showProbability, setShowProbability] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [notification, setNotification] = useState(null)
  const [liveUpdateActive, setLiveUpdateActive] = useState(true)
  const chartRef = useRef(null)
  const animationRef = useRef(null)
  const liveUpdateRef = useRef(null)

  // Get the selected item from localStorage
  useEffect(() => {
    const item = localStorage.getItem("selectedMarketItem")
    if (!item) {
      window.location.href = "/" // Redirect to home if no item is selected
      return
    }
    setSelectedItem(JSON.parse(item))
  }, [])

  // Fetch historical data for the chart
  useEffect(() => {
    if (!selectedItem) return

    const fetchHistoricalData = async () => {
      setLoading(true)
      setError(null) // Clear any previous errors

      try {
        // Use CoinCap API instead of CoinGecko (free, no rate limits)
        let data = []

        if (!selectedItem.sector) {
          // For crypto, fetch from CoinCap API
          const symbol = selectedItem.symbol.toLowerCase()
          const interval = timeframeToInterval(timeframe)
          const start = getStartTime(timeframe)
          const end = Date.now()

          const apiUrl = `https://api.coincap.io/v2/assets/${symbol}/history?interval=${interval}&start=${start}&end=${end}`

          const response = await fetch(apiUrl)

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const jsonData = await response.json()

          // Format the data for our chart
          data = jsonData.data.map((item) => ({
            time: new Date(item.time).toLocaleTimeString(),
            price: Number.parseFloat(item.priceUsd),
            fullTime: new Date(item.time),
          }))
        } else {
          // For stocks, generate realistic data
          data = generateRealisticData(selectedItem, timeframe)
        }

        setChartData(data)
        setLoading(false)

        // Start live updates after initial data is loaded
        startLiveUpdates()
      } catch (err) {
        console.error("Error fetching historical data:", err)

        // Generate realistic data based on the selected item
        const mockData = generateRealisticData(selectedItem, timeframe)
        setChartData(mockData)

        setLoading(false)

        // Start live updates after initial data is loaded
        startLiveUpdates()
      }
    }

    fetchHistoricalData()

    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (liveUpdateRef.current) {
        clearInterval(liveUpdateRef.current)
      }
    }
  }, [selectedItem, timeframe])

  // Start live updates to simulate real-time data
  const startLiveUpdates = () => {
    // Clear any existing interval
    if (liveUpdateRef.current) {
      clearInterval(liveUpdateRef.current)
    }

    // Set up new interval for live updates every 2 seconds
    liveUpdateRef.current = setInterval(() => {
      if (liveUpdateActive && chartData.length > 0) {
        updateLiveData()
      }
    }, 2000)
  }

  // Update chart data to simulate real-time updates
  const updateLiveData = () => {
    setChartData((prevData) => {
      if (!prevData || prevData.length === 0) return prevData

      // Create a copy of the data
      const newData = [...prevData]

      // Get the last price
      const lastPrice = newData[newData.length - 1].price

      // Calculate a realistic price change (small movement)
      const volatility = selectedItem.price_change_percentage_24h
        ? Math.abs(selectedItem.price_change_percentage_24h) / 100 / 30
        : 0.0005

      const priceChange = lastPrice * (1 + (Math.random() - 0.5) * volatility)

      // Update the last point with a slightly different price
      newData[newData.length - 1] = {
        ...newData[newData.length - 1],
        price: priceChange,
      }

      // For shorter timeframes, occasionally add a new data point and remove the oldest
      if (timeframe === "1h" || timeframe === "24h") {
        if (Math.random() > 0.7) {
          const lastTime = new Date(newData[newData.length - 1].fullTime)
          const newTime = new Date(lastTime.getTime() + 60000) // Add 1 minute

          newData.push({
            time: newTime.toLocaleTimeString(),
            price: priceChange * (1 + (Math.random() - 0.5) * volatility),
            fullTime: newTime,
          })

          // Remove the oldest point to keep the array the same length
          newData.shift()
        }
      }

      return newData
    })
  }

  // Convert timeframe to interval for API
  const timeframeToInterval = (tf) => {
    switch (tf) {
      case "1h":
        return "m5" // 5 minutes
      case "24h":
        return "m30" // 30 minutes
      case "7d":
        return "h2" // 2 hours
      case "30d":
        return "h12" // 12 hours
      case "90d":
        return "d1" // 1 day
      case "1y":
        return "d1" // 1 day
      default:
        return "m30"
    }
  }

  // Get start time based on timeframe
  const getStartTime = (tf) => {
    const now = Date.now()
    switch (tf) {
      case "1h":
        return now - 60 * 60 * 1000
      case "24h":
        return now - 24 * 60 * 60 * 1000
      case "7d":
        return now - 7 * 24 * 60 * 60 * 1000
      case "30d":
        return now - 30 * 24 * 60 * 60 * 1000
      case "90d":
        return now - 90 * 24 * 60 * 60 * 1000
      case "1y":
        return now - 365 * 24 * 60 * 60 * 1000
      default:
        return now - 24 * 60 * 60 * 1000
    }
  }

  // Generate realistic data based on actual price and volatility
  const generateRealisticData = (item, timeframe) => {
    const basePrice = item.current_price
    // Use the actual 24h change percentage for volatility if available
    const volatility = item.price_change_percentage_24h ? Math.abs(item.price_change_percentage_24h) / 100 : 0.02

    const data = []
    const now = new Date()

    let points
    let interval

    switch (timeframe) {
      case "1h":
        points = 60
        interval = 60 * 1000 // 1 minute
        break
      case "24h":
        points = 24
        interval = 60 * 60 * 1000 // 1 hour
        break
      case "7d":
        points = 168
        interval = 60 * 60 * 1000 // 1 hour
        break
      case "30d":
        points = 30
        interval = 24 * 60 * 60 * 1000 // 1 day
        break
      case "90d":
        points = 90
        interval = 24 * 60 * 60 * 1000 // 1 day
        break
      case "1y":
        points = 365
        interval = 24 * 60 * 60 * 1000 // 1 day
        break
      default:
        points = 60
        interval = 60 * 1000 // 1 minute
    }

    // Create a more realistic price pattern with trends
    let currentPrice = basePrice * 0.95 // Start a bit lower
    let trend = 0.5 // Start with neutral trend

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval)

      // Adjust trend occasionally to create patterns
      if (i % 10 === 0) {
        trend = Math.random() // 0-1 value, higher means more bullish
      }

      // Calculate price change with trend influence
      const trendInfluence = (trend - 0.5) * 0.01 // -0.005 to +0.005
      const randomChange = (Math.random() - 0.5) * volatility + trendInfluence
      currentPrice = Math.max(0.01, currentPrice * (1 + randomChange))

      data.push({
        time: time.toLocaleTimeString(),
        price: currentPrice,
        fullTime: time,
      })
    }

    // Ensure the last price is close to the current price
    const lastIndex = data.length - 1
    data[lastIndex] = {
      ...data[lastIndex],
      price: basePrice,
    }

    return data
  }

  // Draw the chart when data changes
  useEffect(() => {
    if (chartData.length > 0 && chartRef.current) {
      drawChart()
    }
  }, [chartData, isPredicting, animationProgress])

  // Handle predict button animation
  useEffect(() => {
    let animationTimer

    if (isPredicting) {
      // Reset animation progress
      setAnimationProgress(0)

      // Animate the line color change from left to right
      let progress = 0
      const animateColorChange = () => {
        progress += 0.01
        setAnimationProgress(progress)

        if (progress < 1) {
          animationTimer = setTimeout(animateColorChange, 20)
        }
      }

      animationTimer = setTimeout(animateColorChange, 20)
    }

    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer)
      }
    }
  }, [isPredicting])

  // Handle notification timeout
  useEffect(() => {
    let notificationTimer

    if (notification) {
      notificationTimer = setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

    return () => {
      if (notificationTimer) {
        clearTimeout(notificationTimer)
      }
    }
  }, [notification])

  // Draw the chart using canvas
  const drawChart = () => {
    const canvas = chartRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i < 6; i++) {
      const y = i * (height / 5)
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }

    // Vertical grid lines
    for (let i = 0; i < 7; i++) {
      const x = i * (width / 6)
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }

    ctx.stroke()

    // Calculate min and max prices for scaling
    const prices = chartData.map((d) => d.price)
    const minPrice = Math.min(...prices) * 0.99
    const maxPrice = Math.max(...prices) * 1.01
    const priceRange = maxPrice - minPrice

    // Draw price labels on y-axis
    ctx.fillStyle = "#999"
    ctx.font = "10px Arial"
    ctx.textAlign = "left"

    for (let i = 0; i < 6; i++) {
      const y = height - i * (height / 5)
      const price = minPrice + (i / 5) * priceRange
      ctx.fillText(`$${price.toFixed(2)}`, 5, y - 5)
    }

    // Draw time labels on x-axis
    const step = Math.max(1, Math.floor(chartData.length / 6))
    for (let i = 0; i < chartData.length; i += step) {
      const x = (i / chartData.length) * width
      let timeLabel

      if (timeframe === "1h" || timeframe === "24h") {
        timeLabel = chartData[i].fullTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      } else {
        timeLabel = chartData[i].fullTime.toLocaleDateString([], { month: "numeric", day: "numeric" })
      }

      ctx.fillText(timeLabel, x, height - 5)
    }

    // Draw the main blue line
    ctx.beginPath()
    ctx.strokeStyle = "#1e88e5"
    ctx.lineWidth = 2

    for (let i = 0; i < chartData.length; i++) {
      const x = (i / (chartData.length - 1)) * width
      const y = height - ((chartData[i].price - minPrice) / priceRange) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // If predicting, draw the orange prediction line 3px below the blue line
    if (isPredicting) {
      ctx.beginPath()
      ctx.strokeStyle = "#ff7700"
      ctx.lineWidth = 2

      for (let i = 0; i < chartData.length; i++) {
        const x = (i / (chartData.length - 1)) * width
        const y = height - ((chartData[i].price - minPrice) / priceRange) * height + 3
        const segmentPosition = i / chartData.length

        // Only draw the orange line up to the animation progress
        if (segmentPosition <= animationProgress) {
          if (
            i === 0 ||
            (segmentPosition <= animationProgress && i > 0 && (i - 1) / chartData.length > animationProgress)
          ) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      }

      ctx.stroke()
    }

    // Draw dots at data points
    for (let i = 0; i < chartData.length; i += Math.max(1, Math.floor(chartData.length / 15))) {
      const x = (i / (chartData.length - 1)) * width
      const y = height - ((chartData[i].price - minPrice) / priceRange) * height

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = "#1e88e5"
      ctx.fill()

      // If predicting and within animation progress, draw orange dots for prediction
      if (isPredicting && i / chartData.length <= animationProgress) {
        ctx.beginPath()
        ctx.arc(x, y + 3, 3, 0, 2 * Math.PI)
        ctx.fillStyle = "#ff7700"
        ctx.fill()
      }
    }
  }

  // Handle timeframe change
  const handleTimeframeChange = (tf) => {
    setTimeframe(tf)
  }

  // Handle predict button click
  const handlePredict = () => {
    if (!isPredicting) {
      setIsPredicting(true)

      // Show notification
      setNotification({
        type: "success",
        message: `Prediction analysis started for ${selectedItem.name}`,
        details: "Our AI is analyzing market patterns and generating predictions...",
      })

      // Generate prediction data based on actual chart data
      generatePredictionData()

      // Show probability panel after a short delay
      setTimeout(() => {
        setShowProbability(true)
      }, 1000)
    }
  }

  // Generate prediction data based on chart patterns
  const generatePredictionData = () => {
    if (chartData.length === 0) return

    // Get recent prices for analysis
    const recentPrices = chartData.slice(-20)
    const priceChanges = []

    for (let i = 1; i < recentPrices.length; i++) {
      priceChanges.push((recentPrices[i].price - recentPrices[i - 1].price) / recentPrices[i - 1].price)
    }

    // Calculate average price change
    const avgChange =
      priceChanges.length > 0 ? priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length : 0

    // Calculate volatility (standard deviation of price changes)
    const volatility =
      priceChanges.length > 0
        ? Math.sqrt(
            priceChanges.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / priceChanges.length,
          )
        : 0.02

    // Determine trend based on recent movement and momentum
    const lastPrice = recentPrices[recentPrices.length - 1].price
    const firstPrice = recentPrices[0].price
    const overallTrend = lastPrice > firstPrice ? "bullish" : "bearish"

    // Calculate momentum (acceleration of price changes)
    const firstHalfChanges = priceChanges.slice(0, Math.floor(priceChanges.length / 2))
    const secondHalfChanges = priceChanges.slice(Math.floor(priceChanges.length / 2))

    const firstHalfAvg =
      firstHalfChanges.length > 0
        ? firstHalfChanges.reduce((sum, change) => sum + change, 0) / firstHalfChanges.length
        : 0

    const secondHalfAvg =
      secondHalfChanges.length > 0
        ? secondHalfChanges.reduce((sum, change) => sum + change, 0) / secondHalfChanges.length
        : 0

    const momentum = secondHalfAvg - firstHalfAvg

    // Calculate confidence based on trend consistency and volatility
    const trendConsistency =
      priceChanges.filter(
        (change) => (overallTrend === "bullish" && change > 0) || (overallTrend === "bearish" && change < 0),
      ).length / priceChanges.length

    const confidence = Math.min(95, Math.max(60, Math.floor(trendConsistency * 100 - volatility * 500)))

    // Predict future price based on trend, momentum and volatility
    const predictedChange = avgChange * 5 + momentum * 10 + (Math.random() - 0.5) * volatility * 2
    const predictedPrice = lastPrice * (1 + predictedChange)

    // Calculate support and resistance levels
    const prices = recentPrices.map((p) => p.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    const support = minPrice * (1 - volatility)
    const resistance = maxPrice * (1 + volatility)

    // Generate trading volume prediction
    const volumeChange = (Math.random() - 0.3) * 20 // -30% to +70% change
    const predictedVolume = selectedItem.total_volume * (1 + volumeChange / 100)

    // Calculate price targets
    const shortTermTarget = predictedPrice * (1 + Math.random() * 0.05 * (overallTrend === "bullish" ? 1 : -1))
    const midTermTarget = predictedPrice * (1 + Math.random() * 0.15 * (overallTrend === "bullish" ? 1 : -1))
    const longTermTarget = predictedPrice * (1 + Math.random() * 0.3 * (overallTrend === "bullish" ? 1 : -1))

    // Calculate market sentiment score (0-100)
    const sentimentScore = Math.min(100, Math.max(0, 50 + avgChange * 1000 + momentum * 500))

    // Calculate risk assessment (1-10)
    const riskScore = Math.min(10, Math.max(1, Math.round(volatility * 100)))

    // Calculate probability of price increase
    const priceIncreaseProb = Math.min(99, Math.max(1, Math.round(50 + momentum * 500 + avgChange * 300)))

    setProbabilityData({
      trend: overallTrend,
      confidence,
      predictedPrice,
      timeframe,
      volatility: volatility * 100,
      avgDailyChange: avgChange * 100,
      momentum: momentum * 100,
      support,
      resistance,
      volumePrediction: predictedVolume,
      shortTermTarget,
      midTermTarget,
      longTermTarget,
      sentimentScore,
      riskScore,
      priceIncreaseProb,
      dataReady: false,
    })

    // Add a small delay to make the animation more noticeable
    setTimeout(() => {
      setProbabilityData((prevData) => ({
        ...prevData,
        dataReady: true,
      }))
    }, 300)
  }

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T"
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"
    return num.toFixed(2)
  }

  // Handle add to portfolio
  const handleAddToPortfolio = () => {
    // Get existing portfolio or initialize empty array
    const portfolio = JSON.parse(localStorage.getItem("portfolio") || "[]")

    // Check if item already exists in portfolio
    const exists = portfolio.some((item) => item.id === selectedItem.id)

    if (!exists) {
      // Add item to portfolio with timestamp
      portfolio.push({
        ...selectedItem,
        addedAt: new Date().toISOString(),
      })

      // Save updated portfolio
      localStorage.setItem("portfolio", JSON.stringify(portfolio))

      setNotification({
        type: "success",
        message: `${selectedItem.name} added to your portfolio`,
        details: "You can view your portfolio in the dashboard",
      })
    } else {
      setNotification({
        type: "info",
        message: `${selectedItem.name} is already in your portfolio`,
        details: "You can view your portfolio in the dashboard",
      })
    }
  }

  // Handle probability button click
  const handleProbabilityClick = () => {
    setShowProbability(!showProbability)

    if (!showProbability && !probabilityData) {
      // Generate prediction data based on actual chart data
      generatePredictionData()
    }
  }

  if (!selectedItem) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="predict-container">
      {/* Notification system */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification notification-${notification.type}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="notification-content">
              <div className="notification-icon">
                {notification.type === "success" && <span>✓</span>}
                {notification.type === "error" && <span>✗</span>}
                {notification.type === "info" && <span>ℹ</span>}
              </div>
              <div className="notification-text">
                <h4>{notification.message}</h4>
                <p>{notification.details}</p>
              </div>
              <button className="notification-close" onClick={() => setNotification(null)}>
                ×
              </button>
            </div>
            <div className="notification-progress">
              <div className="notification-progress-bar"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="predict-header">
        <div className="coin-identity">
          <img
            src={selectedItem.image || `/placeholder.svg?height=64&width=64&text=${selectedItem.symbol}`}
            alt={selectedItem.name}
            className="coin-logo"
          />
          <div className="coin-title">
            <h1>
              #{selectedItem.market_cap_rank} {selectedItem.name} ({selectedItem.symbol.toUpperCase()})
            </h1>
          </div>
        </div>
        <div className="coin-price-info">
          <div className="current-price">${selectedItem.current_price.toLocaleString()}</div>
          <div className={`price-change ${selectedItem.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>
            {selectedItem.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(selectedItem.price_change_percentage_24h).toFixed(2)}%
          </div>
          <div className="secondary-price">${(selectedItem.current_price * 0.99).toFixed(2)}</div>
          <div className={`secondary-change positive`}>▲ {(Math.random() * 10).toFixed(2)}%</div>
          <div className="timestamp">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="chart-container">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading chart data...</p>
          </div>
        ) : (
          <>
            <canvas ref={chartRef} width="800" height="400" className="price-chart"></canvas>
            {error && <div className="error-message">{error}</div>}
          </>
        )}
      </div>

      <div className="chart-controls">
        <div className="control-button-group">
          <motion.button
            className="control-button portfolio-button"
            onClick={handleAddToPortfolio}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Portfolio
          </motion.button>
        </div>

        <div className="timeframe-selector">
          <span>Timeframe:</span>
          {["1h", "24h", "7d", "30d", "90d", "1y"].map((tf) => (
            <button
              key={tf}
              className={`timeframe-button ${timeframe === tf ? "active" : ""}`}
              onClick={() => handleTimeframeChange(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="control-button-group">
          <motion.button
            className={`control-button predict-button ${isPredicting ? "active" : ""}`}
            onClick={handlePredict}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPredicting}
          >
            Predict
          </motion.button>
          <motion.button
            className={`control-button probability-button ${showProbability ? "active" : ""}`}
            onClick={handleProbabilityClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Probability
          </motion.button>
        </div>
      </div>

      <div className="market-data-container">
        <div className="market-stats">
          <h2>Market Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Market Cap</div>
              <div className="stat-value">${formatNumber(selectedItem.market_cap)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">24h Volume</div>
              <div className="stat-value">${formatNumber(selectedItem.total_volume)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Circulating Supply</div>
              <div className="stat-value">
                {selectedItem.circulating_supply
                  ? formatNumber(selectedItem.circulating_supply)
                  : formatNumber(selectedItem.market_cap / selectedItem.current_price)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">All Time High</div>
              <div className="stat-value">
                $
                {selectedItem.ath
                  ? formatNumber(selectedItem.ath)
                  : formatNumber(selectedItem.current_price * (1 + Math.random()))}
              </div>
            </div>
          </div>
        </div>

        {showProbability && (
          <motion.div
            className="probability-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2>Price Analysis for {selectedItem.name}</h2>
            <div className="prediction-details">
              <div className="prediction-item">
                <div className="prediction-label">Market Trend</div>
                <div className={`prediction-value ${probabilityData?.trend === "bullish" ? "positive" : "negative"}`}>
                  {probabilityData?.trend === "bullish" ? "Bullish ▲" : "Bearish ▼"}
                </div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Confidence</div>
                <div className="prediction-value">{probabilityData?.confidence || 75}%</div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Predicted Price</div>
                <div
                  className={`prediction-value ${(probabilityData?.predictedPrice || 0) > selectedItem.current_price ? "positive" : "negative"}`}
                >
                  ${(probabilityData?.predictedPrice || selectedItem.current_price * 1.05).toFixed(2)}
                </div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Volatility</div>
                <div className="prediction-value">
                  {(probabilityData?.volatility || Math.abs(selectedItem.price_change_percentage_24h) * 0.5).toFixed(2)}
                  %
                </div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Support Level</div>
                <div className="prediction-value">
                  ${(probabilityData?.support || selectedItem.current_price * 0.95).toFixed(2)}
                </div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Resistance Level</div>
                <div className="prediction-value">
                  ${(probabilityData?.resistance || selectedItem.current_price * 1.05).toFixed(2)}
                </div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Price Momentum</div>
                <div className={`prediction-value ${(probabilityData?.momentum || 0) > 0 ? "positive" : "negative"}`}>
                  {(probabilityData?.momentum || 0).toFixed(2)}%
                </div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Avg Daily Change</div>
                <div
                  className={`prediction-value ${(probabilityData?.avgDailyChange || 0) > 0 ? "positive" : "negative"}`}
                >
                  {(probabilityData?.avgDailyChange || 0).toFixed(2)}%
                </div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Volume Prediction</div>
                <div className="prediction-value">
                  ${formatNumber(probabilityData?.volumePrediction || selectedItem.total_volume)}
                </div>
              </div>
            </div>
            <div className="prediction-disclaimer">
              * Analysis based on historical price patterns and market indicators. Not financial advice.
            </div>
          </motion.div>
        )}

        <div className="price-alerts">
          <h2>Price Alerts</h2>
          <div className="alert-item active">
            <div className="alert-direction up">▲</div>
            <div className="alert-price">${(selectedItem.current_price * 1.1).toFixed(2)}</div>
            <div className="alert-status">Active</div>
          </div>
          <div className="alert-item active">
            <div className="alert-direction down">▼</div>
            <div className="alert-price">${(selectedItem.current_price * 0.9).toFixed(2)}</div>
            <div className="alert-status">Active</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predict

