"use client"

export function PredictionStrategy({ selectedStrategy, onSelectStrategy }) {
  const strategies = [
    {
      id: "direct",
      name: "Direct",
      description: "Picks the most likely outcome",
      isPro: false,
    },
    {
      id: "creative",
      name: "Creative",
      description: "Adds creativity to the most likely outcome",
      isPro: false,
    },
    {
      id: "balanced",
      name: "Balanced",
      description: "Explores multiple options in parallel",
      isPro: false,
    },
    {
      id: "advanced",
      name: "Advanced",
      description: "Select your parameters",
      isPro: true,
    },
  ]

  return (
    <div className="prediction-strategy">
      <h2 className="strategy-title">Prediction strategy</h2>
      <div className="strategy-options">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            className={`strategy-option ${selectedStrategy === strategy.id ? "selected" : ""}`}
            onClick={() => !strategy.isPro && onSelectStrategy(strategy.id)}
          >
            <div className="strategy-header">
              <span className="strategy-name">{strategy.name}</span>
              {strategy.isPro && <span className="pro-badge">PRO</span>}
            </div>
            <p className="strategy-description">{strategy.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

