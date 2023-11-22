import {useRef, useState} from "react";
import {CSSTransition} from "react-transition-group";
import {useSelector, useDispatch} from "react-redux";
import {hideModal} from "../../redux/ModalContent"
import "./style.scss"

const Modal = () => {
    const nodeRef = useRef(null);
    const dispatch = useDispatch()
    const modalContent = useSelector((store) => store.ModalContent.data)

    const logOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        window.location.pathname = "/"
        window.location.reload()
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
                           <button className="not-out" onClick={() => dispatch(hideModal({show: false}))} >Bekor qilish</button>
                           <button onClick={logOut} >Chiqish</button>
                       </div>
                    </div>
                }

            </div>
        </div>

    </CSSTransition>
}
export default Modal