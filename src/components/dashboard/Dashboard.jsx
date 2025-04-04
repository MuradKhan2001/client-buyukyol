import {useEffect, useState} from "react";
import {Route, Routes, NavLink} from "react-router-dom";
import {userPageRoutes} from "../../routes/Routes";
import i18next from "i18next";
import {useTranslation} from "react-i18next";
import "./style.scss";
import Modal from "../modal/Modal";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {showModals} from "../../redux/ModalContent";
import Alerts from "../alerts/Alerts";
import DashboardMobile from "../dashboard-mobile/DashboardMobile";
import axios from "axios";


const Dashboard = () => {
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [dropdownShow, setDropdownShow] = useState(false);
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


    useEffect(() => {
        axios.get(`${baseUrl}api/client/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
            },
        }).then((response) => {
        }).catch((error) => {
            if (error.response.status == 401) {
                window.location.pathname = "/";
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
            }
        });
    }, []);


    const changeLanguage = (code) => {
        localStorage.setItem("lng", code);
        i18next.changeLanguage(code);
        setDropdownShow((prevState) => (prevState = false));
    };

    const showModalContent = () => {
        dispatch(showModals({show: true, status: "log-out"}));
    };

    return (<div className="dashboard-main-container">
            <Modal/>
            <Alerts/>
            <div className="desktop-dashboard-container">
                <div className="left-side">
                    <div className="logo-box">
                        <img onClick={() => navigate("/")} className="desctop-logo" src="./images/logo-dashboard.png" alt=""/>
                        <img onClick={() => navigate("/")} className="mobile-logo" src="./images/logo-green.png"
                             alt=""/>
                        <div className="name">{t("text-main")}</div>
                    </div>

                    <div className="menu-box">
                        <NavLink
                            to="/"
                            className={`menu-item ${({isActive}) =>
                                isActive ? "active" : ""}`}
                        >
                            <div className="icon">
                                <div className="icons house"/>
                            </div>
                            <div className="name">{t("nav-home")}</div>
                        </NavLink>

                        <NavLink
                            to="/history"
                            className={`menu-item ${({isActive}) =>
                                isActive ? "active" : ""}`}
                        >
                            <div className="icon">
                                <div className="icons history"/>
                            </div>
                            <div className="name">{t("nav-history")}</div>
                        </NavLink>

                        <div className="menu-item">
                            <div className="icon">
                                <div className="icons settings"/>
                            </div>
                            <div className="name-disablet">{t("nav-settings")}</div>
                        </div>

                        <NavLink
                            to="/profile"
                            className={`menu-item ${({isActive}) =>
                                isActive ? "active" : ""}`}
                        >
                            <div className="icon">
                                <div className="icons profile"/>
                            </div>
                            <div className="name">{t("nav-profile")}</div>
                        </NavLink>
                    </div>
                </div>
                <div className="right-side">
                    <div className="top-side">
                        <div></div>
                        <div className="top-box">
                            <div onClick={() => navigate("/news")} className="notification">
                                <img src="./images/bell.png" alt="bell"/>
                                {/*<div className="count">6</div>*/}
                            </div>

                            <div className="language">
                                <div className="dropdown">
                                    <div
                                        onClick={() => setDropdownShow((prevState) => !prevState)}
                                        className="dropdown-header"
                                    >
                                        {language.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    {i18next.language === item.code ? item.name : ""}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {dropdownShow && (
                                        <div className="dropdown-menu">
                                            {language.map(({code, name, country_code}) => (
                                                <div
                                                    key={country_code}
                                                    onClick={() => changeLanguage(code)}
                                                    className="menu-item"
                                                >
                                                    {name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div onClick={showModalContent} className="log-out">
                                <img src="./images/sign-out.png" alt="sign-out"/>
                                {t("log-out")}
                            </div>
                        </div>
                    </div>

                    <div className="bottom-side">
                        <Routes>
                            {userPageRoutes.map((route, index) => (
                                <Route key={index} {...route} />
                            ))}
                        </Routes>
                    </div>
                </div>
            </div>

            <div className="mobile-dashboard-container">
                <DashboardMobile/>
            </div>
        </div>

    );
};

export default Dashboard;
