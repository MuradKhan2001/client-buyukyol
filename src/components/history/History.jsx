import {useEffect, useState} from "react";
import "./style.scss"
import Loader from "../loader/Loader";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {showModals} from "../../redux/ModalContent";
import {getOrders} from "../../redux/Orders";


const History = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const [activeTab, setActiveTab] = useState("Active")
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
    const ordersList = useSelector((store) => store.Orders.data)

    useEffect(() => {
        dispatch(getOrders())
    }, [])

    const showModalContent = (order) => {
        dispatch(showModals({show: true, status: "order", order}))
    }

    return <div className="history-container">
         <div className="title-history">
                        {t("nav-history")}
                    </div>

                    <div className="header-history">

                        <div className="tabs-box">
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
                                                        {item.order_title ? item.order_title : item.type === "OUT" ? t("direction2") :
                                                            item.type === "IN" ? t("direction3") : t("direction1")}
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
                                                    <a href={`tel:${item.driver.phone}`} className="bottom-side-driver">
                                                    
                                                        <div className="photo">
                                                            <img src={baseUrl + item.driver.image} alt=""/>
                                                        </div>

                                                        <div className="content">
                                                            <div className="title">
                                                                {item.driver.name}
                                                            </div>
                                                            <div className="text">
                                                                <img src="./images/truck2.png" alt=""/>
                                                                <div className="info">
                                                                    <div className="label">
                                                                        {item.driver.car_name}
                                                                    </div>
                                                                    <div className="content">
                                                                        {item.driver.car_number}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text">
                                                                <img src="./images/phone.png" alt=""/>
                                                                <div className="info">
                                                                    <div className="label">{item.driver.phone}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </a> : ""
                                            }
                                        </div>
                                    </div>
                            })
                        }
                    </div>
    </div>
}

export default History