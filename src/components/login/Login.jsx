import PhoneInput from 'react-phone-number-input'
import AuthCode from "react-auth-code-input";
import axios from "axios";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useOnKeyPress} from "./useOnKeyPress";
import "./style.scss"
import Alerts from "../alerts/Alerts";
import {useSelector, useDispatch} from "react-redux";
import {delAlert, addAlert} from "../../redux/AlertsBox"


const Login = () => {
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [checkCode, setCheckCode] = useState(false)
    const [checkCodeCount, setCheckCodeCount] = useState(0)
    const getCodeValue = (e) => {
        setCode(e)
    }
    const HandleLogin = () => {
        if (phone.trim().length > 4) {
            let user = {
                phone: phone, user_type: "Client"
            };
            axios.post(`${baseUrl}api/login/`, user).then((response) => {

                if (response.data.user) {
                    localStorage.setItem("userId", response.data.user);
                    setCheckCode(true)
                    setCheckCodeCount(prevState => prevState + 1)
                } else {
                    let idAlert = Date.now()
                    let alert = {
                        id: idAlert,
                        text: "Bu raqamga sms jo'natib bo'lmaydi!",
                        img: "./images/alert-warning.png"
                    }
                    dispatch(addAlert(alert))
                    setTimeout(() => {
                        dispatch(delAlert(idAlert))
                    }, 5000)
                }

            }).catch((error) => {
                if (error.response.status === 404) {

                    let idAlert = Date.now()
                    let alert = {
                        id: idAlert,
                        text: "Bu raqamga sms jo'natib bo'lmaydi!",
                        img: "./images/alert-warning.png"
                    }
                    dispatch(addAlert(alert))
                    setTimeout(() => {
                        dispatch(delAlert(idAlert))
                    }, 5000)
                }
            });

        } else {

            let idAlert = Date.now()
            let alert = {
                id: idAlert, text: "Telefon raqam kiriting!", img: "./images/alert-warning.png"
            }
            dispatch(addAlert(alert))
            setTimeout(() => {
                dispatch(delAlert(idAlert))
            }, 5000)

        }
    };

    const CheckCode = () => {

        if (code.trim().length === 5) {

            axios.post(`${baseUrl}api/verify/`, {
                user: localStorage.getItem("userId"), number: code
            }).then((response) => {

                localStorage.setItem("token", response.data.token);
                navigate("/")
                window.location.reload()

            }).catch((error) => {

                if (error.response.status === 404) {

                    let idAlert = Date.now()
                    let alert = {
                        id: idAlert,
                        text: "Tasdiqlash ko'di xato!",
                        img: "./images/alert-warning.png"
                    }
                    dispatch(addAlert(alert))
                    setTimeout(() => {
                        dispatch(delAlert(idAlert))
                    }, 5000)
                }

            });

        } else {
            let idAlert = Date.now()
            let alert = {
                id: idAlert,
                text: "Tasdiqlash ko'dini to'liq kiriting!",
                img: "./images/alert-warning.png"
            }
            dispatch(addAlert(alert))
            setTimeout(() => {
                dispatch(delAlert(idAlert))
            }, 5000)
        }

    };

    // useOnKeyPress(checkCode ? CheckCode : HandleLogin, 'Enter');

    return <div className="login-container">
        <Alerts/>
        <div className="left">
            <div className="sloy">
                <img src="./images/white-logo.svg" alt="white-logo"/>
            </div>

        </div>
        <div className="right">
            <div className="title-login">
                Kirish
            </div>

            <div className="form">
                <div className="inputs">
                    <label htmlFor="phone" className="label-form">Telefon raqam</label>
                    <PhoneInput
                        id="phone"
                        international
                        defaultCountry="UZ"
                        value={phone}
                        onChange={setPhone}/>
                </div>
                {checkCodeCount > 3 || phone === "" ? <button className="login-btn-disablet">
                    {checkCodeCount > 3 ? "Qayta yuborish" : "Ko'dni olish"}
                </button> : <button onClick={HandleLogin} className="login-btn">
                    {checkCode ? "Qayta yuborish" : "Ko'dni olish"}
                </button>}
            </div>

            <div className="form-verify">
                {checkCode && <>
                    <div className="inputs-verify-code">
                        <label htmlFor="phone" className="label-form">Tasdiqlash kodi</label>
                        <AuthCode allowedCharacters='numeric' length="5" onChange={getCodeValue}/>
                    </div>
                    <button onClick={CheckCode} className="login-btn">
                        Kirish
                    </button>
                </>}
            </div>

            <div className="text-register">
                <div className="label-text">Ro'yxatdan o'tmagan bo'lsangiz!</div>
                <span onClick={() => navigate("/register")}>Ro'yxatdan o'tish</span>
            </div>
        </div>
    </div>
}

export default Login