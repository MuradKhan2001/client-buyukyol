import {useDispatch, useSelector} from "react-redux";
import PhoneInput from 'react-phone-number-input'
import AuthCode from "react-auth-code-input";
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useOnKeyPress} from "./useOnKeyPress";
import "./style.scss"
import {addAlert, delAlert} from "../../redux/AlertsBox";
import {useTranslation} from "react-i18next";

const Register = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const navigate = useNavigate();
    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [checkCode, setCheckCode] = useState(false)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(60)
    const [checkVerify, setCheckVerify] = useState(false)

    const resetTimer = () => {
        setMinutes(0)
        setSeconds(59)
    }

    useEffect(() => {

        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1)
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval)
                } else {
                    setSeconds(60)
                    setMinutes(minutes - 1)
                }
            }
        }, 1000)

        return () => {
            clearInterval(interval)
        }

    }, [checkCode ? seconds : null])
    const getCodeValue = (e) => {
        setCode(e)
    }
    const getFirstName = (e) => {
        setFirst_name(e.target.value)
    }
    const getLastName = (e) => {
        setLast_name(e.target.value)
    }
    const HandleLogin = () => {
        let user = {
            first_name,
            last_name,
            phone,
            user_type: "Client"
        };

        axios.post(`${baseUrl}api/register/`, user).then((response) => {
            if (response.data.user) {
                localStorage.setItem("userId", response.data.user);
                setCheckCode(prevState => true)
                if (checkCode) {
                    resetTimer()
                }
            } else {
                let idAlert = Date.now()
                let alert = {
                    id: idAlert,
                    text: t("alert4"),
                    img: "./images/yellow.svg",
                    color:"#FFFAEA"
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
                    text: t("alert4"),
                    img: "./images/yellow.svg",
                    color:"#FFFAEA"
                }
                dispatch(addAlert(alert))
                setTimeout(() => {
                    dispatch(delAlert(idAlert))
                }, 5000)
            }
        });
    };
    const CheckCode = () => {
        axios.post(`${baseUrl}api/verify/`, {
            user: localStorage.getItem("userId"),
            number: code
        }).then((response) => {

            localStorage.setItem("token", response.data.token);
            navigate("/")
            window.location.reload()

        }).catch((error) => {

            if (error.response.status === 404) {
                let idAlert = Date.now()
                let alert = {
                    id: idAlert,
                    text: t("alert5"),
                    img: "./images/yellow.svg",
                    color:"#FFFAEA"
                }
                dispatch(addAlert(alert))
                setTimeout(() => {
                    dispatch(delAlert(idAlert))
                }, 5000)
            }
        });
    };

    useOnKeyPress(checkCode ? CheckCode : HandleLogin, 'Enter');

    return <div className="register-container">
        <div className="left">
            <div className="sloy">
                <img src="./images/white-logo.png" alt="white-logo"/>
            </div>
        </div>

        <div className="right">
            <div className="title-login">
                {t("button6")}
            </div>

            <div className="form">
                <div className="register-inputs">
                    <label htmlFor="first_name" className="label-form">{t("registertext2")}</label>
                    <input onChange={getFirstName} id="first_name" type="text"/>

                    <label htmlFor="phone" className="label-form">{t("registertext3")}</label>
                    <input onChange={getLastName} id="last_name" type="text"/>
                </div>
            </div>

            <div className="form">

                <div className="inputs">
                    <label htmlFor="phone" className="label-form">
                        {t("logintext")}
                    </label>
                    <PhoneInput
                        id="phone"
                        international
                        defaultCountry="UZ"
                        value={phone}
                        onChange={setPhone}/>
                </div>

                {checkCode ? <button
                    disabled={phone === "" || phone === undefined || !first_name.trim().length > 0 || !last_name.trim().length > 0 || seconds > 0 || minutes > 0}
                    onClick={HandleLogin}
                    className={phone === "" || phone === undefined || !first_name.trim().length > 0 || !last_name.trim().length > 0 || seconds > 0 || minutes > 0 ?
                        "login-btn-disablet" : "login-btn"}>

                    {t("logintext4")}

                </button> : <button
                    disabled={phone === "" || phone === undefined || !first_name.trim().length > 0 || !last_name.trim().length > 0}
                    onClick={HandleLogin}
                    className={phone === "" || phone === undefined || !first_name.trim().length > 0 || !last_name.trim().length > 0 ?
                        "login-btn-disablet" : "login-btn"}>
                    {t("logintext3")}
                </button>}

            </div>

            {
                checkCode &&
                <div className="coundown">
                    <div className="count">
                        <img src="./images/time.png" alt=""/>
                        {minutes < 10 ? `0${minutes}` : minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                    </div>
                </div>
            }

            {
                checkCode &&
                <div className="check-box">
                    <div className="checkbox-wrapper-13">
                        <input onChange={(e) => {
                            setCheckVerify(prevState => !prevState)
                        }} id="c1-13" type="checkbox"/>
                    </div>
                    <label htmlFor="c1-13">
                        Roʻyxatdan oʻtish orqali siz bizning maxfiylik siyosatimiz bilan bogʻliq shartlarimizga rozilik
                        bildirasiz.
                    </label>
                </div>
            }


            <div className="form-verify">
                {
                    checkCode && <>
                        <div className="inputs-verify-code">
                            <label htmlFor="phone" className="label-form">{t("logintext2")}</label>
                            <AuthCode allowedCharacters='numeric' length="5" onChange={getCodeValue}/>
                        </div>

                        <button disabled={checkVerify === false || code.trim().length < 5} onClick={CheckCode}
                                className={checkVerify === false || code.trim().length < 5 ? "login-btn-disablet" : "login-btn"}>
                            {t("button6")}
                        </button>
                    </>
                }
            </div>

            <div className="text-register">
                <div className="label-text">{t("registertext4")}</div>
                <span onClick={() => navigate("/")}> {t("button5")}</span>
            </div>
        </div>
    </div>
}

export default Register