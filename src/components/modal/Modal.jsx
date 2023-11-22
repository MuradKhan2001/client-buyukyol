import {useRef, useState} from "react";
import {CSSTransition} from "react-transition-group";
import {useSelector, useDispatch} from "react-redux";
import {hideModal} from "../../redux/ModalContent"
import "./style.scss"
import {useTranslation} from "react-i18next";

const Modal = () => {
    const {t} = useTranslation();
    const nodeRef = useRef(null);
    const dispatch = useDispatch()
    const modalContent = useSelector((store) => store.ModalContent.data)

    const logOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        window.location.reload()
        window.location.pathname = "/"
    }

    return <CSSTransition
        in={modalContent.show}
        nodeRef={nodeRef}
        timeout={300}
        classNames="alert"
        unmountOnExit
    >
        <div className="modal-sloy">

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
                            <div className="cancel-order">
                                {t("button3")}
                            </div>}

                    </div>
                }

            </div>

        </div>

    </CSSTransition>
}
export default Modal