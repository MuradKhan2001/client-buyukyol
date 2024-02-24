import {useState, useMemo, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";
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

const libraries = ["places"];

const MapBoxMobile = () => {
    const baseUrl = useSelector((store) => store.baseUrl.data);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [center, setCenter] = useState();
    const [user, setUser] = useState("");
    const dispatch = useDispatch();
    const activeOrders = useSelector((store) => store.Orders.activeOrders);
    const drivers = useSelector((store) => store.DriversList.data);
    const Activedrivers = useSelector((store) => store.ActiveDriversList.data);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            let locMy = {lat: latitude, lng: longitude};
            setCenter(locMy);
        });
        dispatch(getOrders());
        axios.get(`${baseUrl}api/client/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                if (error.response.statusText == "Unauthorized") {
                    window.location.pathname = "/";
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                }
            });
    }, []);

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: libraries, language: i18next.language,
    });

    const options = useMemo(() => ({
        disableDefaultUI: true, clickableIcons: false,
    }), []);

    const postOrder = () => {
        if (user.is_block) {
            let idAlert = Date.now();
            let alert = {
                id: idAlert, text: t("block"), img: "./images/red.svg", color:"#FFEDF1"
            };
            dispatch(addAlert(alert));
            setTimeout(() => {
                dispatch(delAlert(idAlert));
            }, 5000);
        } else navigate("/post-order");
    };

    const showInfo = (status) => {
        if (drivers.length > 0 && status === "drivers") dispatch(showModals({show: true, status: status}));

        if (activeOrders.length > 0 && status === "active-orders") dispatch(showModals({
            show: true,
            status: "active-orders"
        }));
    };

    const truckIcon = {
        url: "./images/location-pin-truck.png", scaledSize: {width: 60, height: 60},
    };

    if (!isLoaded) return <Loader/>;
    return (<div className="map-container">

        <div className="header">
            <div></div>
            <div className="title">
                {t("nav-home")}
            </div>

            <div onClick={() => navigate("/news")} className="icon-news">
                <img src="./images/news.png" alt=""/>
            </div>
        </div>

        <GoogleMap
            zoom={5}
            center={center}
            options={options}
            mapContainerClassName="map"
        >
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
            </div>
            
            {Activedrivers.length >= 0 ? (<>
                {Activedrivers.map((item) => {
                    return (<Marker
                        key={item.driver}
                        icon={truckIcon}
                        position={{
                            lat: Number(item.latitude), lng: Number(item.longitude),
                        }}
                        onClick={() => dispatch(showModals({show: true, status: "active-driver", item}))}
                    />);
                })}
            </>) : ("")}

            <div className="bottom-btn">
                <div onClick={postOrder} className="post-order">
                    {t("post-order")}
                </div>
            </div>
        </GoogleMap>

    </div>);
};

export default MapBoxMobile;
