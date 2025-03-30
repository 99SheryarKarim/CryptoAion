"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, TrendingUp, BarChart2, DollarSign, Clock, Award, AlertTriangle, PieChart } from "lucide-react"
import "./Predict.css"

const Predict = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState("1h")
  const [isPredicting, setIsPredicting] = useState(false)
  const [probabilityData, setProbabilityData] = useState(null)
  const [showProbability, setShowProbability] = useState(false)
  const [notification, setNotification] = useState(null)
  const [pendingTimeframe, setPendingTimeframe] = useState(null)
  const [coinDetails, setCoinDetails] = useState(null)
  const [coinStats, setCoinStats] = useState(null)
  const [showStats, setShowStats] = useState(false)
  const chartRef = useRef(null)
  const statsChartRef = useRef(null)
  const animationRef = useRef(null)
  const liveUpdateRef = useRef(null)

  // Get the selected item from localStorage
  useEffect(() => {
    const item = localStorage.getItem("selectedMarketItem")
    if (!item) {
      window.location.href = "/" // Redirect to home if no item is selected
      return
    }
    const parsedItem = JSON.parse(item)
    setSelectedItem(parsedItem)

    // Fetch coin details from API
    fetchCoinDetails(parsedItem)
  }, [])

  // Fetch coin details from CoinCap API
  const fetchCoinDetails = async (item) => {
    if (!item) return

    try {
      const symbol = item.symbol.toLowerCase()

      // Fetch coin data from CoinCap API
      const response = await fetch(`https://api.coincap.io/v2/assets/${symbol}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      const coinData = data.data

      // Calculate additional metrics
      const marketDominance = (Number.parseFloat(coinData.marketCapUsd) / 2500000000000) * 100 // Assuming total market cap of 2.5T
      const volatilityScore = item.price_change_percentage_24h
        ? Math.abs(item.price_change_percentage_24h) / 2
        : Number.parseFloat(coinData.changePercent24Hr)
          ? Math.abs(Number.parseFloat(coinData.changePercent24Hr)) / 5
          : Math.random() * 5

      // Generate random sentiment data (this would ideally come from a sentiment analysis API)
      const sentimentData = {
        bullish: Math.floor(Math.random() * 70) + 30,
        bearish: Math.floor(Math.random() * 40),
        neutral: Math.floor(Math.random() * 30),
      }

      // Normalize sentiment to 100%
      const total = sentimentData.bullish + sentimentData.bearish + sentimentData.neutral
      sentimentData.bullish = Math.floor((sentimentData.bullish / total) * 100)
      sentimentData.bearish = Math.floor((sentimentData.bearish / total) * 100)
      sentimentData.neutral = 100 - sentimentData.bullish - sentimentData.bearish

      // Fetch market data for exchanges (in a real app, this would come from an API)
      const exchanges = [
        { name: "Binance", volume: Math.floor(Math.random() * 40) + 20 },
        { name: "Coinbase", volume: Math.floor(Math.random() * 30) + 10 },
        { name: "Kraken", volume: Math.floor(Math.random() * 20) + 5 },
        { name: "FTX", volume: Math.floor(Math.random() * 15) + 5 },
        { name: "Others", volume: Math.floor(Math.random() * 20) + 5 },
      ]

      // Normalize exchange volume to 100%
      const totalVolume = exchanges.reduce((sum, exchange) => sum + exchange.volume, 0)
      exchanges.forEach((exchange) => {
        exchange.percentage = Math.floor((exchange.volume / totalVolume) * 100)
      })

      // Set coin details with API data
      setCoinDetails({
        id: coinData.id,
        name: coinData.name,
        symbol: coinData.symbol,
        priceUsd: Number.parseFloat(coinData.priceUsd),
        marketCapUsd: Number.parseFloat(coinData.marketCapUsd),
        volumeUsd24Hr: Number.parseFloat(coinData.volumeUsd24Hr),
        supply: Number.parseFloat(coinData.supply),
        maxSupply: Number.parseFloat(coinData.maxSupply),
        changePercent24Hr: Number.parseFloat(coinData.changePercent24Hr),
        vwap24Hr: Number.parseFloat(coinData.vwap24Hr),
        explorer: coinData.explorer,
        rank: Number.parseInt(coinData.rank),
        marketDominance,
        volatilityScore,
        liquidityScore: Math.min(95, Math.max(30, Math.floor(Math.random() * 100))),
        sentimentData,
        exchanges,
        description: generateCoinDescription(item),
        priceHistory: {
          allTimeHigh: item.ath || Number.parseFloat(coinData.priceUsd) * (1 + Math.random()),
          allTimeLow: item.atl || Number.parseFloat(coinData.priceUsd) * (1 - Math.random() * 0.9),
          yearToDateChange: Math.floor(Math.random() * 200) - 50, // -50% to +150%
        },
      })

      // Generate stats for the Stats tab
      generateCoinStats(coinData)
    } catch (err) {
      console.error("Error fetching coin details:", err)
      // Fallback to using the data we have
      generateCoinDetails(item)
    }
  }

  // Generate coin stats for the Stats tab
  const generateCoinStats = (coinData) => {
    if (!coinData) return

    // Calculate probability of increase based on recent performance
    const changePercent = Number.parseFloat(coinData.changePercent24Hr) || 0
    const vwap = Number.parseFloat(coinData.vwap24Hr) || 0
    const currentPrice = Number.parseFloat(coinData.priceUsd) || 0

    // Calculate probability (this is a simplified model)
    let probabilityIncrease = 50 // Base probability

    // Adjust based on 24h change
    if (changePercent > 0) {
      probabilityIncrease += Math.min(20, changePercent * 2)
    } else {
      probabilityIncrease -= Math.min(20, Math.abs(changePercent) * 2)
    }

    // Adjust based on price vs VWAP
    if (vwap > 0) {
      const vwapDiff = ((currentPrice - vwap) / vwap) * 100
      if (vwapDiff > 0) {
        probabilityIncrease -= Math.min(10, vwapDiff * 2) // Above VWAP might indicate overbought
      } else {
        probabilityIncrease += Math.min(10, Math.abs(vwapDiff) * 2) // Below VWAP might indicate potential rise
      }
    }

    // Adjust based on market cap rank
    const rank = Number.parseInt(coinData.rank) || 100
    if (rank <= 10) {
      probabilityIncrease += 5 // Top coins tend to be more stable
    } else if (rank <= 50) {
      probabilityIncrease += 2
    }

    // Ensure probability is between 1 and 99
    probabilityIncrease = Math.max(1, Math.min(99, Math.round(probabilityIncrease)))

    // Set coin stats
    setCoinStats({
      probabilityIncrease,
      marketCapRank: Number.parseInt(coinData.rank) || 0,
      changePercent24Hr: changePercent,
      supply: {
        current: Number.parseFloat(coinData.supply) || 0,
        max: Number.parseFloat(coinData.maxSupply) || 0,
        percentCirculating: coinData.maxSupply
          ? (Number.parseFloat(coinData.supply) / Number.parseFloat(coinData.maxSupply)) * 100
          : 100,
      },
      volumeRank: Math.floor(Math.random() * 20) + 1, // This would come from API in a real app
      volatility: Math.abs(changePercent) || Math.random() * 5,
      marketShare: (Number.parseFloat(coinData.marketCapUsd) / 2500000000000) * 100, // Assuming total market cap of 2.5T
    })
  }

  // Generate detailed information about the coin (fallback if API fails)
  const generateCoinDetails = (item) => {
    if (!item) return

    // Calculate some additional metrics
    const marketDominance = ((item.market_cap || 0) / 2500000000000) * 100 // Assuming total market cap of 2.5T
    const volatilityScore = item.price_change_percentage_24h
      ? Math.abs(item.price_change_percentage_24h) / 2
      : Math.random() * 5
    const liquidityScore = Math.min(95, Math.max(30, Math.floor(Math.random() * 100)))

    // Generate random sentiment data
    const sentimentData = {
      bullish: Math.floor(Math.random() * 70) + 30,
      bearish: Math.floor(Math.random() * 40),
      neutral: Math.floor(Math.random() * 30),
    }

    // Normalize sentiment to 100%
    const total = sentimentData.bullish + sentimentData.bearish + sentimentData.neutral
    sentimentData.bullish = Math.floor((sentimentData.bullish / total) * 100)
    sentimentData.bearish = Math.floor((sentimentData.bearish / total) * 100)
    sentimentData.neutral = 100 - sentimentData.bullish - sentimentData.bearish

    // Generate trading volume by exchange (random data)
    const exchanges = [
      { name: "Binance", volume: Math.floor(Math.random() * 40) + 20 },
      { name: "Coinbase", volume: Math.floor(Math.random() * 30) + 10 },
      { name: "Kraken", volume: Math.floor(Math.random() * 20) + 5 },
      { name: "FTX", volume: Math.floor(Math.random() * 15) + 5 },
      { name: "Others", volume: Math.floor(Math.random() * 20) + 5 },
    ]

    // Normalize exchange volume to 100%
    const totalVolume = exchanges.reduce((sum, exchange) => sum + exchange.volume, 0)
    exchanges.forEach((exchange) => {
      exchange.percentage = Math.floor((exchange.volume / totalVolume) * 100)
    })

    setCoinDetails({
      marketDominance,
      volatilityScore,
      liquidityScore,
      sentimentData,
      exchanges,
      description: generateCoinDescription(item),
      priceHistory: {
        allTimeHigh: item.ath || item.current_price * (1 + Math.random()),
        allTimeLow: item.atl || item.current_price * (1 - Math.random() * 0.9),
        yearToDateChange: Math.floor(Math.random() * 200) - 50, // -50% to +150%
      },
    })

    // Generate stats for the Stats tab
    const probabilityIncrease = Math.floor(Math.random() * 40) + 30 // Random between 30-70%

    setCoinStats({
      probabilityIncrease,
      marketCapRank: item.market_cap_rank || 0,
      changePercent24Hr: item.price_change_percentage_24h || 0,
      supply: {
        current: item.circulating_supply || 0,
        max: item.total_supply || 0,
        percentCirculating: item.total_supply ? (item.circulating_supply / item.total_supply) * 100 : 100,
      },
      volumeRank: Math.floor(Math.random() * 20) + 1,
      volatility: Math.abs(item.price_change_percentage_24h) || Math.random() * 5,
      marketShare: ((item.market_cap || 0) / 2500000000000) * 100, // Assuming total market cap of 2.5T
    })
  }

  // Generate a description for the coin
  const generateCoinDescription = (item) => {
    const descriptions = [
      `${item.name} is a decentralized digital currency that enables instant payments to anyone, anywhere in the world.`,
      `${item.name} is a blockchain platform that enables developers to build and deploy decentralized applications.`,
      `${item.name} is a digital asset designed to work as a medium of exchange that uses strong cryptography to secure financial transactions.`,
      `${item.name} is a cryptocurrency that aims to offer fast, secure, and low-cost digital payments through a decentralized peer-to-peer network.`,
      `${item.name} is a next-generation blockchain platform designed for scalability, security, and sustainability.`,
    ]

    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  // Initial data load only when component mounts
  useEffect(() => {
    if (!selectedItem) return

    const fetchInitialData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Try to fetch data from CoinCap API
        const data = await fetchHistoricalData(selectedItem, timeframe)
        setChartData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching initial data:", err)

        // Fallback to generated data
        const data = generateRealisticData(selectedItem, timeframe)
        setChartData(data)
        setLoading(false)
      }
    }

    fetchInitialData()

    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (liveUpdateRef.current) {
        clearInterval(liveUpdateRef.current)
      }
    }
  }, [selectedItem, timeframe]) // Only run on initial mount and when selectedItem changes

  // Draw stats chart when stats data is available
  useEffect(() => {
    if (coinStats && statsChartRef.current && showStats) {
      drawStatsChart()
    }
  }, [coinStats, showStats])

  // Fetch historical data from CoinCap API
  const fetchHistoricalData = async (item, tf) => {
    if (!item) return []

    const symbol = item.symbol.toLowerCase()
    const interval = timeframeToInterval(tf)
    const start = getStartTime(tf)
    const end = Date.now()

    const apiUrl = `https://api.coincap.io/v2/assets/${symbol}/history?interval=${interval}&start=${start}&end=${end}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonData = await response.json()

    // Format the data for our chart
    return jsonData.data.map((item) => ({
      time: new Date(item.time).toLocaleTimeString(),
      price: Number.parseFloat(item.priceUsd),
      fullTime: new Date(item.time),
    }))
  }

  // Fetch historical data for the chart - only when predict is clicked
  const fetchChartData = async () => {
    if (!selectedItem) return

    setLoading(true)
    setError(null)

    try {
      // Use the pending timeframe if available, otherwise use current timeframe
      const tf = pendingTimeframe || timeframe

      // Update the active timeframe if there was a pending one
      if (pendingTimeframe) {
        setTimeframe(pendingTimeframe)
        setPendingTimeframe(null)
      }

      // Try to fetch data from CoinCap API
      const data = await fetchHistoricalData(selectedItem, tf)

      // Apply smooth transition to new data
      const oldData = [...chartData]
      const transitionData = (progress) => {
        const blendedData = data.map((newPoint, i) => {
          const oldPoint = oldData[i] || oldData[oldData.length - 1] || newPoint
          return {
            time: newPoint.time,
            price: oldPoint.price + (newPoint.price - oldPoint.price) * progress,
            fullTime: newPoint.fullTime,
          }
        })
        setChartData(blendedData)
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(() => transitionData(Math.min(1, progress + 0.05)))
        }
      }

      // Start the transition animation
      transitionData(0)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching historical data:", err)

      // Generate realistic data based on the selected item
      const mockData = generateRealisticData(selectedItem, pendingTimeframe || timeframe)
      setChartData(mockData)

      setLoading(false)
    }
  }

  // Convert timeframe to interval for API
  const timeframeToInterval = (tf) => {
    switch (tf) {
      case "30m":
        return "m5" // 5 minutes
      case "1h":
        return "m5" // 5 minutes
      case "4h":
        return "m15" // 15 minutes
      case "24h":
        return "m30" // 30 minutes
      default:
        return "m30"
    }
  }

  // Get start time based on timeframe
  const getStartTime = (tf) => {
    const now = Date.now()
    switch (tf) {
      case "30m":
        return now - 30 * 60 * 1000
      case "1h":
        return now - 60 * 60 * 1000
      case "4h":
        return now - 4 * 60 * 60 * 1000
      case "24h":
        return now - 24 * 60 * 60 * 1000
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
      case "30m":
        points = 30
        interval = 60 * 1000 // 1 minute
        break
      case "1h":
        points = 60
        interval = 60 * 1000 // 1 minute
        break
      case "4h":
        points = 48
        interval = 5 * 60 * 1000 // 5 minutes
        break
      case "24h":
        points = 24
        interval = 60 * 60 * 1000 // 1 hour
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
  }, [chartData, isPredicting])

  // Draw the chart using canvas
  const drawChart = () => {
    const canvas = chartRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = 250 // Reduced from 400

    // Set canvas height
    canvas.height = height

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Fill background - slightly lighter dark gray with a hint of blue
    ctx.fillStyle = "#121621"
    ctx.fillRect(0, 0, width, height)

    // Calculate min and max prices for scaling
    const prices = chartData.map((d) => d.price)
    const minPrice = Math.min(...prices) * 0.99
    const maxPrice = Math.max(...prices) * 1.01
    const priceRange = maxPrice - minPrice

    // Draw price labels on right side of the chart only
    ctx.fillStyle = "#999"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"

    for (let i = 0; i < 6; i++) {
      const y = height - i * (height / 5)
      const price = minPrice + (i / 5) * priceRange
      ctx.fillText(`${price.toFixed(1)}`, width - 5, y - 5)
    }

    // Line color is always orange when predicting, blue otherwise
    const mainLineColor = isPredicting ? "#ff9632" : "#5bc0de"

    // Create gradient for the chart area
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    if (isPredicting) {
      gradient.addColorStop(0, "rgba(255, 150, 50, 0.2)")
      gradient.addColorStop(0.5, "rgba(255, 150, 50, 0.1)")
      gradient.addColorStop(1, "rgba(255, 150, 50, 0)")
    } else {
      gradient.addColorStop(0, "rgba(91, 192, 222, 0.2)")
      gradient.addColorStop(0.5, "rgba(91, 192, 222, 0.1)")
      gradient.addColorStop(1, "rgba(91, 192, 222, 0)")
    }

    // Draw filled area under the line
    ctx.beginPath()
    ctx.fillStyle = gradient

    // Start at the bottom left
    ctx.moveTo(0, height)

    // Draw the line path
    for (let i = 0; i < chartData.length; i++) {
      const x = (i / (chartData.length - 1)) * width
      const y = height - ((chartData[i].price - minPrice) / priceRange) * height
      ctx.lineTo(x, y)
    }

    // Complete the path to the bottom right
    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()

    // Add shadow effect for the main line
    ctx.shadowColor = isPredicting ? "rgba(255, 150, 50, 0.5)" : "rgba(91, 192, 222, 0.5)"
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 4

    // Draw the main line
    ctx.beginPath()
    ctx.strokeStyle = mainLineColor
    ctx.lineWidth = 2.5

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

    // Reset shadow for other elements
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }

  // Draw the stats chart
  const drawStatsChart = () => {
    if (!coinStats || !statsChartRef.current) return

    const canvas = statsChartRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Fill background
    ctx.fillStyle = "#121621"
    ctx.fillRect(0, 0, width, height)

    // Draw circular gauge
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.4

    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 20
    ctx.stroke()

    // Draw progress arc
    const probability = coinStats.probabilityIncrease
    const startAngle = -Math.PI / 2 // Start at top
    const endAngle = startAngle + (probability / 100) * (2 * Math.PI)

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = "#5bc0de"
    ctx.lineWidth = 20
    ctx.stroke()

    // Draw text in center
    ctx.fillStyle = "#fff"
    ctx.font = "bold 36px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${probability}%`, centerX, centerY)

    // Draw label below
    ctx.font = "16px Arial"
    ctx.fillStyle = "#aaa"
    ctx.fillText("Probability of increase in 1 day", centerX, centerY + radius + 40)
  }

  // Handle timeframe change
  const handleTimeframeChange = (tf) => {
    // Store the selected timeframe but don't update the chart yet
    setPendingTimeframe(tf)

    // Visual feedback that timeframe was selected
    const buttons = document.querySelectorAll(".timeframe-button")
    buttons.forEach((button) => {
      if (button.textContent === tf) {
        button.classList.add("pending")
      } else {
        button.classList.remove("pending")
      }
    })
  }

  // Handle predict button click
  const handlePredict = () => {
    // Fetch new data with the current or pending timeframe
    fetchChartData()

    if (!isPredicting) {
      setIsPredicting(true)

      // Show notification
      setNotification({
        type: "success",
        message: `Prediction analysis started for ${selectedItem.name}`,
        details: "Our AI is analyzing market patterns and generating predictions...",
      })

      // Generate prediction data based on actual chart data
      setTimeout(() => {
        generatePredictionData()
      }, 500)

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
      timeframe: pendingTimeframe || timeframe,
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
      dataReady: true,
    })

    // Update the stats probability with the new prediction
    if (coinStats) {
      setCoinStats({
        ...coinStats,
        probabilityIncrease: priceIncreaseProb,
      })
    }
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
    setShowStats(false) // Hide stats when showing probability

    if (!showProbability && !probabilityData) {
      // Generate prediction data based on actual chart data
      generatePredictionData()
    }
  }

  // Handle stats button click
  const handleStatsClick = () => {
    setShowStats(!showStats)
    setShowProbability(false) // Hide probability when showing stats

    // If we're showing stats and don't have stats data yet, generate it
    if (!showStats && !coinStats && selectedItem) {
      // Generate stats data if we don't have it yet
      const probabilityIncrease = Math.floor(Math.random() * 40) + 30 // Random between 30-70%

      setCoinStats({
        probabilityIncrease,
        marketCapRank: selectedItem.market_cap_rank || 0,
        changePercent24Hr: selectedItem.price_change_percentage_24h || 0,
        supply: {
          current: selectedItem.circulating_supply || 0,
          max: selectedItem.total_supply || 0,
          percentCirculating: selectedItem.total_supply
            ? (selectedItem.circulating_supply / selectedItem.total_supply) * 100
            : 100,
        },
        volumeRank: Math.floor(Math.random() * 20) + 1,
        volatility: Math.abs(selectedItem.price_change_percentage_24h) || Math.random() * 5,
        marketShare: ((selectedItem.market_cap || 0) / 2500000000000) * 100, // Assuming total market cap of 2.5T
      })
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
            transition={{ duration: 0.3 }}
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
          {isPredicting && probabilityData && (
            <div
              className={`predicted-price ${(probabilityData.predictedPrice || 0) > selectedItem.current_price ? "positive" : "negative"}`}
            >
              Predicted: ${(probabilityData.predictedPrice || selectedItem.current_price * 1.05).toFixed(2)}
            </div>
          )}
          <div className="timestamp">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="chart-and-probability-container">
        <div className="chart-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading chart data...</p>
            </div>
          ) : (
            <>
              <canvas ref={chartRef} width="800" height="250" className="price-chart"></canvas>
              {error && <div className="error-message">{error}</div>}
            </>
          )}
        </div>

        {/* Right panel - conditionally show either coin details, probability panel, or stats panel */}
        {showStats ? (
          <motion.div
            className="stats-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="stats-panel-header">
              <h3>Stats</h3>
              <PieChart size={16} className="stats-icon" />
            </div>
            <div className="stats-panel-content">
              <div className="stats-gauge-container">
                <canvas ref={statsChartRef} width="250" height="250" className="stats-chart"></canvas>
              </div>
              {coinStats && (
                <div className="stats-additional-info">
                  <div className="stats-row">
                    <div className="stats-label">Market Cap Rank</div>
                    <div className="stats-value">#{coinStats.marketCapRank}</div>
                  </div>
                  <div className="stats-row">
                    <div className="stats-label">24h Change</div>
                    <div className={`stats-value ${coinStats.changePercent24Hr >= 0 ? "positive" : "negative"}`}>
                      {coinStats.changePercent24Hr >= 0 ? "+" : ""}
                      {coinStats.changePercent24Hr.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stats-row">
                    <div className="stats-label">Volatility</div>
                    <div className="stats-value">{coinStats.volatility.toFixed(2)}</div>
                  </div>
                  <div className="stats-row">
                    <div className="stats-label">Market Share</div>
                    <div className="stats-value">{coinStats.marketShare.toFixed(2)}%</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : showProbability ? (
          <motion.div
            className="probability-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="analysis-summary">
              <div className="confidence-meter">
                <div className="confidence-label">Confidence</div>
                <div className="confidence-bar">
                  <div className="confidence-value" style={{ width: `${probabilityData?.confidence || 75}%` }}></div>
                </div>
                <div className="confidence-percentage">{probabilityData?.confidence || 75}%</div>
              </div>

              <div className="trend-indicator-small">
                <div className={`trend-badge ${probabilityData?.trend === "bullish" ? "bullish" : "bearish"}`}>
                  {probabilityData?.trend === "bullish" ? "Bullish ▲" : "Bearish ▼"}
                </div>
              </div>

              <div className="key-predictions">
                <div className="prediction-row">
                  <div className="prediction-label">Support:</div>
                  <div className="prediction-value">
                    ${(probabilityData?.support || selectedItem.current_price * 0.95).toFixed(2)}
                  </div>
                </div>
                <div className="prediction-row">
                  <div className="prediction-label">Resistance:</div>
                  <div className="prediction-value">
                    ${(probabilityData?.resistance || selectedItem.current_price * 1.05).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="metrics-mini">
                <div className="metric-mini">
                  <div className="metric-mini-label">Volatility</div>
                  <div className="metric-mini-value">
                    {(probabilityData?.volatility || Math.abs(selectedItem.price_change_percentage_24h) * 0.5).toFixed(
                      2,
                    )}
                    %
                  </div>
                </div>

                <div className="metric-mini">
                  <div className="metric-mini-label">Momentum</div>
                  <div
                    className={`metric-mini-value ${(probabilityData?.momentum || 0) > 0 ? "positive" : "negative"}`}
                  >
                    {(probabilityData?.momentum || 0) > 0 ? "+" : ""}
                    {(probabilityData?.momentum || 0).toFixed(2)}%
                  </div>
                </div>

                <div className="metric-mini">
                  <div className="metric-mini-label">Risk</div>
                  <div className="metric-mini-value">{probabilityData?.riskScore || 5}/10</div>
                </div>

                <div className="metric-mini">
                  <div className="metric-mini-label">Confidence</div>
                  <div className="metric-mini-value">{probabilityData?.confidence || 75}%</div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="coin-details-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="coin-details-header">
              <h3>Coin Details</h3>
              <Info size={16} className="info-icon" />
            </div>

            {coinDetails && (
              <div className="coin-details-content">
                <div className="coin-description">
                  <p>{coinDetails.description}</p>
                </div>

                <div className="coin-metrics">
                  <div className="coin-metric">
                    <div className="metric-icon">
                      <TrendingUp size={16} />
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">Market Dominance</div>
                      <div className="metric-value">{coinDetails.marketDominance.toFixed(2)}%</div>
                    </div>
                  </div>

                  <div className="coin-metric">
                    <div className="metric-icon">
                      <BarChart2 size={16} />
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">Volatility Score</div>
                      <div className="metric-value">{coinDetails.volatilityScore.toFixed(1)}/10</div>
                    </div>
                  </div>

                  <div className="coin-metric">
                    <div className="metric-icon">
                      <DollarSign size={16} />
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">All-Time High</div>
                      <div className="metric-value">${formatNumber(coinDetails.priceHistory.allTimeHigh)}</div>
                    </div>
                  </div>

                  <div className="coin-metric">
                    <div className="metric-icon">
                      <Clock size={16} />
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">YTD Change</div>
                      <div
                        className={`metric-value ${coinDetails.priceHistory.yearToDateChange >= 0 ? "positive" : "negative"}`}
                      >
                        {coinDetails.priceHistory.yearToDateChange >= 0 ? "+" : ""}
                        {coinDetails.priceHistory.yearToDateChange}%
                      </div>
                    </div>
                  </div>

                  <div className="coin-metric">
                    <div className="metric-icon">
                      <Award size={16} />
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">Liquidity Score</div>
                      <div className="metric-value">{coinDetails.liquidityScore}/100</div>
                    </div>
                  </div>

                  <div className="coin-metric">
                    <div className="metric-icon">
                      <AlertTriangle size={16} />
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">Risk Level</div>
                      <div className="metric-value">
                        {coinDetails.volatilityScore < 3 ? "Low" : coinDetails.volatilityScore < 7 ? "Medium" : "High"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="market-sentiment">
                  <h4>Market Sentiment</h4>
                  <div className="sentiment-bars">
                    <div className="sentiment-bar">
                      <div className="sentiment-label">Bullish</div>
                      <div className="sentiment-progress">
                        <div
                          className="sentiment-progress-bar bullish"
                          style={{ width: `${coinDetails.sentimentData.bullish}%` }}
                        ></div>
                      </div>
                      <div className="sentiment-value">{coinDetails.sentimentData.bullish}%</div>
                    </div>

                    <div className="sentiment-bar">
                      <div className="sentiment-label">Bearish</div>
                      <div className="sentiment-progress">
                        <div
                          className="sentiment-progress-bar bearish"
                          style={{ width: `${coinDetails.sentimentData.bearish}%` }}
                        ></div>
                      </div>
                      <div className="sentiment-value">{coinDetails.sentimentData.bearish}%</div>
                    </div>

                    <div className="sentiment-bar">
                      <div className="sentiment-label">Neutral</div>
                      <div className="sentiment-progress">
                        <div
                          className="sentiment-progress-bar neutral"
                          style={{ width: `${coinDetails.sentimentData.neutral}%` }}
                        ></div>
                      </div>
                      <div className="sentiment-value">{coinDetails.sentimentData.neutral}%</div>
                    </div>
                  </div>
                </div>

                <div className="exchange-distribution">
                  <h4>Trading Volume by Exchange</h4>
                  <div className="exchange-bars">
                    {coinDetails.exchanges.map((exchange, index) => (
                      <div className="exchange-bar" key={index}>
                        <div className="exchange-label">{exchange.name}</div>
                        <div className="exchange-progress">
                          <div className="exchange-progress-bar" style={{ width: `${exchange.percentage}%` }}></div>
                        </div>
                        <div className="exchange-value">{exchange.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="chart-controls">
        <div className="timeframe-selector">
          <span>Timeframe:</span>
          {["30m", "1h", "4h", "24h"].map((tf) => (
            <button
              key={tf}
              className={`timeframe-button ${timeframe === tf ? "active" : ""} ${pendingTimeframe === tf ? "pending" : ""}`}
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
          <motion.button
            className={`control-button stats-button ${showStats ? "active" : ""}`}
            onClick={handleStatsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Stats
          </motion.button>
          <motion.button
            className="control-button portfolio-button"
            onClick={handleAddToPortfolio}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Portfolio
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
      </div>
    </div>
  )
}

export default Predict

