import {createSlice} from "@reduxjs/toolkit"

export const ActiveDriversList = createSlice({
    name: "ActiveDrivers",
    initialState: {
        data: []
    },
    reducers: {
        updateActiveDriver: (state, {payload}) => {
            state.data = state.data.filter((item) => Number(item.driver) !== Number(payload));
        },
        addActiveDriver: (state, {payload}) => {
            let driver = state.data.filter(item => Number(item.driver) !== Number(payload.driver))
            state.data = [...driver, payload]
        },
    }
})

export const {updateActiveDriver, addActiveDriver} = ActiveDriversList.actions
export default ActiveDriversList.reducer