import {configureStore} from "@reduxjs/toolkit"
import baseUrl from "./BaseUrl";
import Alerts from  "./AlertsBox";
import ModalContent  from  "./ModalContent"
import Orders from "./Orders";
import DriversList from "./driversList";
import Distance from "./distance";
import Price from "./Price";

export const store = configureStore({
    reducer: {
        baseUrl,
        Alerts,
        ModalContent,
        Orders,
        DriversList,
        Distance,
        Price

    }
})