import "./style.scss";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import { RWebShare } from "react-web-share";


const Profile = () => {
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
                            <div className="name">Ulashish</div>
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
                    <div className="name">Baholash</div>
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
                    <div className="name">Biz bilan bog’lanish</div>
                </div>
                <div className="right">
                    <img src="./images/Stroke.png" alt="Stroke"/>
                </div>
            </div>
        </div>
    </div>
}

export default Profile