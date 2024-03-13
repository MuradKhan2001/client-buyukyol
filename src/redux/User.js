import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";


export const getUser = createAsyncThunk("getUser", async (payload) => {
    return fetch(`https://api.buyukyol.uz/api/client/`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
        }
    }).then(res => {
        res.json()
    })
})

export const userSlice = createSlice({
    name: "User", initialState: {data: [], status: ""}, reducers: {}, extraReducers: (builder) => {
        builder
            .addMatcher(getUser, (state, {payload}) => {
                state.status = "pending"
            })

            .addMatcher((action) => action.type.endsWith('/rejected'), (state, {payload}) => {
                state.status = "rejected"
            })

            .addMatcher((action) => action.type.endsWith('/fulfilled'), (state, {payload}) => {
                state.status = "success";
                state.data = payload
            })
    }
})

export default userSlice.reducer

