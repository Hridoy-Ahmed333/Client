import './App.sass'
import {getConnectedAccount, getWeb3Service} from "./services/Web3Service.tsx";
import {useEffect, useState} from "react";
import {checkIsValidUser, getUserData} from "./services/AuthService.tsx";
import {RouterList} from "./routes/router.tsx";
import {RouterProvider} from "react-router-dom";
import {UserContextProvider} from "./context/UserContext.tsx";
import {UserType} from "./types/user.type.ts";

function App() {
    let _user: UserType = {
        balance: "",
        emailID: "",
        id: 0,
        name: "",
        nationalId: "",
        password: "",
        phone: "",
        publicId: ""
    }
    const [isConnected, setIsConnected] = useState(false);
    const [prgMsg, setPrgMsg] = useState('Connecting to Metamask...');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(_user);

    function handleLogout() {
        setIsLoggedIn(false)
        localStorage.setItem('isLoggedIn', "false")
        localStorage.setItem('isAdmin', 'false')
        localStorage.setItem("userId", '')
        // window.location.replace('login')
    }


    useEffect(() => {
        return () => {
            const ws = getWeb3Service();
            ws.getWeb3()
                .then(w => {
                    if (w === undefined) setPrgMsg('Install Metamask extension...')
                })
                .catch(err => {
                    console.log(err)
                    setPrgMsg('Open Ganache and connect to Metamask')
                })
            ws.getContract()
                .then(c => {
                    if (c != null) {
                        setIsConnected(true);
                        const userId = localStorage.getItem('userId')
                        getConnectedAccount()
                            .then(a => {
                                if (a != userId) {
                                    handleLogout()
                                } else {
                                    checkIsValidUser().then(r => {
                                        if (parseInt(r as string) === 0) {
                                            handleLogout()
                                        } else if (1 === parseInt(r as string)) {
                                            if (localStorage.getItem('isAdmin') !== 'true')
                                                handleLogout()
                                            else {
                                                setIsLoggedIn(localStorage.getItem('isLoggedIn') == 'true')
                                            }
                                        } else {
                                            setIsLoggedIn(localStorage.getItem('isLoggedIn') == 'true')
                                        }
                                        getUserData(a).then(r => {
                                            setUser(r.msg as UserType)
                                            localStorage.setItem('nationalId', (r.msg as UserType).nationalId)
                                        })
                                    })
                                }
                            })
                    } else {
                        setPrgMsg('Open Ganache and connect to Metamask')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            console.log('ue')
        };
    }, [isLoggedIn]);

    return (
        <>
            {isConnected
                ? <UserContextProvider value={{user: user}}><RouterProvider router={RouterList}/></UserContextProvider>
                : <div className="main-prg">{prgMsg}</div>
            }
        </>
    );
}

export default App;
