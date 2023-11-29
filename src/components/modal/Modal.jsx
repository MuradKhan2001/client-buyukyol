import {useRef, useState, useContext, useEffect} from "react";
import {CSSTransition} from "react-transition-group";
import {useSelector, useDispatch, shallowEqual} from "react-redux";
import ReactStars from 'react-stars'
import {hideModal, showModals} from "../../redux/ModalContent"
import "./style.scss"
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {webSockedContext} from "../dashboard/Dashboard";
import {getOrders} from "../../redux/Orders";


const Modal = () => {
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const modalContent = useSelector((store) => store.ModalContent.data)
    const activeOrders = useSelector((store) => store.Orders.activeOrders)
    const drivers = useSelector((store) => store.DriversList.data, shallowEqual)
    let webSocked = useContext(webSockedContext);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const nodeRef = useRef(null);
    const dispatch = useDispatch()

    const [radiCount, setRaidCount] = useState()
    const [reason, setReason] = useState("");
    const [add_reason, setAdd_Reason] = useState("");
    const [cargoId, setCargoId] = useState("");
    const [many, setMany] = useState(false);

    const logOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        window.location.reload()
        window.location.pathname = "/"
    }
    const showCancel = () => {
        setCargoId(modalContent.order.id)
        if (modalContent.order.number_cars > 1) {
            dispatch(showModals({show: true, status: "cancel-order-reason"}))
        } else dispatch(showModals({show: true, status: "cancel-order"}))
    }
    const delOrder = () => {
        let order = {
            command: "cancel_order",
            id: cargoId,
            reason,
            many
        };
        webSocked.send(JSON.stringify(order));
    };

    useEffect(() => {
        dispatch(getOrders())
        return () => {
            getOrders()
        }
    }, [])

    const showModalContent = (order) => {
        dispatch(showModals({show: true, status: "order", order}))
    }

    return <CSSTransition
        in={modalContent.show}
        nodeRef={nodeRef}
        timeout={300}
        classNames="alert"
        unmountOnExit
    >
        <div className={`modal-sloy ${modalContent.status === "order" ? "align-none" : ""}`}>

            <div ref={nodeRef} className="modal-card">

                {modalContent.status === "log-out" &&
                    <div className="confirm">
                        <div className="toptext">
                            Siz rostdan ham akkauntdan
                            <br/>
                            chiqmoqchimisiz?
                        </div>
                        <div className="btns">
                            <button className="not-out" onClick={() => dispatch(hideModal({show: false}))}>
                                Bekor qilish
                            </button>
                            <button onClick={logOut}>Chiqish</button>
                        </div>
                    </div>
                }

                {modalContent.status === "order" && modalContent.order &&
                    <div className="show-order">
                        <div className="cancel-btn">
                            <img onClick={() => dispatch(hideModal({show: false}))} src="./images/x.png" alt=""/>
                        </div>
                        <div className="title">
                            {t("moreInfo")}
                        </div>

                        <div className="info-direction">
                            <div className="label-info">{t("info1")}</div>
                            <div className="value-info">
                                {modalContent.order.type === "OUT" ? t("direction2") : ""}
                                {modalContent.order.type === "IN" ? t("direction3") : ""}
                                {modalContent.order.type === "Abroad" ? t("direction1") : ""}
                            </div>
                        </div>

                        <div className="info">
                            <div className="label-info">{t("loc1")}</div>
                            <div className="value-info"> {modalContent.order.address_from}</div>
                        </div>

                        <div className="info">
                            <div className="label-info">{t("loc3")}</div>
                            <div className="value-info"> {modalContent.order.address_to}</div>
                        </div>

                        <div className="info">
                            <div className="label-info"> {t("info2")}</div>
                            <div className="value-info"> {modalContent.order.cargo}</div>
                        </div>

                        <div className="info">
                            <div className="label-info">  {t("info7")}</div>
                            <div className="value-info">  {modalContent.order.distance} km</div>
                        </div>

                        <div className="info">
                            <div className="label-info"> {t("info10")}</div>
                            <div className="value-info">{modalContent.order.payment_type}</div>
                        </div>

                        <div className="info">
                            <div className="label-info"> {t("info8")}</div>
                            <div className="value-info">{modalContent.order.price} {modalContent.order.currency}</div>
                        </div>

                        <div className="info">
                            <div className="label-info"> {t("info3")}</div>
                            <div className="value-info"> {modalContent.order.number_cars}</div>
                        </div>

                        <div className="info">
                            <div className="label-info"> {t("info4")}</div>
                            <div className="value-info"> {modalContent.order.capacity} {modalContent.order.unit}</div>
                        </div>

                        <div className="info">
                            <div className="label-info">{t("info5")}</div>
                            <div className="value-info">
                                {modalContent.order.car_category.min_weight ? modalContent.order.car_category.min_weight : ""}-
                                {modalContent.order.car_category.max_weight ? modalContent.order.car_category.max_weight : ""} {t("infoWaits4")},
                                {modalContent.order.car_category.name === "Мини" && t("tariff1")}
                                {modalContent.order.car_category.name === "Енгил" && t("tariff2")}
                                {modalContent.order.car_category.name === "Ўрта" && t("tariff3")}
                                {modalContent.order.car_category.name === "Оғир" && t("tariff4")}
                                {modalContent.order.car_category.name === "Ўта оғир" && t("tariff5")}
                                {modalContent.order.car_category.name === "Авто Ташувчи" && t("tariff6")}
                            </div>
                        </div>

                        <div className="info">
                            <div className="label-info"> {t("info6")}</div>
                            <div className="value-info"> {modalContent.order.car_body_type.name}</div>
                        </div>

                        {modalContent.order.avans ? <div className="info">
                            <div className="label-info"> {t("info9")}</div>
                            <div className="value-info">  {modalContent.order.avans} {modalContent.order.currency}</div>
                        </div> : ""}

                        {modalContent.order.wait_cost ? <div className="info">

                            <div className="label-info"> {t("info11")}</div>

                            <div className="value-info">
                                {modalContent.order.wait_cost} {modalContent.order.currency}
                            </div>

                        </div> : ""}

                        {modalContent.order.load_time ? <div className="info">
                            <div className="label-info"> {t("info12")}</div>
                            <div className="value-info">
                                {modalContent.order.load_time.slice(0, 10)},
                                {modalContent.order.load_time.slice(11, 16)}
                            </div>
                        </div> : ""}

                        {modalContent.order.start_time ? <div className="info">
                            <div className="label-info"> {t("info13")}</div>
                            <div className="value-info">
                                {modalContent.order.start_time.slice(0, 10)},
                                {modalContent.order.start_time.slice(11, 16)}
                            </div>
                        </div> : ""}

                        {modalContent.order.status === "Delivered" ? <div className="info-direction">
                            <div className="label-info"> {t("timeCargo2")}</div>
                            <div className="value-info">
                                {modalContent.order.ordered_time.slice(0, 10)},
                                {modalContent.order.ordered_time.slice(11, 16)}
                            </div>
                        </div> : ""}


                        {modalContent.order.rejected_reason ? <div className="cancel-reason">
                            {modalContent.order.rejected_reason}
                        </div> : modalContent.order.status === "Delivered" ? "" :
                            <div onClick={showCancel}
                                 className="cancel-order">
                                {t("button3")}
                            </div>}

                    </div>
                }

                {modalContent.status === "cancel-order" &&
                    <div className="cancel-order">
                        <div className="cancel-btn">
                            <img onClick={() => dispatch(hideModal({show: false}))} src="./images/x.png" alt=""/>
                        </div>

                        <div className="title">
                            {t("reasonText")}
                        </div>

                        <div className="cancel-order-info">

                            <div>
                                <input onChange={(e) => {
                                    setReason(e.target.value)
                                }}
                                       id="reason1" type="radio" name="money"
                                       value={t("reason1")}/>
                                <label htmlFor="reason1">{t("reason1")}</label>
                            </div>

                            <div>
                                <input onChange={(e) => {
                                    setReason(e.target.value)
                                }} id="reason2" type="radio"
                                       name="money"
                                       value={t("reason2")}/>
                                <label htmlFor="reason2">{t("reason2")}</label>
                            </div>

                            <div>
                                <input onChange={(e) => {
                                    setReason(e.target.value)
                                }} id="reason3" type="radio"
                                       name="money"
                                       value={t("reason3")}/>
                                <label htmlFor="reason3">{t("reason3")}</label>
                            </div>

                            <div>
                                <input onChange={(e) => {
                                    setReason(e.target.value)
                                }} id="reason5" type="radio"
                                       name="money"
                                       value={add_reason}/>
                                <label htmlFor="reason3">
                                    <input placeholder={t("reason4")}
                                           onChange={(e) => setAdd_Reason(e.target.value)} id="reason4"
                                           type="text" name="money"/>
                                </label>
                            </div>

                            <div onClick={delOrder} className="cancel-btn">{t("button2")}
                            </div>

                        </div>

                    </div>
                }

                {modalContent.status === "cancel-order-reason" &&
                    <div className="cancel-order">
                        <div className="cancel-btn">
                            <img onClick={() => dispatch(hideModal({show: false}))} src="./images/x.png" alt=""/>
                        </div>

                        <div className="title-reason">
                            {t("reasonText1")}
                        </div>

                        <div className="cancel-order-info">
                            <div>
                                <input onChange={() => setMany(true)} id="reasonYes" type="radio" name="reasons"/>
                                <label htmlFor="reasonYes">{t("yes")}</label>
                            </div>

                            <div>
                                <input checked={true} onChange={() => setMany(false)} id="reasonNo" type="radio"
                                       name="reasons"/>
                                <label htmlFor="reasonNo">{t("no")}</label>
                            </div>

                            <div onClick={() => dispatch(showModals({show: true, status: "cancel-order"}))}
                                 className="cancel-btn">{t("button2")}</div>
                        </div>

                    </div>
                }

                {modalContent.status === "drivers" &&
                    <div className="drivers-list">
                        <div className="cancel-btn">
                            <img onClick={() => dispatch(hideModal({show: false}))} src="./images/x.png" alt=""/>
                        </div>

                        <div className="title">
                            {t("driver")}
                        </div>

                        <div className="drivers-info">
                            {
                                drivers.map((item, index)=>{
                                    return  <a href={`tel:${item.phone}`} key={index}  className="bottom-side-driver">
                                        <div className="photo">
                                            <img src={baseUrl + item.driver.image} alt=""/>
                                        </div>

                                        <div className="content">
                                            <div className="title">
                                                {item.driver.first_name}  &nbsp;
                                                {item.driver.last_name}
                                            </div>
                                            <div className="text">
                                                <img src="./images/truck2.png" alt=""/>
                                                <div className="info">
                                                    <div className="label">
                                                        {item.driver.documentation ? item.driver.documentation.name : ""}
                                                    </div>
                                                    <div className="content">
                                                        {item.driver.documentation ? item.driver.documentation.car_number : ""}
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
                                    </a>
                                })
                            }
                        </div>

                    </div>
                }

                {modalContent.status === "active-orders" &&
                    <div className="active-orders-list">
                        <div className="cancel-btn">
                            <img onClick={() => dispatch(hideModal({show: false}))} src="./images/x.png" alt=""/>
                        </div>

                        <div className="title">
                            {t("cargoLabel1")}
                        </div>

                        <div className="orders-info">
                            {
                                activeOrders.map((item, index) => {
                                    return <div key={index} onClick={() => {
                                        showModalContent(item)
                                    }} className="bottom-side-order">

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
                                })
                            }

                        </div>

                    </div>
                }

                {modalContent.status === "driver-raid" &&
                    <div className="driver-raid">
                        <div className="cancel-btn">
                            <img onClick={() => dispatch(hideModal({show: false}))} src="./images/x.png" alt=""/>
                        </div>

                        <div className="photo-driver">
                            <img src="./images/driver.png" alt=""/>
                        </div>

                        <div className="title">
                            Buyurtmangiz yakunlandi. Haydovchini baholang.
                        </div>

                        <div className="description">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, ducimus?
                        </div>

                        <div className="stars">
                            <ReactStars
                                count={5}
                                onChange={(e) => {
                                    setRaidCount(e)
                                }} size={50}
                                color2={'#047766'}
                                half={false}/>
                        </div>

                        <div className="buttons">
                            <button onClick={() => dispatch(hideModal({show: false}))}
                                    className="cancel-btn">{t("button3")}</button>

                            <button className="next-btn ">{t("button2")}</button>
                        </div>
                    </div>
                }

                {modalContent.status === "active-driver" &&
                    <div className="active-driver-list">
                        <div className="cancel-btn">
                            <img onClick={() => dispatch(hideModal({show: false}))} src="./images/x.png" alt=""/>
                        </div>

                        <div className="title">
                            Buyurtma
                        </div>

                        <div className="drivers-info">
                            <div onClick={() => {
                                navigate("/history")
                                dispatch(hideModal({show: false}))
                            }} className="bottom-side-driver">
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
                                            <div className="label">
                                                MAN
                                            </div>
                                            <div className="content">
                                                L288SA
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text">
                                        <img src="./images/phone.png" alt=""/>
                                        <div className="info">
                                            <div className="label">+998941882001</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="information-cargo">
                                <div className="label-info">
                                    {t("loc1")}
                                </div>
                                <div className="info">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, tenetur!
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, tenetur!
                                </div>
                            </div>

                            <div className="information-cargo">
                                <div className="label-info">
                                    {t("loc3")}
                                </div>
                                <div className="info">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, tenetur!
                                </div>
                            </div>

                            <div className="information-cargo">
                                <div className="label-info">
                                    {t("info2")}
                                </div>
                                <div className="info">
                                    Mevalar
                                </div>
                            </div>

                            <div className="information-cargo">
                                <div className="label-info">
                                    {t("info4")}
                                </div>
                                <div className="info">
                                    10 tonna
                                </div>
                            </div>

                            <div className="information-cargo">
                                <div className="label-info">
                                    {t("info8")}
                                </div>
                                <div className="info">
                                    1000 dolor
                                </div>
                            </div>

                        </div>

                    </div>
                }

            </div>

        </div>

    </CSSTransition>
}
export default Modal