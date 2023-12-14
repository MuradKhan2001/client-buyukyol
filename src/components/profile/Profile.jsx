import "./style.scss";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import { RWebShare } from "react-web-share";
import {showModals} from "../../redux/ModalContent";


const Profile = () => {
    const dispatch = useDispatch();
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const {t} = useTranslation();
    const [user, setUser] = useState("")

    useEffect(() => {
        axios.get(`${baseUrl}api/client/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }
        ).then((response) => {
            setUser(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
            }
        });


    }, [])


    const showModalContent = () => {
        dispatch(showModals({show: true, status: "log-out"}));
    };

    return <div className="profile-container">
        <div className="title">
            {t("nav-profile")}
        </div>

        <div className="person">
            <div className="photo">
                <img src="./images/user.png" alt="user"/>
            </div>
            <div className="text">
                <div className="name">{user.first_name && user.first_name} {user.last_name && user.last_name}</div>
                <div className="phone">{user.phone && user.phone}</div>
            </div>
        </div>

        <div className="send-buttons">

            <div className="send-btn">

                <RWebShare
                    data={{
                        text: "Web Share - GfG",
                        url: "http://localhost:3000",
                        title: "Buyuk yo'l",
                    }}
                    onClick={() =>
                        console.log("shared successfully!")
                    }
                >
                    <>
                        <div className="left">
                            <div className="icon">
                                <img src="./images/Vector.png" alt="Vector"/>
                            </div>
                            <div className="name">
                                {t("share")}
                            </div>
                        </div>
                        <div className="right">
                            <img src="./images/Stroke.png" alt="Stroke"/>
                        </div>
                    </>
                </RWebShare>
            </div>

            <div className="send-btn">
                <div className="left">
                    <div className="icon">
                        <img src="./images/help.png" alt="Vector"/>
                    </div>
                    <div className="name">
                        {t("grade")}
                    </div>
                </div>
                <div className="right">
                    <img src="./images/Stroke.png" alt="Stroke"/>
                </div>
            </div>

            <div className="send-btn">
                <div className="left">
                    <div className="icon">
                        <img src="./images/sms.png" alt="Vector"/>
                    </div>
                    <div className="name">
                        {t("contact")}
                    </div>
                </div>
                <div className="right">
                    <img src="./images/Stroke.png" alt="Stroke"/>
                </div>
            </div>


            <div onClick={showModalContent} className="send-btn-log-out">
                <div className="left">
                    <div className="icon">
                        <img src="./images/sign-out.png" alt="Vector"/>
                    </div>
                    <div className="name">
                        {t("log-out")}
                    </div>
                </div>
                <div className="right">
                    <img src="./images/Stroke.png" alt="Stroke"/>
                </div>
            </div>

        </div>
    </div>
}

export default Profile