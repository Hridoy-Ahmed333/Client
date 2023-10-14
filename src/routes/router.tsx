import {createBrowserRouter} from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import {LandPage} from "../pages/LandPage/LandPage.tsx";
import LandListPage from "../pages/LandListPage/LandListPage.tsx";
import RequestPage from "../pages/RequestPage/RequestPage.tsx";
import LoginPage from "../pages/AuthPage/LoginPage.tsx";
import {UserDataPage} from "../pages/UserDataPage/UserDataPage.tsx";

export const RouterList = createBrowserRouter([
        {
            path: "", element: <HomePage/>, children: [
                {path: "lands", element: <LandListPage isAdmin={false}/>},
                {path: "all-lands", element: <LandListPage isAdmin={true}/>},
                {path: "pending-requests", element: <RequestPage isAdmin={true}/>},
                {path: "my-lands", element: <LandListPage isAdmin={false}/>},
                {path: "requests", element: <RequestPage/>},
                {path: 'user-data', element: <UserDataPage/>}
            ]
        },
        {path: 'login', element: <LoginPage/>},
        {
            path: "/land/:id", element: <LandPage/>
        }
    ])
;
