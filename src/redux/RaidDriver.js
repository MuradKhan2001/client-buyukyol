import {createSlice} from "@reduxjs/toolkit"


export const RaidDriver = createSlice({
    name: "RaidDrivers",
    initialState: {
        data: []
    },
    reducers: {
        addRaidDriver: (state, {payload}) => {
            state.data = payload
        },
        filterRaidDriver: (state, {payload}) => {
            state.data = payload.filter((item) => (item.status === "Delivered"))
        }
    }
})

export const {addRaidDriver,filterRaidDriver} = RaidDriver.actions
export default RaidDriver.reducer