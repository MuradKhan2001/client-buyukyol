import {createSlice} from "@reduxjs/toolkit"

export const Price = createSlice({
    name: "Price",
    initialState: {
        data: ""
    },
    reducers: {
        getPrice: (state, {payload}) => {
            state.data = payload
        },
    }
})

export const {getPrice} = Price.actions
export default Price.reducer