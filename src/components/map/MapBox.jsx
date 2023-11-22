import {useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {GoogleMap, InfoWindow, Marker, useLoadScript} from "@react-google-maps/api";
import {GOOGLE_MAPS_API_KEY} from './googleMapsApi';
import "./style.scss";
import i18next from "i18next";
import Loader from "../loader/Loader";
import {useTranslation} from "react-i18next";

const libraries = ['places'];
const MapBox = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [center, setCenter] = useState()

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: libraries, language: i18next.language
    });
    const options = useMemo(() => ({
        disableDefaultUI: false, clickableIcons: false
    }), []);
    if (!isLoaded) return <Loader/>;

    const onloadMap = () => {

        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            let locMy = {lat: latitude, lng: longitude}
            setCenter(locMy)
        });

    }

    return <div className="map-container">

        <div className="header">
           <div className="title">
               {t("nav-home")}
           </div>

            <div className="icons">
                <div className="icon-active-orders">
                    <img src="./images/truck.png" alt="truck"/>
                    <div className="count">
                        2
                    </div>
                </div>
                <div className="icon-active-orders">
                    <img src="./images/box.png" alt="truck"/>
                    <div className="count">
                        3
                    </div>
                </div>

                <div onClick={()=> navigate("/post-order")} className="post-order">
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