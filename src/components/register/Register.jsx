import {useDispatch, useSelector} from "react-redux";
import PhoneInput from 'react-phone-number-input'
import AuthCode from "react-auth-code-input";
import axios from "axios";
import {useState} from "react";
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
    const [checkCodeCount, setCheckCodeCount] = useState(0)
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
                setCheckCode(true)
                setCheckCodeCount(prevState => prevState + 1)
            } else {

                let idAlert = Date.now()
                let alert = {
                    id: idAlert,
                    text: t("alert4"),
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
                    text: t("alert4"),
                    img: "./images/alert-warning.png"
                }
                dispatch(addAlert(alert))
                setTimeout(() => {
                    dispatch(delAlert(idAlert))
                }, 5000)
            }
        });
    };
    const CheckCode = () => {

        if (code.trim().length === 5) {

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
                text: t("alert12"),
                img: "./images/alert-warning.png"
            }
            dispatch(addAlert(alert))
            setTimeout(() => {
                dispatch(delAlert(idAlert))
            }, 5000)
        }

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

                    <label htmlFor="phone" className="label-form">{t("registertext2")}</label>
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

                {checkCodeCount > 3 || (phone === undefined || phone === "" || first_name === "" || last_name === "") ? <button className="login-btn-disablet">
                    {checkCodeCount > 3 ? t("logintext4") : t("logintext3")}
                </button> : <button onClick={HandleLogin} className="login-btn">
                    {checkCode ? t("logintext4") : t("logintext3")}
                </button>}

            </div>

            <div className="form-verify">
                {
                    checkCode && <>
                        <div className="inputs-verify-code">
                            <label htmlFor="phone" className="label-form">{t("logintext2")}</label>
                            <AuthCode allowedCharacters='numeric' length="5" onChange={getCodeValue}/>
                        </div>

                        <button onClick={CheckCode} className="login-btn">
                            {t("button5")}
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