import PhoneInput from "react-phone-number-input";
import AuthCode from "react-auth-code-input";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnKeyPress } from "./useOnKeyPress";
import "./style.scss";
import Alerts from "../alerts/Alerts";
import { useSelector, useDispatch } from "react-redux";
import { delAlert, addAlert } from "../../redux/AlertsBox";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const Login = () => {
  const { t } = useTranslation();
  const baseUrl = useSelector((store) => store.baseUrl.data);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [checkCode, setCheckCode] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(60);

  const resetTimer = () => {
    setMinutes(0);
    setSeconds(59);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(60);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [checkCode ? seconds : null]);

  const getCodeValue = (e) => {
    setCode(e);
  };
  const HandleLogin = () => {
    let user = {
      phone: phone,
      user_type: "Client",
    };
    axios
      .post(`${baseUrl}api/login/`, user)
      .then((response) => {
        localStorage.setItem("userId", response.data.user);
        setCheckCode((prevState) => true);

        if (checkCode) {
          resetTimer();
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          let idAlert = Date.now();
          let alert = {
            id: idAlert,
            text: t("no-user"),
            img: "./images/yellow.svg",
            color: "#FFFAEA",
          };
          dispatch(addAlert(alert));
          setTimeout(() => {
            dispatch(delAlert(idAlert));
          }, 5000);
        }

        if (error.response.status === 406) {
          let idAlert = Date.now();
          let alert = {
            id: idAlert,
            text: t("alert4"),
            img: "./images/yellow.svg",
            color: "#FFFAEA",
          };
          dispatch(addAlert(alert));
          setTimeout(() => {
            dispatch(delAlert(idAlert));
          }, 5000);
        }
      });
  };
  const CheckCode = () => {
    axios
      .post(`${baseUrl}api/verify/`, {
        user: localStorage.getItem("userId"),
        number: code,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 404) {
          let idAlert = Date.now();
          let alert = {
            id: idAlert,
            text: t("alert5"),
            img: "./images/yellow.svg",
            color: "#FFFAEA",
          };
          dispatch(addAlert(alert));
          setTimeout(() => {
            dispatch(delAlert(idAlert));
          }, 5000);
        }
      });
  };

  const language = [
    {
      code: "uz",
      name: "UZ",
      country_code: "uz",
    },
    {
      code: "en",
      name: "EN",
      country_code: "en",
    },
    {
      code: "ru",
      name: "RU",
      country_code: "ru",
    },
  ];
  const changeLanguage = (code) => {
    localStorage.setItem("lng", code);
    i18next.changeLanguage(code);
  };

  useOnKeyPress(checkCode ? CheckCode : HandleLogin, "Enter");

  return (
    <div className="login-container">
      <Alerts />
      <div className="left">
        <div className="sloy">
          <img src="./images/white-logo.png" alt="white-logo" />
        </div>
      </div>
      <div className="right">
        <div className="language-box">
          {language.map(({code, name, country_code}) => (
              <div
                  key={country_code}
                  onClick={() => changeLanguage(code)}
                  className={`language ${
                      i18next.language === code ? "active" : ""
                  }`}
              >
                {name}
              </div>
          ))}
        </div>

        <div className="title-login">{t("button5")}</div>

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
                onChange={setPhone}
            />
          </div>

          {checkCode ? (
              <button
                  disabled={
                      phone === "" ||
                      phone === undefined ||
                      seconds > 0 ||
                      minutes > 0
                  }
                  onClick={HandleLogin}
                  className={
                    seconds > 0 ||
                    minutes > 0 ||
                    phone === "" ||
                    phone === undefined
                        ? "login-btn-disablet"
                        : "login-btn"
                  }
              >
                {t("logintext4")}
              </button>
          ) : (
              <button
                  disabled={phone === "" || phone === undefined}
                  onClick={HandleLogin}
                  className={
                    phone === "" || phone === undefined
                        ? "login-btn-disablet"
                        : "login-btn"
                  }
              >
                {t("logintext3")}
              </button>
          )}
        </div>

        {checkCode && (
            <div className="coundown">
              <div className="count">
                <img src="./images/time.png" alt=""/>
                {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </div>
            </div>
        )}

        <div className="form-verify">
          {checkCode && (
              <>
                <div className="inputs-verify-code">
                  <label htmlFor="phone" className="label-form">
                    {t("logintext")}
                  </label>
                  <AuthCode
                      allowedCharacters="numeric"
                      length="5"
                      onChange={getCodeValue}
                  />
                </div>

                <button
                    disabled={code.trim().length < 5}
                    onClick={CheckCode}
                    className={
                      code.trim().length < 5 ? "login-btn-disablet" : "login-btn"
                    }
                >
                  {t("button5")}
                </button>

              </>
          )}
        </div>

        <div className="text-register">
          <div className="label-text">{t("registertext1")}</div>
          <span onClick={() => navigate("/register")}>{t("button6")}</span>
        </div>

        <div className="button-box">
          <a href="https://play.google.com/store/apps/details?id=uz.buyukyol.client&pli=1"
             target="_blank">
            <button>
              <div className="icon">
                <img src="./images/androit.png" alt=""/>
              </div>
              <div className="text">
                <div className="text-top"> GET IN ON</div>
                <div className="text-bottom"> Google Play</div>
              </div>
            </button>
          </a>

          <a href="https://apps.apple.com/uz/app/buyuk-yol-mijoz/id6479218904" target="_blank">
            <button>
              <div className="icon">
                <img src="./images/ios.png" alt=""/>
              </div>
              <div className="text">
                <div className="text-top"> Download on the</div>
                <div className="text-bottom">App Store</div>
              </div>
            </button>
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;
