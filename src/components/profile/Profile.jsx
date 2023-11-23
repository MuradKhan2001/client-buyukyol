import "./style.scss";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getUser} from "../../redux/User";
import { RWebShare } from "react-web-share";


const Profile = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const user = useSelector((store) => store.User.data)

    useEffect(() => {
        dispatch(getUser())
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