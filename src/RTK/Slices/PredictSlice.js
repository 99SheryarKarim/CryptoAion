import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    predicted_next_price: null,
    actuals: [],
    predictions: []
}

export const PredictNextPrice = createAsyncThunk("predict/PredictNextPrice", async (_, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().Auth;        
        const response = await axios.post(
            'http://127.0.0.1:8000/pred/predict',
            '',
            {
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              }
            }
          );
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const FetchLastPredictions = createAsyncThunk("predict/FetchLastPredictions", async (_, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().Auth;        
        const response = await axios.post(
            'http://127.0.0.1:8000/pred/previous_predictions',
            '',
            {
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              }
            }
          );
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

const PredicSlice = createSlice({
    name: "predict",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(PredictNextPrice.fulfilled, (state, action) => {
                state.predicted_next_price = action.payload.predicted_price
            })
            .addCase(FetchLastPredictions.fulfilled, (state, action) => {
                state.actuals = action.payload.actuals
                state.predictions = action.payload.predictions
            })
})

export default PredicSlice.reducer;