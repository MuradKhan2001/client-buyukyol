import axios from "axios";
import "./style.scss"
import {useEffect, useState} from "react";
import i18next from "i18next";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const Notification = () => {
    const {t} = useTranslation();
    const [newsList, setNewsList] = useState([])
    const baseUrl = useSelector((store) => store.baseUrl.data)

    useEffect(() => {
        axios.get(`${baseUrl}api/news/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }, params: {
                user_type: "Client"
            }
        }).then((response) => {
            setNewsList(response.data)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
            }
        });
    }, [])

    return <div className="notification-container">
        <div className="title">
            {t("news")}
        </div>
        <div className="news-warpper">
            {newsList.map((item, index) => {
                return <div key={index} className="news">
                    <div className="image">
                        <img src={item.image} alt=""/>
                    </div>
                    <div className="date">{item.time.slice(0, 10)}</div>
                    <div className="news-title">
                        {item.title}
                    </div>
                    <div className="news-des">
                        {i18next.language === "uz" && item.description}
                        {i18next.language === "ru" && item.description_ru}
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default Notification