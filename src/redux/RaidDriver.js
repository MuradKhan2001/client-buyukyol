import {createSlice} from "@reduxjs/toolkit"

export const RaidDriver = createSlice({
    name: "RaidDrivers",
    initialState: {
        data: []
    },
    reducers: {
        addRaidDriver: (state, {payload}) => {
            state.data = payload
        }
    }
})

export const {addRaidDriver} = RaidDriver.actions
export default RaidDriver.reducer