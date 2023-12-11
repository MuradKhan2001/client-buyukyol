import axios from "axios";
import {useSelector} from "react-redux";
import "./style.scss"
import {useEffect, useState} from "react";
import Loader from "../loader/Loader";
import i18next from "i18next";
import {useTranslation} from "react-i18next";

const Notification = () => {
    const {t} = useTranslation();
    const baseUrl = useSelector((store) => store.baseUrl.data)
    const [newsList, setNewsList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getNews = () => {
            axios.get(`${baseUrl}api/news/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                },
                params: {
                    user_type: "Client"
                }
            }).then((response) => {
                setNewsList(response.data)
                setLoading(prevState => !prevState)
            }).catch((error) => {
                if (error.response.statusText == "Unauthorized") {
                    window.location.pathname = "/";
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                }
            });
        }

        return () => {
            getNews()
        }

    }, [])


    return <div className="notification-container">
        {
            loading ? <Loader/> :
                <>
                    <div className="title">
                        {t("news")}
                    </div>

                    <div className="news-warpper">
                        {
                            newsList.map((item, index)=>{
                                return <div key={index} className="news">
                                    <div className="image">
                                        <img src={item.image} alt=""/>
                                    </div>
                                    <div className="date">{item.time.slice(0,10)}</div>
                                    <div className="news-title">
                                        {item.title}
                                    </div>
                                    <div className="news-des">
                                        {i18next.language === "uz" && item.description}
                                        {i18next.language === "ru" && item.description_ru}
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </>
        }
    </div>
}

export default Notification