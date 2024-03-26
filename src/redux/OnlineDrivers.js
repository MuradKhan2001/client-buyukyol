import {createSlice} from "@reduxjs/toolkit"

export const OnlineDriversList = createSlice({
    name: "OnlineDrivers",
    initialState: {
        data: []
    },
    reducers: {
        updateOnlineDriver: (state, {payload}) => {
            state.data = state.data.filter((item) => Number(item.driver) !== Number(payload));
        },
        addOnlineDriver: (state, {payload}) => {
            let driver = state.data.filter(item => Number(item.driver) !== Number(payload.driver))
            state.data = [...driver, payload]
        },
    }
})

export const {updateOnlineDriver, addOnlineDriver} = OnlineDriversList.actions
export default OnlineDriversList.reducer