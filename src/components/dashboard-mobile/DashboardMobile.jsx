import {Route, Routes, NavLink, useNavigate} from "react-router-dom";
import {userPageRoutes} from "../../routes/Routes";
import "./style.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";


const DashboardMobile = () => {
    const navigate = useNavigate();
    const [nav, setNav] = useState(false)
    const {t} = useTranslation();
    const baseUrl = useSelector((store) => store.baseUrl.data)

    useEffect(() => {
        axios.get(`${baseUrl}api/client/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
            },
        }).then((response) => {
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
            }
        });
    }, []);

    return (<div className="dashboard-container">

            <div  className="body-side">
                <Routes>
                    {userPageRoutes.map((route, index) => (
                        <Route key={index} {...route} />
                    ))}
                </Routes>
            </div>

            <div onClick={() => setNav(prevState => !prevState)} className="burger">
                <img src="./images/menu-burger.png" alt=""/>
            </div>

            <div className={`menu-berger ${nav ? "show-menu" : ""}`}>

                <div className="header-menu">
                    <div className="close-menu">
                        <img onClick={() => setNav(prevState => false)} src="./images/xx.png" alt=""/>
                    </div>
                    <div className="logo-menu">
                        <img src="./images/white-logo.png" alt=""/>
                    </div>
                </div>

                <div className="body-menu">

                    <div onClick={() => {
                        navigate("/")
                        setNav(prevState => false)
                    }} className="menu-item">
                        <div className="left-menu">
                            <div className="icon-home">
                                <img src="./images/house.png" alt=""/>
                            </div>

                            <div className="name">
                                {t("nav-home")}
                            </div>
                        </div>
                        <div className="icon">
                            <img src="./images/left.png" alt=""/>
                        </div>
                    </div>


                    <div onClick={() => {
                        navigate("/profile")
                        setNav(prevState => false)
                    }} className="menu-item">
                        <div className="left-menu">
                            <div className="icon">
                                <img src="./images/person-menu.png" alt=""/>
                            </div>
                            <div className="name">
                                {t("nav-profile")}
                            </div>
                        </div>
                        <div className="icon">
                            <img src="./images/left.png" alt=""/>
                        </div>
                    </div>

                    <div onClick={() => {
                        navigate("/history")
                        setNav(prevState => false)
                    }} className="menu-item">
                        <div className="left-menu">
                            <div className="icon">
                                <img src="./images/history.png" alt=""/>
                            </div>
                            <div className="name">
                                {t("nav-history")}
                            </div>
                        </div>
                        <div className="icon">
                            <img src="./images/left.png" alt=""/>
                        </div>
                    </div>

                    <div onClick={() => {
                        navigate("/settings")
                        setNav(prevState => false)
                    }} className="menu-item">
                        <div className="left-menu">
                            <div className="icon-home">
                                <img src="./images/settings.png" alt=""/>
                            </div>
                            <div className="name">
                                {t("nav-settings")}
                            </div>
                        </div>
                        <div className="icon">
                            <img src="./images/left.png" alt=""/>
                        </div>
                    </div>

                </div>
            </div>

            {/*<div className="footer-side">*/}
            {/*    <NavLink*/}
            {/*        to="/"*/}
            {/*        className={`menu-item ${({isActive}) => isActive ? "active" : ""}`}*/}
            {/*    >*/}
            {/*        <div className="icon">*/}
            {/*            <div className="icons house"/>*/}
            {/*        </div>*/}
            {/*    </NavLink>*/}

            {/*    <NavLink*/}
            {/*        to="/history"*/}
            {/*        className={`menu-item ${({isActive}) => isActive ? "active" : ""}`}*/}
            {/*    >*/}
            {/*        <div className="icon">*/}
            {/*            <div className="icons history"/>*/}
            {/*        </div>*/}
            {/*    </NavLink>*/}

            {/*    <NavLink*/}
            {/*        to="/settings"*/}
            {/*        className={`menu-item ${({isActive}) => isActive ? "active" : ""}`}*/}
            {/*    >*/}
            {/*        <div className="icon">*/}
            {/*            <div className="icons settings"/>*/}
            {/*        </div>*/}
            {/*    </NavLink>*/}

            {/*    <NavLink*/}
            {/*        to="/profile"*/}
            {/*        className={`menu-item ${({isActive}) => isActive ? "active" : ""}`}*/}
            {/*    >*/}
            {/*        <div className="icon">*/}
            {/*            <div className="icons profile"/>*/}
            {/*        </div>*/}
            {/*    </NavLink>*/}

            {/*</div>*/}
        </div>
    );
};

export default DashboardMobile;
