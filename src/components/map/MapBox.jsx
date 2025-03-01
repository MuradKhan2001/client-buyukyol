import {useState, useMemo, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
    GoogleMap,
    Marker,
    useLoadScript,
    MarkerClusterer,
} from "@react-google-maps/api";
import {GOOGLE_MAPS_API_KEY} from "./googleMapsApi";
import "./style.scss";
import i18next from "i18next";
import Loader from "../loader/Loader";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {addAlert, delAlert} from "../../redux/AlertsBox";
import axios from "axios";
import {showModals} from "../../redux/ModalContent";
import {getOrders} from "../../redux/Orders";
import MapBoxMobile from "../map-mobile/MapBoxMobile";

const libraries = ["places"];

const MapBox = () => {
    const baseUrl = useSelector((store) => store.baseUrl.data);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [center, setCenter] = useState();
    const [user, setUser] = useState("");
    const dispatch = useDispatch();
    const activeOrders = useSelector((store) => store.Orders.activeOrders);
    const drivers = useSelector((store) => store.DriversList.data);
    const Activedrivers = useSelector((store) => store.ActiveDriversList.data);
    const Onlinedrivers = useSelector((store) => store.OnlineDriversList.data);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            let locMy = {lat: latitude, lng: longitude};
            setCenter(locMy);
        });
        dispatch(getOrders());

        axios
            .get(`${baseUrl}api/client/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    window.location.pathname = "/";
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                }
            });
    }, []);

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        language: i18next.language,
    });

    const options = useMemo(
        () => ({
            disableDefaultUI: false,
            clickableIcons: false,
        }),
        []
    );

    const postOrder = () => {
        if (user.is_block) {
            let idAlert = Date.now();
            let alert = {
                id: idAlert,
                text: t("block"),
                img: "./images/red.svg",
                color: "#FFEDF1",
            };
            dispatch(addAlert(alert));
            setTimeout(() => {
                dispatch(delAlert(idAlert));
            }, 5000);
        } else navigate("/post-order");
    };

    const showInfo = (status) => {
        if (drivers.length > 0 && status === "drivers")
            dispatch(showModals({show: true, status: status}));

        if (activeOrders.length > 0 && status === "active-orders")
            dispatch(
                showModals({
                    show: true,
                    status: "active-orders",
                })
            );
    };

    const truckIconOnline = {
        url: "./images/truck4.png",
        scaledSize: {width: 50, height: 45},
    };

    const truckIconActive = {
        url: "./images/truck3.png",
        scaledSize: {width: 70, height: 65},
    };

    if (!isLoaded) return <Loader/>;
    return (
        <div className="map-container">
            <div className="map-box-desktop">
                <div className="header">
                    <div className="title">{t("nav-home")}</div>

                    <div className="icons">
                        <div
                            onClick={() => showInfo("drivers")}
                            className="icon-active-drivers"
                        >
                            <img src="./images/truck.png" alt="truck"/>
                            <div className="count">{drivers.length}</div>
                        </div>

                        <div
                            onClick={() => showInfo("active-orders")}
                            className="icon-active-orders"
                        >
                            <img src="./images/box.png" alt="truck"/>
                            <div className="count">{activeOrders.length}</div>
                        </div>

                        <div onClick={postOrder} className="post-order">
                            {t("post-order")}
                        </div>
                    </div>
                </div>

                <GoogleMap
                    zoom={10}
                    center={center}
                    options={options}
                    mapContainerClassName="map"
                >
                    {/* {Activedrivers.length >= 0 ? (
            <>
              {Activedrivers.map((item) => {
                return (
                  <Marker
                    key={item.driver}
                    icon={truckIconActive}
                    position={{
                      lat: Number(item.latitude),
                      lng: Number(item.longitude),
                    }}
                    onClick={() =>
                      dispatch(
                        showModals({
                          show: true,
                          status: "active-driver",
                          item,
                        })
                      )
                    }
                  />
                );
              })}
            </>
          ) : (
            ""
          )} */}

                    {/* {Onlinedrivers.length >= 0 ? (
            <>
              {Onlinedrivers.map((item) => {
                return (
                  <Marker
                    key={item.driver}
                    icon={truckIconOnline}
                    position={{
                      lat: Number(item.latitude),
                      lng: Number(item.longitude),
                    }}
                  />
                );
              })}
            </>
          ) : (
            ""
          )} */}

                    {Onlinedrivers.length > 0 ? (
                        <>
                            <MarkerClusterer gridSize={60}>
                                {(clusterer) =>
                                    Onlinedrivers.map((item) => (
                                        <Marker
                                            key={item.driver}
                                            icon={truckIconOnline}
                                            position={{
                                                lat: Number(item.latitude),
                                                lng: Number(item.longitude),
                                            }}
                                            clusterer={clusterer}
                                        />
                                    ))
                                }
                            </MarkerClusterer>
                        </>
                    ) : (
                        ""
                    )}

                    {Activedrivers.length > 0 ? (
                        <>
                            <MarkerClusterer gridSize={60}>
                                {(clusterer) =>
                                    Activedrivers.map((item) => (
                                        <Marker
                                            key={item.driver}
                                            icon={truckIconActive}
                                            position={{
                                                lat: Number(item.latitude),
                                                lng: Number(item.longitude),
                                            }}
                                            onClick={() =>
                                                dispatch(
                                                    showModals({
                                                        show: true,
                                                        status: "active-driver",
                                                        item,
                                                    })
                                                )
                                            }
                                            clusterer={clusterer}
                                        />
                                    ))
                                }
                            </MarkerClusterer>
                        </>
                    ) : (
                        ""
                    )}
                </GoogleMap>
            </div>

            <div className="map-box-mobile">
                <MapBoxMobile/>
            </div>
        </div>
    );
};

export default MapBox;
