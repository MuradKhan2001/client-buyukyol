import "./style.scss"
import {useState} from "react";

const History = () => {
    const [activeTab, setActiveTab] = useState("")
    const tabs = [
        {
            id: 1,
            name: "Kutilayotgan"
        },
        {
            id: 2,
            name: "Faol"
        },
        {
            id: 3,
            name: "Bajarilgan"
        },
        {
            id: 4,
            name: "Bekor qilingan"
        }
    ]

    return <div className="history-container">
        <div className="title">
            Buyurtmalar tarixi
        </div>
        <div className="header">
            {
                tabs.map((item, index) => {
                    return <div onClick={() => setActiveTab(prevState => prevState = item.id)} key={index}
                                className={`tab-btn ${activeTab === item.id ? "tab-active" : ""} `}>
                        {item.name}
                    </div>
                })
            }
        </div>
        <div className="orders-box">
            <div className="order">
                <div className="top-side">
                    <div className="date">
                        14. 11. 2023 - 15:00
                    </div>
                    <div className="btn-badge">
                        Kutilmoqda
                    </div>
                </div>

                <div className="bottom-side">
                    <div className="photo">
                        <img src="./images/car.png" alt=""/>
                    </div>
                    <div className="content">
                        <div className="title">
                            Toshkent- Samarqand
                        </div>
                        <div className="text">
                            <img src="./images/location.png" alt=""/>
                            <div className="info">
                                <div className="label">Masofa:</div>
                                <div className="content">1 1111 km</div>
                            </div>
                        </div>
                        <div className="text">
                            <img src="./images/price.png" alt=""/>
                            <div className="info">
                                <div className="label">Narxi</div>
                                <div className="content">600 dolor</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
}

export default History