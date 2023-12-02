import {createSlice} from "@reduxjs/toolkit"

export const DriversList = createSlice({
    name: "Drivers",
    initialState: {
        data: []
    },
    reducers: {
        updateDriver: (state, {payload}) => {
            state.data = payload
        },
        addDriver: (state, {payload}) => {
            state.data = [...state.data, payload]
        }
    }
})

export const {addDriver, updateDriver} = DriversList.actions
export default DriversList.reducer