import React, {useMemo, useState, useEffect, createContext} from "react";
import {Routes, Route} from "react-router-dom";
import NotFound from "../notFound/NotFound";
import {userRoutes, loginRoutes} from "../../routes/Routes";
import {useDispatch, useSelector} from "react-redux";
import {w3cwebsocket as W3CWebSocket} from "websocket"
import {addAlert, delAlert} from "../../redux/AlertsBox";
import {addDriver, filterDriver, filterDriverDelivered, updateDriver} from "../../redux/driversList";
import {filterRaidDriver,addRaidDriver} from "../../redux/RaidDriver";
import {getDistance} from "../../redux/distance";
import {getPrice} from "../../redux/Price";
import {getOrders} from "../../redux/Orders";
import {hideModal} from "../../redux/ModalContent";
import {addActiveDriver, updateActiveDriver} from "../../redux/ActiveDriversList";
import {useTranslation} from "react-i18next";

export const webSockedContext = createContext();

const App = () => {
    const {t} = useTranslation();
    const user = useMemo(() => localStorage.getItem('token'), []);
    const routes = useMemo(() => {
        if (user) return userRoutes;
        return loginRoutes
    }, [user]);
    const dispatch = useDispatch();
    const [sockedContext, setSockedContext] = useState(null);
    const drivers = useSelector((store) => store.DriversList.data);

    useEffect(() => {
        if (!localStorage.getItem("token")) return () => {}

        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            const location = `${latitude}/${longitude}`;
            const websocket = new W3CWebSocket(`wss://api.buyukyol.uz/ws/orders/${location}/?token=${localStorage.getItem("token")}`);
            setSockedContext(websocket);
            let idAlertError = Date.now();

            websocket.onclose = () => {
                window.location.reload()
            }
            websocket.onerror = (event) => {
                let alert = {
                    id: idAlertError, text: t("net"), img: "./images/red.svg",color:"#FFEDF1"
                };
                dispatch(addAlert(alert));
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            };
            websocket.onopen = () => {
                dispatch(delAlert(idAlertError));
            }
        },(error) => {
            let idAlertError = Date.now();
            let alert = {
                id: idAlertError, text: t("geoLocationError"), img: "./images/yellow.svg",color:"#FFFAEA"
            };
            dispatch(addAlert(alert));
        });

    }, []);

    useEffect(() => {

        setSockedContext(websocket => {
            if (!websocket) return null

            websocket.onmessage = (event) => {

                const data = JSON.parse(event.data);

                if (!("status" in data.message)) {
                    dispatch(filterDriver(data.message));
                    dispatch(filterRaidDriver(data.message));
                }

                if (data.message.status) {

                    if (data.message.status === "distance") {
                        dispatch(getDistance(data.message.distance));
                    }

                    if (data.message.status === "Price") {
                        dispatch(getPrice(data.message));
                    }

                    if (data.message.status === "confirmed" || data.message.status === "Added") {
                        let idAlert = Date.now();
                        let alert = {
                            id: idAlert, text: t("alert1"), img: "./images/green.svg",color:"#EDFFFA"
                        };
                        dispatch(addAlert(alert));
                        setTimeout(() => {
                            dispatch(delAlert(idAlert));
                        }, 5000);

                        dispatch(getOrders());
                    }

                    if (data.message.status === "canceled") {
                        let idAlert = Date.now();
                        let alert = {
                            id: idAlert, text: t("alert2"), img: "./images/red.svg",color:"#FFEDF1"
                        };
                        dispatch(addAlert(alert));
                        setTimeout(() => {
                            dispatch(delAlert(idAlert));
                        }, 5000);

                        dispatch(getOrders());
                        dispatch(hideModal({show: false}));

                        dispatch(updateDriver(data.message));

                        if (data.message.driver_id) {
                            dispatch(updateActiveDriver(data.message.driver_id));
                        }
                    }

                    if (data.message.status === "Accepted") {
                        let idAlert = Date.now();
                        let alert = {
                            id: idAlert, text: t("alert8"), img: "./images/green.svg",color:"#EDFFFA"
                        };
                        dispatch(addAlert(alert));
                        setTimeout(() => {
                            dispatch(delAlert(idAlert));
                        }, 30000);

                        dispatch(addDriver(data.message));
                        dispatch(getOrders());
                    }

                    if (data.message.status === "delivering") {
                        let idAlert = Date.now();
                        let alert = {
                            id: idAlert, text: t("alert9"), img: "./images/green.svg",color:"#EDFFFA"
                        };
                        dispatch(addAlert(alert));
                        setTimeout(() => {
                            dispatch(delAlert(idAlert));
                        }, 5000);
                    }

                    if (data.message.status === "delivered") {
                        let idAlert = Date.now();
                        let alert = {
                            id: idAlert, text: t("alert10"), img: "./images/green.svg",color:"#EDFFFA"
                        };
                        dispatch(addAlert(alert));
                        setTimeout(() => {
                            dispatch(delAlert(idAlert));
                        }, 10000);

                        let newRaidDriver = drivers.filter((item) => Number(item.id) === Number(data.message.id))

                        dispatch(addRaidDriver(newRaidDriver));
                        dispatch(filterDriverDelivered(data.message.id));
                        dispatch(updateActiveDriver(newRaidDriver[0].driver.id));
                    }

                    if (data.message.status === "location") {
                        dispatch(addActiveDriver(data.message.driver));
                    }
                }

                if (data.message.status === false) {
                    if (data.message === "invalid token") {
                        window.location.pathname = "/";
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                    }
                }
            };

            return websocket
        })

    }, [sockedContext, drivers])

    return <webSockedContext.Provider value={sockedContext}>
        <Routes>
            {routes.map((route, index) => (<Route key={index} {...route} />))}
            <Route path={'*'} element={<NotFound/>}/>
        </Routes>
    </webSockedContext.Provider>
};

export default App;