import {useEffect, useState} from "react";
import axios from "axios";
import "./style.scss"
import Loader from "../loader/Loader";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {showModals} from "../../redux/ModalContent";

const History = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const [ordersList, setOrdersList] = useState([])
    const [activeTab, setActiveTab] = useState("Active")
    const [loading, setLoading] = useState(true)

    const tabs = [
        {
            status: "Active",
            name: t("cargoLabel1")
        },
        {
            status: "Delivering",
            name: t("cargoLabel2")
        },
        {
            status: "Delivered",
            name: t("cargoLabel3")
        },
        {
            status: "Rejected",
            name: t("cargoLabel4")
        }
    ]

    useEffect(() => {
        const getOrder = () => {
            axios.get(`${baseUrl}api/my-orders/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                setOrdersList(response.data);
                setLoading(false)
            }).catch((error) => {
                if (error.response.statusText == "Unauthorized") {
                    window.location.pathname = "/";
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId")
                }
            });
        }
        return () => {
            getOrder()
        }
    }, [])

    const showModalContent = (order) => {
        dispatch(showModals({show: true, status: "order", order}))
    }

    return <div className="history-container">
        {
            loading ? <Loader/> :
                <>
                    <div className="title">
                        {t("nav-history")}
                    </div>

                    <div className="header">
                        {
                            tabs.map((item, index) => {
                                return <div onClick={() => setActiveTab(prevState => prevState = item.status)}
                                            key={index}
                                            className={`tab-btn ${activeTab === item.status ? "tab-active" : ""} `}>
                                    {item.name}
                                </div>
                            })
                        }
                    </div>

                    <div className="orders-box">
                        {
                            ordersList.map((item, index) => {
                                if (activeTab === item.status)
                                    return <div key={index} className="order">
                                        <div className="top-side-order">
                                            <div className="date">
                                                {item.ordered_time.slice(0, 10)}, &nbsp;
                                                {item.ordered_time.slice(11, 16)}
                                            </div>

                                            <div className={`btn-badge ${activeTab}`}>
                                                {activeTab === "Active" && t("cargoLabel1")}
                                                {activeTab === "Delivering" && t("cargoLabel2")}
                                                {activeTab === "Delivered" && t("cargoLabel3")}
                                                {activeTab === "Rejected" && t("cargoLabel4")}
                                            </div>
                                        </div>

                                        <div className="cards">
                                            <div onClick={() => showModalContent(item)} className="bottom-side-order">

                                                <div className="photo">
                                                    <img src={`${baseUrl}${item.car_category.image}`} alt=""/>
                                                </div>

                                                <div className="content">
                                                    <div className="title">
                                                        Toshkent- Samarqandddddddddddddddddddddddddsssssssssssssssssss
                                                    </div>
                                                    <div className="text">
                                                        <img src="./images/location.png" alt=""/>
                                                        <div className="info">
                                                            <div className="label">{t("info7")}</div>
                                                            <div className="content">{item.distance} km</div>
                                                        </div>
                                                    </div>
                                                    <div className="text">
                                                        <img src="./images/price.png" alt=""/>
                                                        <div className="info">
                                                            <div className="label">{t("info14")}</div>
                                                            <div className="content">{item.price} {item.currency}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>


                                            {
                                                item.status === "Delivering" ? <div className="line">

                                                </div> : ""
                                            }


                                            {
                                                item.status === "Delivering" ?
                                                    <div onClick={() => showModalContent(item)}
                                                         className="bottom-side-driver">

                                                        <div className="photo">
                                                            <img src="./images/driver.png" alt=""/>
                                                        </div>

                                                        <div className="content">
                                                            <div className="title">
                                                                Malikov Murodxon
                                                            </div>
                                                            <div className="text">
                                                                <img src="./images/truck2.png" alt=""/>
                                                                <div className="info">
                                                                    <div className="label">MAN</div>
                                                                    <div className="content">30L288SA</div>
                                                                </div>
                                                            </div>
                                                            <div className="text">
                                                                <img src="./images/phone.png" alt=""/>
                                                                <div className="info">
                                                                    <div className="label">+998941882001</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div> : ""
                                            }
                                        </div>

                                    </div>
                            })
                        }
                    </div>
                </>
        }

    </div>
}

export default History