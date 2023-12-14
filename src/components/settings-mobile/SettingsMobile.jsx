import "./style.scss";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import i18next from "i18next";

const MapBoxMobile = () => {
    const [dropdown, setDropdown] = useState(false)
    const navigate = useNavigate();
    const {t} = useTranslation();

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

    return (<div className="settings-container">

        <div className="header">
            <div></div>
            <div className="title">
                {t("nav-settings")}
            </div>

            <div onClick={() => navigate("/news")} className="icon-news">
                <img src="./images/news.png" alt=""/>
            </div>
        </div>

        <div onClick={() => setDropdown(prevState => !prevState)} className="language-dropdown">
            <div className="left-side">
                <div className="icon">
                    <img src="./images/world.png" alt=""/>
                </div>
                <div className="name">
                    {t("language")}
                </div>
            </div>

            <div className="right-side">
                <div className="name">
                    {language.map((item, index) => {
                        return (
                            <div key={index}>
                                {i18next.language === item.code ? item.name : ""}
                            </div>
                        );
                    })}
                </div>
                <div className={`icon ${dropdown ? "rotate-icon" :""}`}>
                    <img src="./images/down.png" alt=""/>
                </div>
            </div>
        </div>

        {
            dropdown ? <div className="language-content">

                {language.map(({code, name, country_code}) => (
                    <div
                        key={country_code}
                        onClick={() => changeLanguage(code)}
                        className="menu-item"
                    >
                       <div className="circle">
                           {i18next.language === code ? <div className="circle-radio"></div> :""}
                       </div>
                        {name}
                    </div>
                ))}

            </div> : ""
        }

    </div>);
};

export default MapBoxMobile;
