import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const initialState = {
    username: null,
    token: localStorage.getItem("token") || null,
    toastStatus: "",
    loading: false,
    toastMessage: "",
    showToast: false
}

export const Login = createAsyncThunk("AuthSlice/Login", async ({ username, password }, { getState, rejectWithValue }) => {
    try {
        console.log(username, password);
        
        const response = await axios.post(
            'http://127.0.0.1:8000/auth/login',
            {
              'username': username,
              'password': password
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const Register = createAsyncThunk("AuthSlice/register", async ({ email, password }, { getState, rejectWithValue }) => {
    try {
        console.log(email, password)
        const response = await axios.post("http://127.0.0.1:8000/auth/register", {
            "username": email,
            "password": password
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }

})

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        },
        setToastStatus: (state, action) => {
            state.toastStatus = action.payload
        },
        setToastMessage: (state, action) => {
            state.toastMessage = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setShowToast: (state, action) => {
            state.showToast = action.payload
        },
        clearToken: (state) => {   
            console.log("HERERE");
                     
            state.token = null
            localStorage.removeItem("token")
        }
    },
    extraReducers: builder =>
        builder
        .addCase(Login.pending, (state) => {
            state.loading = true
        })
        .addCase(Login.fulfilled, (state, action) => {
            state.token = action.payload.access_token
            localStorage.setItem("token", action.payload.access_token)
            state.username = action.payload.username
            state.loading = false
            state.toastStatus = "success"
            state.toastMessage = "Login Success"
            state.showToast = true
        })
        .addCase(Login.rejected, (state, action) => {
            state.loading = false
            state.toastStatus = "error"
            state.toastMessage = action.payload.response.data.detail
            state.showToast = true
        })
        .addCase(Register.pending, (state) => {
            state.loading = true
        })
        .addCase(Register.fulfilled, (state, action) => {
            state.loading = false
            state.toastStatus = "success"
            state.toastMessage = "Register"
            state.showToast = true
        })
        .addCase(Register.rejected, (state, action) => {
            state.loading = false
            state.toastStatus = "error"            
            state.toastMessage = action.payload.response.data.detail
            state.showToast = true
        })
})

export const { setToken, setToastStatus, setToastMessage, setLoading, setShowToast, clearToken } = AuthSlice.actions
export default AuthSlice.reducer;