import "./style.scss";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {useFormik} from 'formik';

const validate = values => {
    const errors = {};

    if (!values.firstName) {
        errors.firstName = 'Required';
    } else if (values.firstName.length > 15) {
        errors.firstName = 'Must be 15 characters or less';
    }

    if (!values.lastName) {
        errors.lastName = 'Required';
    } else if (values.lastName.length > 20) {
        errors.lastName = 'Must be 20 characters or less';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};
const PostOrder = () => {
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const [categories, setCategories] = useState([])
    const [trucks, setTrucks] = useState([])
    const [direction, setDirection] = useState("")
    const [category, setCategory] = useState("")
    const [infoTruck, setInfoTruck] = useState("")
    const [nextPage, setNextPage] = useState(false)
    const [plusInformation, setPlusInformation] = useState(false)
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch()

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
    })


    const formik = useFormik({
        initialValues: {
            cargo: '',
            unit: t("infoWaits1"),
            capacity: '',
            currency: "UZS",
            price: "",
            payment_type: "",
            number_cars: 1,
            load_time: null,
            start_time: null,
            wait_cost: null,
            wait_type: t("waitCount1"),
            avans: null,
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            formik.resetForm()
        },
    });

    useEffect(() => {
        const getCategory = () => {
            axios.get(`${baseUrl}api/car-category/`).then((response) => {
                let re = response.data.reverse();
                setCategories(re);
            }).catch((error) => {
                if (error.response.statusText == "Unauthorized") {
                    window.location.pathname = "/";
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                }
            });
        }

        return () => {
            getCategory()
        }
    }, [])
    const getTrucks = (categoryId) => {
        cargo.car_category = categoryId
        setCategory(categoryId)
        axios.get(`${baseUrl}api/car-category/${categoryId}`, {}).then((response) => {
            let re = response.data.reverse();
            setTrucks(re);
        })
    }
    const getDirection = (direction) => {
        cargo.type = direction
        setDirection(direction)
    }

    return <div className="post-order-container">
        <div className="title">
            {t("post-order")}
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
                                            return <div onClick={() => getTrucks(item.id)} key={index}
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
                                                            {item.min_weight} - {item.max_weight} tonna
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
                            <div className="title-info">
                                {t("trucks")}
                            </div>
                            <div className="trucks">
                                <div className="content">
                                    {
                                        trucks.map((item, index) => {
                                            return <div onClick={() => {
                                                setInfoTruck(prevState => prevState = item)
                                                cargo.car_body_type = item.id
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
                            <div className="truck-information">
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
                                <button onClick={() => setNextPage(prevState => prevState = true)}
                                        className="next-btn ">{t("button1")}</button>
                            </div>
                        </>
                    }
                </> :

                <>
                    <div className="form-informations">
                        <div className="left-forms">

                            <div className="form-box">
                                <label htmlFor="cargo">{t("info2")}</label>
                                <div className="input-box">
                                    <div className="icon">
                                        <img src="./images/cargo.png" alt="cargo"/>
                                    </div>
                                    <input id="cargo" type="text"/>
                                </div>
                            </div>

                            <div className="form-box">
                                <label htmlFor="cargo">{t("loc1")}</label>
                                <div className="input-box">
                                    <div className="icon">
                                        <img src="./images/location.png" alt="cargo"/>
                                    </div>
                                    <div className="locitions">
                                        Toshkent sh, Yunusobod t, Qoraqamish ko’chasi 7
                                    </div>
                                </div>
                            </div>

                            <div className="distance">
                                <div className="label-distance">
                                    {t("info7")}
                                </div>
                                <div className="count">
                                    1 100 km
                                </div>
                            </div>

                            <div className="form-box-radio">
                                <label htmlFor="cargo">{t("info10")}</label>
                                <div className="input-box">
                                    <div className="icon">
                                        <img src="./images/money.png" alt="cargo"/>
                                    </div>
                                    <div className="locitions">
                                        Naqt
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
                                <div className="input-box">
                                    <div className="icon">
                                        <img src="./images/wait.png" alt="cargo"/>
                                    </div>
                                    <input type="text"/>
                                    <div className="icon-right">
                                        <div className="text">
                                            Tonna
                                        </div>
                                        <img src="./images/down.png" alt="cargo"/>
                                    </div>
                                </div>
                            </div>
                            <div className="form-box">
                                <label htmlFor="cargo">{t("loc3")}</label>
                                <div className="input-box">
                                    <div className="icon">
                                        <img src="./images/location.png" alt="cargo"/>
                                    </div>
                                    <div className="locitions">
                                        Toshkent sh, Yunusobod t, Qoraqamish ko’chasi 7
                                    </div>
                                </div>
                            </div>
                            <div className="form-box-radio">
                                <label htmlFor="cargo">{t("info8")}</label>
                                <div className="input-box">
                                    <div className="icon">
                                        <img src="./images/pay.png" alt="cargo"/>
                                    </div>
                                    <input type="text"/>
                                    <div className="icon-right">
                                        <div className="text">
                                            UZS
                                        </div>
                                        <img src="./images/down.png" alt="cargo"/>
                                    </div>
                                </div>
                            </div>
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
                            <div className={`icon ${plusInformation ? "icon-rotate" :""}`}>
                                <img src="./images/down.png" alt="cargo"/>
                            </div>
                        </div>
                    </div>

                    {
                        plusInformation ? <div className="plus-information-forms">

                            <div className="content-forms">
                                <div className="form-box">
                                    <label htmlFor="cargo">{t("info3")}</label>
                                    <div className="input-box">
                                        <div className="icon">
                                            <img src="./images/add-truck.png" alt="cargo"/>
                                        </div>
                                        <input id="cargo" type="number"/>
                                    </div>
                                </div>

                                <div className="form-box-time">
                                    <label htmlFor="cargo">{t("info12")}</label>

                                    <div className="forms">
                                        <div className="input-box">
                                            <div className="icon">
                                                <img src="./images/date.png" alt="cargo"/>
                                            </div>
                                            <input id="cargo" type="date"/>
                                        </div>

                                        <div className="input-box">
                                            <div className="icon">
                                                <img src="./images/time.png" alt="cargo"/>
                                            </div>
                                            <input id="cargo" type="time"/>
                                        </div>
                                    </div>

                                </div>

                                <div className="form-box-radio">
                                    <label htmlFor="cargo">{t("info11")}</label>
                                    <div className="input-box">
                                        <div className="icon">
                                            <img src="./images/pay.png" alt="cargo"/>
                                        </div>
                                        <input type="text"/>
                                        <div className="icon-right">
                                            <div className="text">
                                                UZS  / kun
                                            </div>
                                            <img src="./images/down.png" alt="cargo"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="content-forms">
                                <div className="form-box-time">
                                    <label htmlFor="cargo">{t("info13")}</label>

                                    <div className="forms">
                                        <div className="input-box">
                                            <div className="icon">
                                                <img src="./images/date.png" alt="cargo"/>
                                            </div>
                                            <input id="cargo" type="date"/>
                                        </div>

                                        <div className="input-box">
                                            <div className="icon">
                                                <img src="./images/time.png" alt="cargo"/>
                                            </div>
                                            <input id="cargo" type="time"/>
                                        </div>
                                    </div>

                                </div>
                                <div className="form-box-radio">
                                    <label htmlFor="cargo">{t("info9")}</label>
                                    <div className="input-box">
                                        <div className="icon">
                                            <img src="./images/pay.png" alt="cargo"/>
                                        </div>
                                        <input type="text"/>
                                        <div className="icon-right">
                                            <div className="text">
                                                UZS
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div> : ""
                    }

                    <div className="buttons">
                        <button onClick={() => setNextPage(false)} className="cancel-btn">{t("button3")}</button>
                        <button onClick={() => setNextPage(prevState => prevState = true)}
                                className="next-btn ">{t("button1")}</button>
                    </div>
                </>
        }


    </div>
}

export default PostOrder