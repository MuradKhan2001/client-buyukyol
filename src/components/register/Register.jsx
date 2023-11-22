import {useSelector} from "react-redux";
import PhoneInput from 'react-phone-number-input'
import AuthCode from "react-auth-code-input";
import axios from "axios";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useOnKeyPress} from "./useOnKeyPress";
import "./style.scss"

const Register = () => {
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

        if (phone.trim().length > 4 && last_name.trim().length > 0 && first_name.trim().length > 0) {

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
                    alert("Bu raqamga sms jo'natib bo'lamaydi ")
                }

            }).catch((error) => {
                if (error.response.status === 404) {
                    alert("Bu raqamga sms jo'natib bo'lamaydi ")
                }
            });

        } else {
            alert("Ma'lumotlarni to'liq kiriting")
        }
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
                    alert("Tasdiqlash kodi xato!")
                }
            });

        } else {
            alert("Ko'dni to'liq kiriting")
        }

    };

    useOnKeyPress(checkCode ? CheckCode : HandleLogin, 'Enter');

    return <div className="register-container">
        <div className="left">
            <div className="sloy">
                <img src="./images/white-logo.svg" alt="white-logo"/>
            </div>
        </div>

        <div className="right">
            <div className="title-login">
                Ro'yxatdan o'tish
            </div>

            <div className="form">
                <div className="register-inputs">
                    <label htmlFor="first_name" className="label-form">Ism</label>
                    <input onChange={getFirstName} id="first_name" type="text"/>

                    <label htmlFor="phone" className="label-form">Familiya</label>
                    <input onChange={getLastName} id="last_name" type="text"/>
                </div>
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
                {
                    checkCodeCount > 3 || (phone  === "" || first_name === "" || last_name === "") ? <button className="login-btn-disablet">
                        {checkCodeCount > 3 ? "Qayta yuborish" : "Ko'dni olish"}
                    </button> : <button onClick={HandleLogin} className="login-btn">
                        {checkCode ? "Qayta yuborish" : "Ko'dni olish"}
                    </button>
                }
            </div>

            <div className="form-verify">
                {
                    checkCode && <>
                        <div className="inputs-verify-code">
                            <label htmlFor="phone" className="label-form">Tasdiqlash kodi</label>
                            <AuthCode allowedCharacters='numeric' length="5" onChange={getCodeValue}/>
                        </div>
                        <button onClick={CheckCode} className="login-btn">
                            Kirish
                        </button>
                    </>
                }
            </div>

            <div className="text-register">
                <div className="label-text">Siz allaqachon ro'yxatdan o'tganmisiz?</div>
                <span onClick={() => navigate("/")}>Kirish</span>
            </div>
        </div>
    </div>
}

export default Register