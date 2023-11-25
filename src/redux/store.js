import {configureStore} from "@reduxjs/toolkit"
import baseUrl from "./BaseUrl";
import Alerts from  "./AlertsBox";
import ModalContent  from  "./ModalContent"
import Orders from "./Orders";
export const store = configureStore({
    reducer: {
        baseUrl,
        Alerts,
        ModalContent,
        Orders
    }
})