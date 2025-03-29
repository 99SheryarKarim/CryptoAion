import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slices/AuthSlice";
import PredictSlice from "./Slices/PredictSlice";

const store = configureStore({
    reducer: {
        Auth: AuthSlice,
        Prediction: PredictSlice
    }
})

export default store;