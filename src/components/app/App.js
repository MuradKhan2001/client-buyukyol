import React, {useMemo} from "react";
import {Routes, Route} from "react-router-dom";
import NotFound from "../notFound/NotFound";
import {userRoutes, loginRoutes} from "../../routes/Routes";

const App = () => {

    const user = useMemo(() => localStorage.getItem('token'), []);
    const routes = useMemo(() => {
        if (user) return userRoutes;
        return loginRoutes
    }, [user]);

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