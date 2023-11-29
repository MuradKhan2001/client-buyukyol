import {createSlice} from "@reduxjs/toolkit"

export const Distance = createSlice({
    name: "Distance",
    initialState: {
        data: ""
    },
    reducers: {
        getDistance: (state, {payload}) => {
            state.data = payload
        },
    }
})

export const {getDistance} = Distance.actions
export default Distance.reducer