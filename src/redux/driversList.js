import {createSlice} from "@reduxjs/toolkit"

export const DriversList = createSlice({
    name: "Drivers",
    initialState: {
        data: []
    },
    reducers: {
        updateDriver: (state, {payload}) => {
            state.data = state.data.filter((item) => Number(item.order_id) !== Number(payload.order_id));
        },
        filterDriver: (state, {payload}) => {
            state.data = payload.filter((item) => item.status !== "Delivered");
        },
        filterDriverDelivered: (state, {payload}) => {
            state.data = state.data.filter((item) => Number(item.id) !== Number(payload));
        },
        addDriver: (state, {payload}) => {
            state.data = [...state.data, payload]
        }
    }
})

export const {addDriver, updateDriver, filterDriver, filterDriverDelivered} = DriversList.actions
export default DriversList.reducer