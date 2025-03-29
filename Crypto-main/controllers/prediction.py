import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
import yfinance as yf
import joblib
from sklearn.preprocessing import MinMaxScaler
# import plotly.graph_objects as go
# from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Download BTC data (Hourly data)
CRYPTO_PAIR = "BTC-USD"
LOOKBACK = 60
EPOCHS = 50

def get_latest_data(symbol=CRYPTO_PAIR):
    data = yf.download(tickers=symbol, period="60d", interval="1h")
    if data.empty:
        raise ValueError("No data retrieved. Adjust period or interval.")
    
    # Add technical indicators
    data['SMA_10'] = data['Close'].rolling(window=10).mean()
    data['RSI'] = 100 - (100 / (1 + (data['Close'].diff().rolling(14).mean() / data['Close'].diff().rolling(14).std())))
    data['MACD'] = data['Close'].ewm(span=12, adjust=False).mean() - data['Close'].ewm(span=26, adjust=False).mean()
    data['Bollinger_Upper'] = data['Close'].rolling(window=20).mean() + 2 * data['Close'].rolling(window=20).std()
    data['Bollinger_Lower'] = data['Close'].rolling(window=20).mean() - 2 * data['Close'].rolling(window=20).std()
    data.dropna(inplace=True)
    
    return data

def predict_next_price(symbol=CRYPTO_PAIR):
    try:
        # Load the model and scaler
        model, X_train, scaler, scaled_data = get_model()
        
        # Fetch latest data
        latest_data = get_latest_data(symbol)
        
        # Normalize features
        scaled_features = scaler.transform(latest_data[['Close', 'SMA_10', 'RSI', 'MACD', 'Bollinger_Upper', 'Bollinger_Lower']])
        
        # Extract the last `LOOKBACK` data points as input
        X_input = scaled_features[-LOOKBACK:].reshape(1, LOOKBACK, 6)  # Shape: (1, 60, 6)
        
        # Make prediction
        with torch.no_grad():
            model.eval()
            input_tensor = torch.FloatTensor(X_input)
            prediction_scaled = model(input_tensor).numpy()
        
        # Denormalize the prediction
        prediction = scaler.inverse_transform(
            np.concatenate([prediction_scaled, np.zeros((1, 5))], axis=1)
        )[0, 0]
        
        # Return the next price and timestamp
        last_timestamp = latest_data.index[-1]
        next_timestamp = last_timestamp + pd.Timedelta(hours=1)  # Assuming hourly data

        print(X_input)
        
        return {
            "symbol": symbol,
            "predicted_price": float(prediction),
            # "timestamp": next_timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
    
    except Exception as e:
        return {"error": str(e)}

class BiLSTMWithAttention(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers):
        super(BiLSTMWithAttention, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, bidirectional=True)
        self.attn = nn.Linear(hidden_size * 2, 1)
        self.fc = nn.Linear(hidden_size * 2, 1)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        attention_weights = torch.softmax(self.attn(lstm_out), dim=1)
        attended_output = torch.sum(attention_weights * lstm_out, dim=1)
        return self.fc(attended_output)


# Feature Engineering (Include Moving Averages, RSI, MACD, and Bollinger Bands)
def add_technical_indicators():
    data = yf.download(tickers=CRYPTO_PAIR, period="60d", interval="1h")

    if data.empty:
        raise ValueError("No data retrieved. Adjust period or interval.")

    data['SMA_10'] = data['Close'].rolling(window=10).mean()
    data['RSI'] = 100 - (100 / (1 + (data['Close'].diff().rolling(14).mean() / data['Close'].diff().rolling(14).std())))
    data['MACD'] = data['Close'].ewm(span=12, adjust=False).mean() - data['Close'].ewm(span=26, adjust=False).mean()
    data['Bollinger_Upper'] = data['Close'].rolling(window=20).mean() + 2 * data['Close'].rolling(window=20).std()
    data['Bollinger_Lower'] = data['Close'].rolling(window=20).mean() - 2 * data['Close'].rolling(window=20).std()
    data.dropna(inplace=True)

    # Normalize Data
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data[['Close', 'SMA_10', 'RSI', 'MACD', 'Bollinger_Upper', 'Bollinger_Lower']])

    # Prepare Input for LSTM
    X, y = [], []
    for i in range(len(scaled_data) - LOOKBACK - 1):
        X.append(scaled_data[i:i+LOOKBACK])
        y.append(scaled_data[i+LOOKBACK, 0])
    X, y = np.array(X), np.array(y)

    # Convert to Tensors
    X_train, y_train = torch.FloatTensor(X), torch.FloatTensor(y)

    model = BiLSTMWithAttention(input_size=6, hidden_size=128, num_layers=3)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.0005)

    return X_train, y_train, model, criterion, optimizer, scaler, scaled_data

# Train Model
MODEL_PATH = "bilstm_attention_model.pth"

# Check if the model already exists
def get_model():
    X_train, y_train, model, criterion, optimizer, scaler, scaled_data = add_technical_indicators()
    if os.path.exists(MODEL_PATH):
        print("Loading pre-trained model...")
        # Initialize the model architecture
        model = BiLSTMWithAttention(input_size=6, hidden_size=128, num_layers=3)
        # Load the saved state dictionary
        model.load_state_dict(torch.load(MODEL_PATH))
        # model.eval()  # Set the model to evaluation mode
    else:
        print("Training the model...")
        for epoch in range(EPOCHS):
            model.train()
            optimizer.zero_grad()
            output = model(X_train)
            loss = criterion(output.squeeze(), y_train)
            loss.backward()
            optimizer.step()
            if epoch % 10 == 0:
                print(f"Epoch {epoch}, Loss: {loss.item()}")

        # Save the trained model
        torch.save(model.state_dict(), MODEL_PATH)
        print("Model saved.")

    return model, X_train, scaler, scaled_data


# Prepare Data for Prediction
def prepare_data_for_prediction():
    model, X_train, scaler, scaled_data = get_model()
    model.eval()
    predictions = model(X_train).detach().numpy()
    predictions = scaler.inverse_transform(np.column_stack((predictions, np.zeros((len(predictions), 5)))))[:, 0]

    actual_prices = scaler.inverse_transform(scaled_data[-len(predictions):])[:, 0]

    print("Actual Price\tPredicted Price")
    for actual, predicted in zip(actual_prices, predictions):
        print(f"{actual:.2f}\t\t{predicted:.2f}")

    return actual_prices, predictions

prepare_data_for_prediction()


# Plot Results with Plotly
# fig = go.Figure()
# fig.add_trace(go.Scatter(x=data.index[-len(predictions):], y=scaler.inverse_transform(scaled_data[-len(predictions):])[:, 0], mode='lines', name='Actual'))
# fig.add_trace(go.Scatter(x=data.index[-len(predictions):], y=predictions, mode='lines', name='Predicted'))
# fig.update_layout(title='BTC Price Prediction using BiLSTM + Attention', xaxis_title='Time', yaxis_title='Price (USD)')
# fig.show()