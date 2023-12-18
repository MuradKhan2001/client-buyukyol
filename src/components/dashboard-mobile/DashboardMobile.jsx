import {Route, Routes, NavLink} from "react-router-dom";
import {userPageRoutes} from "../../routes/Routes";
import "./style.scss";
import {useEffect} from "react";
import axios from "axios";


const DashboardMobile = () => {

    useEffect(() => {
        axios.get(`https://api.buyukyol.uz/api/client/`, {
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

    return ( <div className="dashboard-container">
                <div className="body-side">
                    <Routes>
                        {userPageRoutes.map((route, index) => (
                            <Route key={index} {...route} />
                        ))}
                    </Routes>
                </div>

                <div className="footer-side">
                    <NavLink
                        to="/"
                        className={`menu-item ${({isActive}) =>
                            isActive ? "active" : ""}`}
                    >
                        <div className="icon">
                            <div className="icons house"/>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/history"
                        className={`menu-item ${({isActive}) =>
                            isActive ? "active" : ""}`}
                    >
                        <div className="icon">
                            <div className="icons history"/>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={`menu-item ${({isActive}) =>
                            isActive ? "active" : ""}`}
                    >
                        <div className="icon">
                            <div className="icons settings"/>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={`menu-item ${({isActive}) =>
                            isActive ? "active" : ""}`}
                    >
                        <div className="icon">
                            <div className="icons profile"/>
                        </div>
                    </NavLink>

                </div>
        </div>
    );
};

export default DashboardMobile;
