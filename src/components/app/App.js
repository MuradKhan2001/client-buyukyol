import React, {useMemo, useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import NotFound from "../notFound/NotFound";
import {userRoutes, loginRoutes} from "../../routes/Routes";

 const APIkey  = 'd533e8cbcd0a40faae8b03124b3829e7'

const App = () => {
    const user = useMemo(() => localStorage.getItem('token'), []);
    const routes = useMemo(() => {
        if (user) return userRoutes;
        return loginRoutes
    }, [user]);
    const [location, setLocation] = useState();
    function getLocationInfo(latitude, longitude) {

        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${APIkey}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.status.code === 200) {
                    console.log("results:", data.results);
                    setLocation(data.results[0].formatted);
                } else {
                    console.log("Reverse geolocation request failed.");
                }
            })
            .catch((error) => console.error(error));
    }

    function success(pos) {
        var crd = pos.coords;
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        getLocationInfo(crd.latitude, crd.longitude);
    }
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    console.log(result);
                    if (result.state === "granted") {
                        //If granted then you can directly call your function here
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "prompt") {
                        //If prompt then the user will be asked to give permission
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "denied") {
                        //If denied then you have to show instructions to enable location
                    }
                });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    return <>
        <Routes>
            {
                routes.map((route, index) => (
                    <Route key={index} {...route} />
                ))
            }
            <Route path={'*'} element={<NotFound/>}/>
        </Routes>
    </>
};

export default App;