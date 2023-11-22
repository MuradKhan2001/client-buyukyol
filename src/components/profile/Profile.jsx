import "./style.scss";
import {useTranslation} from "react-i18next";

const Profile = () => {
    const {t} = useTranslation();


    return <div className="profile-container">
        <div className="title">
            {t("nav-profile")}
        </div>

        <div className="person">
            <div className="photo">
                <img src="./images/user.png" alt="user"/>
            </div>
            <div className="text">
                <div className="name">Malikov Murodxon</div>
                <div className="phone">+998941882001</div>
            </div>
        </div>

        <div className="send-buttons">
            <div className="send-btn">
                <div className="left">
                    <div className="icon">
                        <img src="./images/Vector.png" alt="Vector"/>
                    </div>
                    <div className="name">Ulashish</div>
                </div>
                <div className="right">
                    <img src="./images/Stroke.png" alt="Stroke"/>
                </div>
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