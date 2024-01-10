import {useEffect, useRef, useState, useMemo, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {addAlert, delAlert} from "../../redux/AlertsBox";
import "./style.scss";
import i18next from "i18next";
import Loader from "../loader/Loader";
import axios from "axios";
import {useFormik} from 'formik';
import {CSSTransition} from "react-transition-group";
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";
import {GOOGLE_MAPS_API_KEY} from './googleMapsApi';
import {webSockedContext} from "../app/App";
import usePlacesAutocomplete, {
    getGeocode, getLatLng,
} from "use-places-autocomplete";
import {Combobox, ComboboxInput, ComboboxOption} from "@reach/combobox";
import "@reach/combobox/styles.css";
import {getDistance} from "../../redux/distance";
import {getPrice} from "../../redux/Price";


const libraries = ['places'];

const PostOrder = () => {
    let webSocked = useContext(webSockedContext);
    const distance = useSelector((store) => store.Distance.data)
    const price = useSelector((store) => store.Price.data)
    const {t} = useTranslation();
    const navigate = useNavigate();
    const nodeRef = useRef(null);
    const ref = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const dispatch = useDispatch()
    const baseUrl = useSelector((store) => store.baseUrl.data)

    const [categories, setCategories] = useState([])
    const [trucks, setTrucks] = useState([])
    const [direction, setDirection] = useState("")
    const [category, setCategory] = useState("")
    const [infoTruck, setInfoTruck] = useState("")

    const [nextPage, setNextPage] = useState(false)

    const [cargoInfo, setCargoInfo] = useState({})
    const [cargoInfoAll, setCargoInfoAll] = useState({})
    const [unit, setUnit] = useState(t("infoWaits1"))
    const [payment_type, setPayment_type] = useState(t("payment1"))
    const [currency, setCurrency] = useState("UZS")
    const [wait_type, setWait_type] = useState(t("waitCount1"))

    const [modalShow, setModalShow] = useState({show: false})
    const [plusInformation, setPlusInformation] = useState(false)

    const [center, setCenter] = useState(null)
    const [locationFrom, setLocationFrom] = useState(false)
    const [locationFromAddress, setLocationFromAddress] = useState("")
    const [locationTo, setLocationTo] = useState(false)
    const [locationCode, setLocationCode] = useState(false)
    const [locationToAddress, setLocationToAddress] = useState("")
    const [searchLocationAddress, setSearchLocationAddress] = useState("")
    const [selected, setSelected] = useState(null);
    const [validateLocationFrom, setValidateLocationFrom] = useState(false);
    const [validateLocationTo, setValidateLocationTo] = useState(false);

    const validate = values => {
        const errors = {};

        if (!values.cargo) {
            errors.cargo = 'Required';
        } else if (values.cargo.length > 30) {
            errors.cargo = t("validate1");
        }

        if (!values.capacity) {
            errors.capacity = 'Required';
        } else if (values.capacity.length > 5) {
            errors.capacity = t("validate2");
        } else if (isNaN(Number(values.capacity)) || Number(values.capacity) < 0) {
            errors.capacity = t("validate3");
        }

        if (!values.price && direction === "Abroad") {
            errors.price = 'Required';
        } else if (isNaN(Number(values.price))) {
            errors.price = t("validate4");
        } else if (values.price.length >= 10) {
            errors.price = t("validate5");
        } else if (Number(values.price) < 0) {
            errors.price = t("validate6");
        }

        if (isNaN(Number(values.number_cars))) {
            errors.number_cars = t("validate7");
        } else if (Number(values.number_cars) > 20) {
            errors.number_cars = t("validate8");
        }
        if (Number(values.number_cars) < 0) {
            errors.number_cars = t("validate9");
        }


        if (isNaN(Number(values.wait_cost))) {
            errors.wait_cost = t("validate4");
        } else if (Number(values.price) <= Number(values.wait_cost) && direction === "Abroad") {
            errors.wait_cost = t("validate10");
        } else if (Number(values.wait_cost) < 0) {
            errors.wait_cost = t("validate6");
        }

        if (isNaN(Number(values.avans))) {
            errors.avans = t("validate4");
        } else if (Number(values.price) <= Number(values.avans) && direction === "Abroad") {
            errors.avans = t("validate11");
        } else if (Number(values.avans) < 0) {
            errors.avans = t("validate6");
        }

        return errors;
    };

    const [cargo, setCargo] = useState({
        command: "new_order",
        client: Number(localStorage.getItem("userId")),
        type: "",
        car_category: "",
        car_body_type: "",
        address_from: "",
        latitude_from: "",
        longitude_from: "",
        address_to: "",
        latitude_to: "",
        longitude_to: "",
        payment_type: t("payment1"),
        unit: t("infoWaits1"),
        currency: "UZS",
        wait_type: t("waitCount1"),
    })

    const formik = useFormik({
        initialValues: {
            cargo: '',
            capacity: '',
            price: "",
            number_cars: 1,
            load_time: "2024-01-01T00:00",
            start_time: "2024-01-01T00:00",
            wait_cost: "",
            avans: "",
        },
        validate,
        onSubmit: values => {
            if (locationFromAddress && locationToAddress) {

                if (values.start_time === "2024-01-01T00:00" || values.load_time === "2024-01-01T00:00") {
                    values.start_time = ""
                    values.load_time = ""
                    setCargoInfo(prevState => prevState = values)
                } else setCargoInfo(prevState => prevState = values)

                showModalForm("order", true)

                if (direction !== "Abroad") {
                    SendOrder("new_order")
                }

            } else if (locationFromAddress === "" && locationToAddress === "") {

                setValidateLocationFrom(true)
                setValidateLocationTo(true)

            } else if (locationFromAddress === "") {

                setValidateLocationFrom(true)

            } else if (locationToAddress === "") setValidateLocationTo(true)

        },

    });

    useEffect(() => {
        axios.get(`${baseUrl}api/car-category/`).then((response) => {
            let re = response.data.reverse();
            setCategories(re);
        })
    }, [])

    const getTrucks = (categoryId) => {
        cargo.car_category = categoryId
        setCategory(categoryId)
        axios.get(`${baseUrl}api/car-category/${categoryId}`, {}).then((response) => {
            setTrucks(response.data);
        })
    }

    const getDirection = (direction) => {
        cargo.type = direction
        setDirection(direction)
    }

    const showModalForm = (status, show) => {
        let modal = {
            show,
            status
        }
        setModalShow(modal)
    }

    const selectAddressIcon = {url: './images/address.png', scaledSize: {width: 45, height: 50}};

    const PlacesAutocomplete = ({setSelected}) => {
        const {
            ready, value, setValue, suggestions: {status, data}, clearSuggestions,
        } = usePlacesAutocomplete({
            requestOptions: {
                language: i18next.language,
            },
        });

        const handleSelect = async (address) => {
            const results = await getGeocode({address});
            const {lat, lng} = await getLatLng(results[0]);

            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&lan=en`;

            axios.get(`${url}`, {
                headers: {
                    "Accept-Language": i18next.language
                }
            }).then((res) => {

                let city = res.data.address.city;
                let country = res.data.address.country;
                let suburb = res.data.address.suburb;
                let neighbourhood = res.data.address.neighbourhood;
                let county = res.data.address.county;
                let road = res.data.address.road;
                let fullAddress = `${country ? country + "," : ""} ${city ? city + "," : ""} ${suburb ? suburb + "," : ""} 
            ${neighbourhood ? neighbourhood + "," : ""} ${county ? county + "," : ""} ${road ? road : ""}`

                if (direction === "OUT") {
                    if (res.data.address.country_code === "uz") {

                        if (locationToAddress || locationFromAddress) {

                            if (res.data.address["ISO3166-2-lvl4"] !== locationCode) {

                                setSearchLocationAddress(fullAddress)
                                setSelected({lat, lng})
                                setCenter({lat, lng});
                                setValue(address, false);
                                clearSuggestions();
                            } else {
                                setSearchLocationAddress("")
                                setSelected(null)
                                let idAlert = Date.now();
                                let alert = {
                                    id: idAlert,
                                    text: t("errorLocations"),
                                    img: "./images/red.svg",
                                    color: "#FFEDF1"
                                };
                                dispatch(addAlert(alert));
                                setTimeout(() => {
                                    dispatch(delAlert(idAlert));
                                }, 5000);
                            }

                        } else {
                            setSearchLocationAddress(fullAddress)
                            setSearchLocationAddress(fullAddress)
                            setSelected({lat, lng})
                            setCenter({lat, lng});
                            setValue(address, false);
                            clearSuggestions();
                            setLocationCode(res.data.address["ISO3166-2-lvl4"])
                        }

                    } else {
                        let idAlert = Date.now();
                        let alert = {
                            id: idAlert, text: t("errorLocations"), img: "./images/red.svg", color: "#FFEDF1"
                        };
                        dispatch(addAlert(alert));
                        setTimeout(() => {
                            dispatch(delAlert(idAlert));
                        }, 5000);
                        setSearchLocationAddress("")
                        setSelected(null)
                    }
                }

                if (direction === "IN") {
                    if (res.data.address.country_code === "uz") {
                        if (locationToAddress || locationFromAddress) {

                            if (res.data.address["ISO3166-2-lvl4"] === locationCode) {
                                setSearchLocationAddress(fullAddress)
                                setSearchLocationAddress(fullAddress)
                                setSelected({lat, lng})
                                setCenter({lat, lng});
                                setValue(address, false);
                                clearSuggestions();
                            } else {
                                setSearchLocationAddress("")
                                setSelected(null)
                                let idAlert = Date.now();
                                let alert = {
                                    id: idAlert,
                                    text: t("errorLocations"),
                                    img: "./images/red.svg",
                                    color: "#FFEDF1"
                                };
                                dispatch(addAlert(alert));
                                setTimeout(() => {
                                    dispatch(delAlert(idAlert));
                                }, 5000);
                            }

                        } else {
                            setSearchLocationAddress(fullAddress)
                            setSelected({lat, lng})
                            setCenter({lat, lng});
                            setValue(address, false);
                            clearSuggestions();
                            setLocationCode(res.data.address["ISO3166-2-lvl4"])
                        }

                    } else {
                        let idAlert = Date.now();
                        let alert = {
                            id: idAlert, text: t("errorLocations"), img: "./images/red.svg", color: "#FFEDF1"
                        };
                        dispatch(addAlert(alert));
                        setTimeout(() => {
                            dispatch(delAlert(idAlert));
                        }, 5000);
                        setSearchLocationAddress("")
                        setSelected(null)
                    }
                }

                if (direction === "Abroad") {
                    if (locationToAddress || locationFromAddress) {

                        if (res.data.address.country_code !== locationCode) {
                            setSearchLocationAddress(fullAddress)
                            setSearchLocationAddress(fullAddress)
                            setSelected({lat, lng})
                            setCenter({lat, lng});
                            setValue(address, false);
                            clearSuggestions();
                        } else {
                            setSearchLocationAddress("")
                            setSelected(null)
                            let idAlert = Date.now();
                            let alert = {
                                id: idAlert, text: t("errorLocations"), img: "./images/red.svg", color: "#FFEDF1"
                            };
                            dispatch(addAlert(alert));
                            setTimeout(() => {
                                dispatch(delAlert(idAlert));
                            }, 5000);
                        }

                    } else {
                        setSearchLocationAddress(fullAddress)
                        setSearchLocationAddress(fullAddress)
                        setSelected({lat, lng})
                        setCenter({lat, lng});
                        setValue(address, false);
                        clearSuggestions();
                        setLocationCode(res.data.address.country_code)
                    }
                }
            })
        };

        return (<Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className="combobox-input"
                placeholder={t("input1")}
            />

            <div className="address-wrapper">
                <div className="list-address">
                    {status === "OK" && data.map(({place_id, description}) => (
                        <ComboboxOption key={place_id} value={description}/>))}
                </div>
            </div>
        </Combobox>);
    };

    const getAddressLocation = () => {
        if (locationFrom) {
            if (searchLocationAddress && selected) {
                cargo.address_from = searchLocationAddress
                setLocationFromAddress(searchLocationAddress)
                setLocationTo(false)
                setSelected(null)

                cargo.latitude_from = Number(selected.lat.toString().slice(0, 9))
                cargo.longitude_from = Number(selected.lng.toString().slice(0, 9))
                onloadMap()
                showModalForm("", false)
                setValidateLocationFrom(false)
            } else {
                let idAlert = Date.now()
                let alert = {
                    id: idAlert,
                    text: t("alert7"),
                    img: "./images/yellow.svg",
                    color: "#FFFAEA"
                }
                dispatch(addAlert(alert))
                setTimeout(() => {
                    dispatch(delAlert(idAlert))
                }, 5000)
            }

        }

        if (locationTo) {
            if (searchLocationAddress && selected) {
                cargo.address_to = searchLocationAddress
                setLocationToAddress(searchLocationAddress)
                setLocationFrom(false)
                setSelected(null)

                cargo.latitude_to = Number(selected.lat.toString().slice(0, 9))
                cargo.longitude_to = Number(selected.lng.toString().slice(0, 9))
                onloadMap()
                showModalForm("", false)
                setValidateLocationTo(false)
            } else {
                let idAlert = Date.now()
                let alert = {
                    id: idAlert,
                    text: t("alert7"),
                    img: "./images/yellow.svg",
                    color: "#FFFAEA"
                }
                dispatch(addAlert(alert))
                setTimeout(() => {
                    dispatch(delAlert(idAlert))
                }, 5000)
            }
        }

        if (cargo.address_from && cargo.address_to && direction === "Abroad") {
            let distance = {
                command: "getdistance",
                latitude_from: cargo.latitude_from,
                longitude_from: cargo.longitude_from,
                latitude_to: cargo.latitude_to,
                longitude_to: cargo.longitude_to
            }
            webSocked.send(JSON.stringify(distance));
        }
    }
    const ClicklLocation = (e) => {
        let latitude = e.latLng.lat()
        let longitude = e.latLng.lng()

        let locMy = {lat: latitude, lng: longitude}

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&lan=en`;

        axios.get(`${url}`, {
            headers: {
                "Accept-Language": i18next.language
            }
        }).then((res) => {

            let city = res.data.address.city;
            let country = res.data.address.country;
            let suburb = res.data.address.suburb;
            let neighbourhood = res.data.address.neighbourhood;
            let county = res.data.address.county;
            let road = res.data.address.road;
            let fullAddress = `${country ? country + "," : ""} ${city ? city + "," : ""} ${suburb ? suburb + "," : ""} 
            ${neighbourhood ? neighbourhood + "," : ""} ${county ? county + "," : ""} ${road ? road : ""}`

            if (direction === "OUT") {
                if (res.data.address.country_code === "uz") {

                    if (locationToAddress || locationFromAddress) {

                        if (res.data.address["ISO3166-2-lvl4"] !== locationCode) {

                            setSearchLocationAddress(fullAddress)
                            setSelected(locMy)
                        } else {
                            setSearchLocationAddress("")
                            setSelected(null)
                            let idAlert = Date.now();
                            let alert = {
                                id: idAlert, text: t("errorLocations"), img: "./images/red.svg", color: "#FFEDF1"
                            };
                            dispatch(addAlert(alert));
                            setTimeout(() => {
                                dispatch(delAlert(idAlert));
                            }, 5000);

                        }

                    } else {
                        setSearchLocationAddress(fullAddress)
                        setSelected(locMy)
                        setLocationCode(res.data.address["ISO3166-2-lvl4"])
                    }

                } else {
                    let idAlert = Date.now();
                    let alert = {
                        id: idAlert, text: t("errorLocations"), img: "./images/red.svg", color: "#FFEDF1"
                    };
                    dispatch(addAlert(alert));
                    setTimeout(() => {
                        dispatch(delAlert(idAlert));
                    }, 5000);
                    setSearchLocationAddress("")
                    setSelected(null)
                }
            }

            if (direction === "IN") {
                if (res.data.address.country_code === "uz") {
                    if (locationToAddress || locationFromAddress) {

                        if (res.data.address["ISO3166-2-lvl4"] === locationCode) {
                            setSearchLocationAddress(fullAddress)
                            setSelected(locMy)
                        } else {
                            setSearchLocationAddress("")
                            setSelected(null)
                            let idAlert = Date.now();
                            let alert = {
                                id: idAlert, text: t("errorLocations"), img: "./images/red.svg", color: "#FFEDF1"
                            };
                            dispatch(addAlert(alert));
                            setTimeout(() => {
                                dispatch(delAlert(idAlert));
                            }, 5000);

                        }

                    } else {
                        setSearchLocationAddress(fullAddress)
                        setSelected(locMy)
                        setLocationCode(res.data.address["ISO3166-2-lvl4"])
                    }

                } else {
                    let idAlert = Date.now();
                    let alert = {
                        id: idAlert, text: t("errorLocations"), img: "./images/red.svg", color: "#FFEDF1"
                    };
                    dispatch(addAlert(alert));
                    setTimeout(() => {
                        dispatch(delAlert(idAlert));
                    }, 5000);
                    setSearchLocationAddress("")
                    setSelected(null)
                }
            }

            if (direction === "Abroad") {
                if (locationToAddress || locationFromAddress) {

                    if (res.data.address.country_code !== locationCode) {
                        setSearchLocationAddress(fullAddress)
                        setSelected(locMy)
                    } else {
                        setSearchLocationAddress("")
                        setSelected(null)
                        let idAlert = Date.now();
                        let alert = {
                            id: idAlert, text: t("errorLocations"), img: "./images/red.svg", color: "#FFEDF1"
                        };
                        dispatch(addAlert(alert));
                        setTimeout(() => {
                            dispatch(delAlert(idAlert));
                        }, 5000);
                    }

                } else {
                    setSearchLocationAddress(fullAddress)
                    setSelected(locMy)
                    setLocationCode(res.data.address.country_code)
                }
            }

        })

    }

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: libraries, language: i18next.language
    });

    const onloadMap = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            let locMy = {lat: latitude, lng: longitude}
            setCenter(locMy)
        });
    }

    const options = useMemo(() => ({
        disableDefaultUI: false, clickableIcons: false
    }), []);

    const SendOrder = (command) => {
        let cargoInfoAll = {...formik.values, ...cargo}

        if (webSocked) {
            if (command === "new_order") {
                webSocked.send(JSON.stringify(cargoInfoAll));
            } else if (command === "cancel_order") {
                let order = {
                    command: command, id: price.id
                };
                webSocked.send(JSON.stringify(order));
            } else if (command === "confirm_order") {
                let order = {
                    command: command, id: price.id
                };
                webSocked.send(JSON.stringify(order));
            }
        } else {
            let idAlertError = Date.now();
            let alert = {
                id: idAlertError,
                text: t("net"),
                img: "./images/red.svg",
                color: "#FFEDF1"
            };
            dispatch(addAlert(alert));
        }

    };

    const ConfirmOrder = () => {

        if (direction !== "Abroad") {
            SendOrder("confirm_order")
        } else {
            cargo.distance = distance
            SendOrder("new_order")
        }

        showModalForm("", false)
        formik.resetForm()
        setLocationFromAddress("")
        setLocationToAddress("")
        dispatch(getDistance(""))
        dispatch(getPrice(""))
        setDirection("")
        setCategory("")
        setNextPage(false)
        setInfoTruck("")
        let resetCargo = {
            command: "new_order",
            client: Number(localStorage.getItem("userId")),
            type: "",
            price:"",
            distance:"",
            car_category: "",
            car_body_type: "",
            address_from: "",
            latitude_from: "",
            longitude_from: "",
            address_to: "",
            latitude_to: "",
            longitude_to: "",
            payment_type: t("payment1"),
            unit: t("infoWaits1"),
            currency: "UZS",
            wait_type: t("waitCount1"),
        }
        setCargo(resetCargo)
    }

    const CancelOrder = () => {
        direction !== "Abroad" ? SendOrder("cancel_order") : showModalForm("", false)
        showModalForm("", false)
    }

    if (!isLoaded) return <Loader/>
    return <div className="post-order-container">

        <CSSTransition
            in={modalShow.show}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div className={`modal-sloy ${modalShow.status === "order" ? "align-none" : ""}`}>

                {modalShow.status !== "getLocation" &&
                    <div ref={nodeRef} className="modal-card">

                        {modalShow.status === "payment-type" &&
                            <div className="form-orders">
                                <div className="cancel-btn">
                                    <img onClick={() => showModalForm("", false)} src="./images/x.png" alt=""/>
                                </div>

                                <div className="title">
                                    {t("info10")}
                                </div>

                                <div className="form-order-info">

                                    <label htmlFor="payment_type_one">
                                        <input
                                            name="payment_type"
                                            onChange={(e) => setPayment_type(e.target.value)}
                                            id="payment_type_one" type="radio"
                                            value={t("payment1")}/>
                                        <div>{t("payment1")}</div>
                                    </label>

                                    <label htmlFor="payment_type_two">
                                        <input
                                            onChange={(e) => setPayment_type(e.target.value)}
                                            id="payment_type_two" type="radio"
                                            name="payment_type"
                                            value={t("payment2")}/>
                                        <div>{t("payment2")}</div>
                                    </label>

                                    <label>
                                        <input
                                            onChange={(e) => setPayment_type(e.target.value)}
                                            id="payment_type_three" type="radio"
                                            name="payment_type"
                                            value={t("payment3")}/>
                                        <div>{t("payment3")}</div>
                                    </label>

                                    <div onClick={() => {
                                        showModalForm("", false)
                                        cargo.payment_type = payment_type
                                    }} className="success-btn">
                                        {t("button2")}
                                    </div>
                                </div>

                            </div>
                        }

                        {modalShow.status === "cargo-weight" &&
                            <div className="form-orders">
                                <div className="cancel-btn">
                                    <img onClick={() => showModalForm("", false)} src="./images/x.png" alt=""/>
                                </div>

                                <div className="title">
                                    {t("infoTruck4")}
                                </div>

                                <div className="form-order-info">

                                    <label htmlFor="unit1">
                                        <input
                                            name="unit"
                                            onChange={(e) => setUnit(e.target.value)}
                                            id="unit1" type="radio"
                                            value={t("infoWaits1")}/>
                                        <div>{t("infoWaits1")}</div>
                                    </label>

                                    <label htmlFor="unit2">
                                        <input
                                            name="unit"
                                            onChange={(e) => setUnit(e.target.value)}
                                            id="unit2" type="radio"
                                            value={t("infoWaits2")}/>
                                        <div>{t("infoWaits2")}</div>
                                    </label>

                                    <label htmlFor="unit3">
                                        <input
                                            name="unit"
                                            onChange={(e) => setUnit(e.target.value)}
                                            id="unit3" type="radio"
                                            value={t("infoWaits3")}/>
                                        <div>{t("infoWaits3")}</div>
                                    </label>

                                    <label htmlFor="unit4">
                                        <input
                                            name="unit"
                                            onChange={(e) => setUnit(e.target.value)}
                                            id="unit4" type="radio"
                                            value={t("infoWaits4")}/>
                                        <div>{t("infoWaits4")}</div>
                                    </label>

                                    <label htmlFor="unit5">
                                        <input
                                            name="unit"
                                            onChange={(e) => setUnit(e.target.value)}
                                            id="unit5" type="radio"
                                            value={t("infoWaits5")}/>
                                        <div>{t("infoWaits5")}</div>
                                    </label>

                                    <label htmlFor="unit6">
                                        <input
                                            name="unit"
                                            onChange={(e) => setUnit(e.target.value)}
                                            id="unit6" type="radio"
                                            value={t("infoWaits6")}/>
                                        <div>{t("infoWaits6")}</div>
                                    </label>

                                    <div onClick={() => {
                                        showModalForm("", false)
                                        cargo.unit = unit
                                    }} className="success-btn">
                                        {t("button2")}
                                    </div>
                                </div>

                            </div>
                        }

                        {modalShow.status === "weight-type" &&
                            <div className="form-orders">
                                <div className="cancel-btn">
                                    <img onClick={() => showModalForm("", false)} src="./images/x.png" alt=""/>
                                </div>

                                <div className="title">
                                    {t("info11")}
                                </div>

                                <div className="form-order-info">

                                    <label htmlFor="wait_type1">
                                        <input
                                            name="wait_type"
                                            onChange={(e) => setWait_type(e.target.value)}
                                            id="wait_type1" type="radio"
                                            value={t("waitCount1")}/>
                                        <div> {t("waitCount1")} </div>
                                    </label>

                                    <label htmlFor="wait_type2">
                                        <input
                                            name="wait_type"
                                            onChange={(e) => setWait_type(e.target.value)}
                                            id="wait_type2" type="radio"
                                            value={t("waitCount2")}/>
                                        <div> {t("waitCount2")}</div>
                                    </label>

                                    <div onClick={() => {
                                        showModalForm("", false)
                                        cargo.wait_type = wait_type
                                    }} className="success-btn">
                                        {t("button2")}
                                    </div>
                                </div>
                            </div>
                        }

                        {modalShow.status === "currency" &&
                            <div className="form-orders">
                                <div className="cancel-btn">
                                    <img onClick={() => showModalForm("", false)} src="./images/x.png" alt=""/>
                                </div>

                                <div className="title">
                                    {t("title3")}
                                </div>

                                <div className="form-order-info">

                                    <label htmlFor="currency1">
                                        <input
                                            name="currency"
                                            onChange={(e) => setCurrency(e.target.value)}
                                            id="currency1" type="radio"
                                            value="UZS"/>
                                        <div> UZS</div>
                                    </label>

                                    <label htmlFor="currency2">
                                        <input
                                            name="currency"
                                            onChange={(e) => setCurrency(e.target.value)}
                                            id="currency2" type="radio"
                                            value="USD"/>
                                        <div>USD</div>
                                    </label>

                                    <div onClick={() => {
                                        showModalForm("", false)
                                        cargo.currency = currency
                                    }} className="success-btn">
                                        {t("button2")}
                                    </div>
                                </div>
                            </div>
                        }

                        {modalShow.status === "order" &&
                            <div className="show-order">
                                <div className="cancel-btn">
                                    <img onClick={() => showModalForm("", false)} src="./images/x.png" alt=""/>
                                </div>

                                <div className="title">
                                    {t("moreInfo")}
                                </div>

                                <div className="info-direction">
                                    <div className="label-info">{t("info1")}</div>
                                    <div className="value-info">
                                        {cargo.type === "OUT" ? t("direction2") : ""}
                                        {cargo.type === "IN" ? t("direction3") : ""}
                                        {cargo.type === "Abroad" ? t("direction1") : ""}
                                    </div>
                                </div>

                                <div className="info">
                                    <div className="label-info">{t("loc1")}</div>
                                    <div className="value-info"> {cargo.address_from}</div>
                                </div>

                                <div className="info">
                                    <div className="label-info">{t("loc3")}</div>
                                    <div className="value-info"> {cargo.address_to}</div>
                                </div>

                                <div className="info">
                                    <div className="label-info"> {t("info2")}</div>
                                    <div className="value-info"> {cargoInfo.cargo}</div>
                                </div>

                                <div className="info">
                                    <div className="label-info">  {t("info7")}</div>
                                    <div className="value-info">
                                        {direction !== "Abroad" ? price.distance : distance} km
                                    </div>
                                </div>

                                <div className="info">
                                    <div className="label-info"> {t("info10")}</div>
                                    <div className="value-info">{cargo.payment_type}</div>
                                </div>

                                <div className="info">
                                    <div className="label-info"> {t("info8")}</div>
                                    <div className="value-info">
                                        {cargoInfo.price ? cargoInfo.price : price.price}
                                        {cargo.currency}
                                    </div>
                                </div>

                                <div className="info">
                                    <div className="label-info"> {t("info3")}</div>
                                    <div className="value-info"> {cargoInfo.number_cars}</div>
                                </div>

                                <div className="info">
                                    <div className="label-info"> {t("info4")}</div>
                                    <div className="value-info"> {cargoInfo.capacity} {cargo.unit}</div>
                                </div>

                                <div className="info">
                                    <div className="label-info">{t("info5")}</div>
                                    <div className="value-info">

                                        {categories.map((item, index) => {
                                            if (item.id === cargo.car_category) {
                                                return <div key={index}>

                                                    {
                                                        item.name !== "Авто Ташувчи" ?
                                                            <>
                                                                {item.min_weight} - {item.max_weight} {t("infoWaits4")},
                                                            </> : ""
                                                    }

                                                    {item.name === "Мини" && t("tariff1")}
                                                    {item.name === "Енгил" && t("tariff2")}
                                                    {item.name === "Ўрта" && t("tariff3")}
                                                    {item.name === "Оғир" && t("tariff4")}
                                                    {item.name === "Ўта оғир" && t("tariff5")}
                                                    {item.name === "Авто Ташувчи" && t("tariff6")}
                                                </div>
                                            }
                                        })}

                                    </div>
                                </div>

                                <div className="info">
                                    <div className="label-info"> {t("info6")}</div>
                                    <div className="value-info">
                                        {trucks.map((item, index) => {
                                            if (item.id === cargo.car_body_type) {
                                                return <div key={index}>
                                                    {item.name}
                                                </div>
                                            }
                                        })}
                                    </div>
                                </div>

                                {cargoInfo.avans ? <div className="info">
                                    <div className="label-info"> {t("info9")}</div>
                                    <div className="value-info">  {cargoInfo.avans} {cargo.currency}</div>
                                </div> : ""}

                                {cargoInfo.wait_cost ? <div className="info">

                                    <div className="label-info"> {t("info11")}</div>

                                    <div className="value-info">
                                        {cargoInfo.wait_cost} {cargo.currency}
                                    </div>

                                </div> : ""}

                                {cargoInfo.load_time ? <div className="info">
                                    <div className="label-info"> {t("info12")}</div>
                                    <div className="value-info">
                                        {cargoInfo.load_time.slice(0, 10)},
                                        {cargoInfo.load_time.slice(11, 16)}
                                    </div>
                                </div> : ""}

                                {cargoInfo.start_time ? <div className="info">
                                    <div className="label-info"> {t("info13")}</div>
                                    <div className="value-info">
                                        {cargoInfo.start_time.slice(0, 10)},
                                        {cargoInfo.start_time.slice(11, 16)}
                                    </div>
                                </div> : ""}

                                <div className="buttons">
                                    <button onClick={CancelOrder}
                                            className="cancel-btn">{t("button3")}</button>

                                    <button onClick={ConfirmOrder} className="next-btn ">{t("button2")}</button>
                                </div>
                            </div>
                        }

                    </div>
                }

                {modalShow.status === "getLocation" && <div ref={nodeRef} className="map-wrapper">

                    <div className="header">
                        <div className="text">
                            {locationFrom && t("loc2")}
                            {locationTo && t("loc4")}
                        </div>
                        <div className="cancel-btn">
                            <img onClick={() => showModalForm("", false)} src="./images/x.png" alt=""/>
                        </div>
                    </div>

                    <GoogleMap
                        zoom={10}
                        onLoad={onloadMap}
                        center={center}
                        options={options}
                        onClick={ClicklLocation}
                        mapContainerClassName="map-box">

                        {selected && <Marker icon={selectAddressIcon} position={selected}/>}

                        <div className="search-address">
                            <div className="places-container">
                                <PlacesAutocomplete setSelected={setSelected}/>
                                <img src="./images/search.png" alt=""/>
                            </div>
                        </div>

                    </GoogleMap>

                    <div className="footer-map">
                        <div onClick={getAddressLocation} className="success-btn">
                            {t("button2")}
                        </div>
                    </div>
                </div>}

            </div>
        </CSSTransition>

        <div ref={ref3} className="title">
            {t("post-order")}
        </div>

        <div className="directions-card">
            {direction && <div className="direction-item">
                {direction === "OUT" ? t("direction2") : ""}
                {direction === "IN" ? t("direction3") : ""}
                {direction === "Abroad" ? t("direction1") : ""}
            </div>}

            {category &&
                <>
                    <div className="line"></div>
                    {categories.map((item, index) => {
                        if (item.id === category)
                            return <div key={index} className="direction-item">
                                {item.name === "Мини" && t("tariff1")}
                                {item.name === "Енгил" && t("tariff2")}
                                {item.name === "Ўрта" && t("tariff3")}
                                {item.name === "Оғир" && t("tariff4")}
                                {item.name === "Ўта оғир" && t("tariff5")}
                                {item.name === "Авто Ташувчи" && t("tariff6")}
                                {item.id !== 9 && <>
                                    , &nbsp; {item.min_weight} - {item.max_weight} {t("infoWaits4")}
                                </>}
                            </div>
                    })}

                </>
            }

            {
                trucks.map((item, index) => {
                    if (item.id === cargo.car_body_type) {
                        return <div key={index}>
                            <div className="line"></div>
                            <div className="direction-item">
                                {item.name}
                            </div>
                        </div>
                    }
                })
            }

        </div>

        {
            !nextPage ?
                <>
                    <div className="title-info">
                        {t("direction")}
                    </div>

                    <div className="directions">
                        <div onClick={() => getDirection("IN")}
                             className={`direction ${direction === "IN" ? "direction-active" : ""}`}>
                            <div className="photo">
                                <img src="./images/direction1.png" alt=""/>
                            </div>
                            <div className="name">
                                {t("direction3")}
                            </div>
                        </div>

                        <div onClick={() => getDirection("OUT")}
                             className={`direction ${direction === "OUT" ? "direction-active" : ""}`}>
                            <div className="photo">
                                <img src="./images/direction2.png" alt=""/>
                            </div>
                            <div className="name">
                                {t("direction2")}
                            </div>
                        </div>

                        <div onClick={() => getDirection("Abroad")}
                             className={`direction ${direction === "Abroad" ? "direction-active" : ""}`}>
                            <div className="photo">
                                <img src="./images/direction3.png" alt=""/>
                            </div>
                            <div className="name">
                                {t("direction1")}
                            </div>
                        </div>
                    </div>

                    {
                        direction &&
                        <>
                            <div className="title-info">
                                {t("tariff")}
                            </div>

                            <div className="tarifs">
                                <div className="content">
                                    {
                                        categories.map((item, index) => {
                                            return <div onClick={() => {
                                                getTrucks(item.id)
                                                setTimeout(() => {
                                                    ref.current?.scrollIntoView({behavior: 'smooth'});
                                                }, 500);
                                            }} key={index}
                                                        className={`tarif ${category === item.id ? "active-tarif" : ""}`}>
                                                <div className="photo">
                                                    <img src={item.image} alt=""/>
                                                </div>
                                                <div className="text">
                                                    <div className="name">
                                                        {item.name === "Мини" && t("tariff1")}
                                                        {item.name === "Енгил" && t("tariff2")}
                                                        {item.name === "Ўрта" && t("tariff3")}
                                                        {item.name === "Оғир" && t("tariff4")}
                                                        {item.name === "Ўта оғир" && t("tariff5")}
                                                        {item.name === "Авто Ташувчи" && t("tariff6")}
                                                    </div>
                                                    <div className="count">
                                                        {item.id !== 9 && <>
                                                            {item.min_weight} - {item.max_weight} {t("infoWaits4")}
                                                        </>}
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </>
                    }

                    {
                        category &&
                        <>
                            <div ref={ref} className="title-info">
                                {t("trucks")}
                            </div>
                            <div className="trucks">
                                <div className="content">
                                    {
                                        trucks.map((item, index) => {
                                            return <div onClick={() => {
                                                setInfoTruck(prevState => prevState = item)
                                                cargo.car_body_type = item.id
                                                setTimeout(() => {
                                                    ref2.current?.scrollIntoView({behavior: 'smooth'});
                                                }, 500);
                                            }} key={index}
                                                        className={`truck ${item.id === infoTruck.id ? "active-truck" : ""}`}>
                                                <div className="photo">
                                                    <img src={`${baseUrl}${item.car_image}`} alt=""/>
                                                </div>
                                                <div className="name">
                                                    {item.name}
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </>
                    }

                    {
                        infoTruck &&
                        <>
                            <div ref={ref2} className="truck-information">
                                <div className="text">
                                    <div className="name">
                                        {t("infoTruck1")}:
                                    </div>
                                    <div className="num">{infoTruck.widht}</div>
                                </div>

                                <div className="text">
                                    <div className="name">
                                        {t("infoTruck2")}:
                                    </div>
                                    <div className="num">{infoTruck.breadth}</div>
                                </div>

                                <div className="text">
                                    <div className="name">
                                        {t("infoTruck3")}:
                                    </div>
                                    <div className="num">{infoTruck.height}</div>
                                </div>

                                <div className="text">
                                    <div className="name">
                                        {t("infoTruck4")}:
                                    </div>
                                    <div className="num">
                                        {!infoTruck.name === "Мини" || !infoTruck.name === "Авто" || !infoTruck.name === "Мулти" ?
                                            infoTruck.cargo_weight / 1000 : infoTruck.cargo_weight}
                                    </div>
                                </div>

                            </div>

                            <div className="buttons">
                                <button onClick={() => navigate("/")} className="cancel-btn">{t("button3")}</button>
                                <button onClick={() => {
                                    setNextPage(prevState => prevState = true)
                                    setTimeout(() => {
                                        ref3.current?.scrollIntoView({behavior: 'smooth'});
                                    }, 500);
                                }}
                                        className="next-btn ">{t("button1")}</button>
                            </div>
                        </>
                    }
                </> :
                <form onSubmit={formik.handleSubmit}>

                    <div className="form-informations">

                        <div className="left-forms">

                            <div className="form-box">
                                <label htmlFor="cargo">{t("info2")}</label>

                                {formik.errors.cargo && formik.errors.cargo !== "Required" ? <div className="error">
                                    {formik.errors.cargo}
                                </div> : ""}

                                <div
                                    className={`input-box ${formik.errors.cargo === "Required" ? "input-box-required" : ""}`}>
                                    <div className="icon">
                                        <img src="./images/cargo.png" alt="cargo"/>
                                    </div>
                                    <input
                                        onChange={formik.handleChange}
                                        value={formik.values.cargo}
                                        name="cargo"
                                        id="cargo" type="text"/>
                                </div>
                            </div>

                            <div onClick={() => {
                                showModalForm("getLocation", true)
                                setLocationFrom(true)
                                setLocationTo(false)
                            }} className="form-box">
                                <label htmlFor="cargo">{t("loc1")}</label>
                                <div className={`input-box ${validateLocationFrom ? "input-box-required" : ""}`}>
                                    <div className="icon">
                                        <img src="./images/location.png" alt="cargo"/>
                                    </div>
                                    <div className="locitions">
                                        {locationFromAddress}
                                    </div>
                                </div>
                            </div>

                            <div className="form-box mobile-loc">
                                <label htmlFor="cargo">{t("loc3")}</label>
                                <div onClick={() => {
                                    showModalForm("getLocation", true)
                                    setLocationTo(true)
                                    setLocationFrom(false)
                                }} className={`input-box ${validateLocationTo ? "input-box-required" : ""}`}>
                                    <div className="icon">
                                        <img src="./images/location.png" alt="cargo"/>
                                    </div>
                                    <div className="locitions">
                                        {locationToAddress}
                                    </div>
                                </div>
                            </div>

                            {direction === "Abroad" && distance &&
                                <div className="distance">
                                    <div className="label-distance">
                                        {t("info7")}
                                    </div>
                                    <div className="count">
                                        {distance} km
                                    </div>
                                </div>
                            }

                            <div onClick={() => showModalForm("payment-type", true)} className="form-box-radio">
                                <label htmlFor="cargo">{t("info10")}</label>
                                <div className="input-box">
                                    <div className="icon">
                                        <img src="./images/money.png" alt="cargo"/>
                                    </div>
                                    <div className="locitions">
                                        {payment_type}
                                    </div>
                                    <div className="icon">
                                        <img src="./images/down.png" alt="cargo"/>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="right-forms">

                            <div className="form-box-radio">
                                <label htmlFor="cargo">{t("infoTruck4")}</label>

                                {formik.errors.capacity && formik.errors.capacity !== "Required" ?
                                    <div className="error">
                                        {formik.errors.capacity}
                                    </div> : ""}

                                <div
                                    className={`input-box ${formik.errors.capacity === "Required" ? "input-box-required" : ""}`}>
                                    <div className="icon">
                                        <img src="./images/wait.png" alt="cargo"/>
                                    </div>
                                    <input
                                        onChange={formik.handleChange}
                                        value={formik.values.capacity}
                                        name="capacity"
                                        type="text"/>

                                    <div onClick={() => showModalForm("cargo-weight", true)} className="icon-right">
                                        <div className="text">
                                            {unit}
                                        </div>
                                        <img src="./images/down.png" alt="cargo"/>
                                    </div>
                                </div>
                            </div>

                            <div className="form-box desktop-loc">
                                <label htmlFor="cargo">{t("loc3")}</label>
                                <div onClick={() => {
                                    showModalForm("getLocation", true)
                                    setLocationTo(true)
                                    setLocationFrom(false)
                                }} className={`input-box ${validateLocationTo ? "input-box-required" : ""}`}>
                                    <div className="icon">
                                        <img src="./images/location.png" alt="cargo"/>
                                    </div>
                                    <div className="locitions">
                                        {locationToAddress}
                                    </div>
                                </div>
                            </div>

                            {
                                direction === "Abroad" && <div className="form-box-radio">
                                    <label htmlFor="cargo">{t("info8")}</label>

                                    {formik.errors.price && formik.errors.price !== "Required" ? <div className="error">
                                        {formik.errors.price}
                                    </div> : ""}

                                    <div
                                        className={`input-box ${formik.errors.price === "Required" ? "input-box-required" : ""}`}>
                                        <div className="icon">
                                            <img src="./images/pay.png" alt="cargo"/>
                                        </div>
                                        <input
                                            onChange={formik.handleChange}
                                            value={formik.values.price}
                                            name="price"
                                            type="text"/>

                                        <div onClick={() => showModalForm("currency", true)} className="icon-right">
                                            <div className="text">
                                                {currency}
                                            </div>
                                            <img src="./images/down.png" alt="cargo"/>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                    </div>

                    <div onClick={() => setPlusInformation(prevState => prevState = !prevState)}
                         className="plus-information">
                        <div className="input-box">
                            <div className="icon-doc">
                                <img src="./images/doc.png" alt="cargo"/>
                            </div>
                            <div className="locitions">
                                {t("plusInformation")}
                            </div>
                            <div className={`icon ${plusInformation ? "icon-rotate" : ""}`}>
                                <img src="./images/down.png" alt="cargo"/>
                            </div>
                        </div>
                    </div>

                    {
                        plusInformation ? <div className="plus-information-forms">

                            <div className="content-forms">
                                <div className="form-box">
                                    <label htmlFor="number_cars">{t("info3")}</label>
                                    {formik.errors.number_cars && formik.errors.number_cars !== "Required" ?
                                        <div className="error">
                                            {formik.errors.number_cars}
                                        </div> : ""}
                                    <div
                                        className={`input-box ${formik.errors.number_cars === "Required" ? "input-box-required" : ""}`}>
                                        <div className="icon">
                                            <img src="./images/add-truck.png" alt="cargo"/>
                                        </div>
                                        <input
                                            onChange={formik.handleChange}
                                            value={formik.values.number_cars}
                                            name="number_cars"
                                            id="number_cars" type="text"/>
                                    </div>
                                </div>

                                <div className="form-box-time">
                                    <label htmlFor="cargo">{t("info12")}</label>

                                    <div className="forms">
                                        <div className="input-box">

                                            <div className="icon">
                                                <img className="mobile-icon" src="./images/date.png" alt=""/>
                                            </div>

                                            <input
                                                onChange={formik.handleChange}
                                                value={formik.values.load_time}
                                                name="load_time"
                                                id="load_time" type="datetime-local"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-box-time">
                                    <label htmlFor="cargo">{t("info13")}</label>
                                    <div className="forms">
                                        <div className="input-box">

                                            <div className="icon">
                                                <img className="mobile-icon" src="./images/date.png" alt=""/>
                                            </div>

                                            <input
                                                onChange={formik.handleChange}
                                                value={formik.values.start_time}
                                                name="start_time"
                                                id="start_time" type="datetime-local"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="content-forms">
                                {direction === "Abroad" && <div className="form-box-radio">
                                    <label htmlFor="cargo">{t("info9")}</label>
                                    {formik.errors.avans && formik.errors.avans !== "Required" ?
                                        <div className="error">
                                            {formik.errors.avans}
                                        </div> : ""}

                                    <div
                                        className={`input-box ${formik.errors.avans === "Required" ? "input-box-required" : ""}`}>
                                        <div className="icon">
                                            <img src="./images/pay.png" alt="cargo"/>
                                        </div>
                                        <input
                                            onChange={formik.handleChange}
                                            value={formik.values.avans}
                                            name="avans"
                                            type="text"/>
                                        <div className="icon-right">
                                            <div className="text">
                                                {currency}
                                            </div>
                                        </div>
                                    </div>
                                </div>}

                                {direction === "Abroad" && <div className="form-box-radio">
                                    <label htmlFor="cargo">{t("info11")}</label>

                                    {formik.errors.wait_cost && formik.errors.wait_cost !== "Required" ?
                                        <div className="error">
                                            {formik.errors.wait_cost}
                                        </div> : ""}

                                    <div
                                        className={`input-box ${formik.errors.wait_cost === "Required" ? "input-box-required" : ""}`}>
                                        <div className="icon">
                                            <img src="./images/pay.png" alt="cargo"/>
                                        </div>
                                        <input
                                            onChange={formik.handleChange}
                                            value={formik.values.wait_cost}
                                            name="wait_cost"
                                            id="wait_cost" type="text"/>
                                        <div onClick={() => showModalForm("weight-type", true)} className="icon-right">
                                            <div className="text">
                                                {currency} / {wait_type}
                                            </div>
                                            <img src="./images/down.png" alt="cargo"/>
                                        </div>
                                    </div>

                                </div>}
                            </div>

                        </div> : ""
                    }


                    <div className="buttons">
                        <div onClick={() => {
                            setNextPage(false)
                            setSearchLocationAddress("")
                            setLocationCode("")
                            setLocationToAddress("")
                            setLocationFromAddress("")
                            setSelected(null)
                        }} className="cancel-btn">{t("button7")}</div>

                        <button type="submit" className="next-btn ">{t("button1")}</button>
                    </div>

                </form>
        }
    </div>
}

export default PostOrder