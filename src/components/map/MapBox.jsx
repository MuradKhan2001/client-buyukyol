import {useState, useMemo, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {GoogleMap, InfoWindow, Marker, useLoadScript} from "@react-google-maps/api";
import {GOOGLE_MAPS_API_KEY} from './googleMapsApi';
import "./style.scss";
import i18next from "i18next";
import Loader from "../loader/Loader";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {addAlert, delAlert} from "../../redux/AlertsBox";
import axios from "axios";
import {showModals} from "../../redux/ModalContent";

const libraries = ['places'];
const MapBox = () => {
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [center, setCenter] = useState()
    const [user, setUser] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {

        axios.get(`${baseUrl}api/client/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }
            ).then((response) => {
            setUser(response);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
            }
        });


    }, [])

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: libraries, language: i18next.language
    });
    const options = useMemo(() => ({
        disableDefaultUI: false, clickableIcons: false
    }), []);

    const onloadMap = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            let locMy = {lat: latitude, lng: longitude}
            setCenter(locMy)
        });

    }

    const postOrder = () => {
        if (user.is_block) {
            let idAlert = Date.now()
            let alert = {
                id: idAlert,
                text: "Profilingiz bloklangan!",
                img: "./images/red.png"
            }
            dispatch(addAlert(alert))
            setTimeout(() => {
                dispatch(delAlert(idAlert))
            }, 5000)
        } else navigate("/post-order")
    }


    if (!isLoaded) return <Loader/>;
    return <div className="map-container">

        <div className="header">
            <div onClick={()=>dispatch(showModals({show: true, status: "active-driver"}))} className="title">
                {t("nav-home")}
            </div>

            <div className="icons">

                <div onClick={()=>dispatch(showModals({show: true, status: "drivers"}))} className="icon-active-orders">
                    <img src="./images/truck.png" alt="truck"/>
                    <div className="count">
                        2
                    </div>
                </div>


                <div onClick={()=>dispatch(showModals({show: true, status: "active-orders"}))} className="icon-active-orders">
                    <img src="./images/box.png" alt="truck"/>
                    <div className="count">
                        3
                    </div>
                </div>

                <div onClick={postOrder} className="post-order">
                    Buyurtma berish
                </div>
            </div>
        </div>

        <GoogleMap
            zoom={10}
            onLoad={onloadMap}
            center={center}
            options={options}
            mapContainerClassName="map">

        </GoogleMap>

    </div>
}

export default MapBox