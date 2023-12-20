import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

export const getOrders = createAsyncThunk("getOrders", async (payload) => {
    return fetch(`https://api.buyukyol.uz/api/my-orders/`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
        }
    }).then((res) => res.json())

})

export const orderSlice = createSlice({
    name: "Orders", initialState: {data: [], status: "", activeOrders: ""}, reducers: {}, extraReducers: (builder) => {
        builder
            .addMatcher(getOrders, (state, {payload}) => {
                state.status = "pending"
            })

            .addMatcher((action) => action.type.endsWith('/rejected'), (state, {payload}) => {
                state.status = "rejected"
            })

            .addMatcher((action) => action.type.endsWith('/fulfilled'), (state, {payload}) => {
                state.status = "success";
                state.data = payload;
                state.activeOrders = payload.filter((item)=> item.status === "Active");
            })
    }
})

export default orderSlice.reducer