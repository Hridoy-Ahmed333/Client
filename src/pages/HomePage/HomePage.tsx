import {useEffect, useState} from "react";
import "./home-page.sass";
import {Header} from "../../components/Header.tsx";
import {SellLandModal} from "../../components/SellLandModal.tsx";
import {LandType} from "../../types/land.type.ts";
import {requestAddLand, updateLand} from "../../services/LandService.tsx";
import {Modal} from "bootstrap";
import {Link, Outlet, useNavigate, useOutletContext} from "react-router-dom";
import {getConnectedAccount} from "../../services/Web3Service.tsx";
import {UserContextConsumer} from "../../context/UserContext.tsx";
import {changeUserPassword} from "../../services/AuthService.tsx";
import {ToastComponent} from "../../components/Toast.tsx";
import {ToastContextProvider} from "../../context/ToastContext.tsx";

interface OutletContextType {
    search: SearchQueryType,
    setEditModal: any,
    setSelectedLand: any,
    setToast: any
}

interface ToastType {
    toastMsg: string;
    toastBg: string;
    showToast: boolean;
}

export default function HomePage() {
    const land: LandType = {
        postOffice: "Edarikode",
        village: "Perumanna",
        district: "Malappuram",
        division: "Tirur",
        landImages: [],
        owner: "",
        propertyId: "property 1",
        state: "Kerala",
        token: "",
    };

    const _searchQuery: SearchQueryType = {param: "", type: ""}

    let _toast: ToastType = {
        showToast: false, toastBg: "", toastMsg: ""
    }

    const nav = useNavigate()

    const [sellModal, setSellModal] = useState<Modal | null>(null);
    const [changePwdModal, setChangePwdModal] = useState<Modal | null>();
    const [landData, setLandData] = useState<LandType>(land);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState(_searchQuery);
    const [newPassword, setNewPassword] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastBg, setToastBg] = useState('');
    const [editModal, setEditModal] = useState<boolean>(false)
    const [selectedLand, setSelectedLand] = useState<LandType>(land)
    const [toast, setToast] = useState<ToastType>(_toast)
    const outlet: OutletContextType = {
        search: searchQuery, setEditModal: setEditModal, setSelectedLand: setSelectedLand, setToast: setToast
    }
    const [outletContext, setOutletContext] = useState<OutletContextType>(outlet)
    // const [editMode, setEditMode] = useState(false)
    const handleOnSellLand = () => {
        if (!sellModal) {
            const modal = new Modal("#sellModal");
            setSellModal(modal);
            modal?.show();
        } else sellModal?.show();
    };

    const handleShowChangePwdModal = () => {
        if (!changePwdModal) {
            const modal = new Modal('#changePwdModal')
            setChangePwdModal(modal)
            modal.show()
        } else
            changePwdModal.show()
    }

    const handleOnSaveSellLand = () => {
        const data: FormData = new FormData()

        console.log(landData)

        Object.keys(landData)
            .forEach(l => {
                if (l != 'images') {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    data.append(l, landData[l])
                }
            })

        for (const img of landData.landImages as FileList) {
            // console.log(img)
            data.append('images', img)
        }
        data.append('nationalId', localStorage.getItem('nationalId') as string)
        if (landData.token.length <= 1) {
            requestAddLand(data)
                .then(r => {
                    // console.log(r)
                    if (r.status) {
                        console.log(r)
                    }
                    setShowToast(true)
                    setToastBg(r.status ? 'success' : 'danger')
                    setToastMsg(r.msg as string)

                    setTimeout(() => {
                        setShowToast(false)
                    }, 3000)
                    // loadData()
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            updateLand(data).then(r => {
                // console.log(r)
                if (r.status) {
                    console.log(r)
                    setSearchQuery({type: '', param: ''})
                }
                setShowToast(true)
                setToastBg(r.status ? 'success' : 'danger')
                setToastMsg(r.msg as string)
                setTimeout(() => {
                    setShowToast(false)
                }, 3000)
                // loadData()
            }).catch(err => {
                console.log(err)
            })
        }
        console.log(data.get('token'))
        sellModal?.hide();
    };

    function handleChangePassword() {
        changePwdModal?.hide()
        changeUserPassword(newPassword).then(r => {
            console.log(r)
            setShowToast(true)
            setToastBg('success')
            setToastMsg(r.msg as string)
            setInterval(() => {
                setShowToast(false)
            }, 2000)
        }).catch(err => {
            console.log(err)
            setShowToast(true)
            setToastBg('danger')
            setToastMsg("Failed changing password")
            setInterval(() => {
                setShowToast(false)
            }, 2000)
        })
    }

    function checkIsLoggedIn() {
        const userId = localStorage.getItem('userId')
        getConnectedAccount()
            .then(a => {
                if (a != userId) {
                    handleLogout()
                } else {
                    setIsAdmin(localStorage.getItem('isAdmin') == 'true')
                    localStorage.getItem('isAdmin') == 'true' ?
                        nav('/all-lands')
                        : nav('/lands')
                }
            })
    }

    useEffect(() => {
        checkIsLoggedIn()
        // loadData()
    }, []);


    function handleLogout() {
        // setIsLoggedIn(false)
        setIsAdmin(false)
        localStorage.setItem('isLoggedIn', "false")
        localStorage.setItem('isAdmin', 'false')
        localStorage.setItem("userId", '')
        localStorage.setItem("username", "")
        nav('/login')
    }

    useEffect(() => {
        if (editModal)
            handleOnSellLand()
        setLandData(selectedLand)
        console.log(selectedLand)
    }, [selectedLand]);

    useEffect(() => {
        console.log(searchQuery)
        setOutletContext({...outletContext, search: searchQuery})
    }, [searchQuery]);

    useEffect(() => {
        setShowToast(toast.showToast)
        setToastMsg(toast.toastMsg)
        setToastBg(toast.toastBg)
    }, [toast]);

    return (
        <ToastContextProvider value={{show: showToast, bg: toastBg, msg: toastMsg}}>
            <div className="home-page container-fluid p-0 m-0">
                <div className="container p-0 m-0">
                    <UserContextConsumer>
                        {({user}) => (
                            <Header setSearchQuery={setSearchQuery} changePwd={handleShowChangePwdModal}
                                    isAdmin={isAdmin}
                                    user={user}
                                    onLogOut={handleLogout}
                                    onSellLand={handleOnSellLand}/>)}
                    </UserContextConsumer>
                    <ToastComponent/>
                    <div className="land-container">
                        <div className="land-cards">
                            <ul
                                className="land-nav nav nav-pills mx-3 my-3 px-5 py-2"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <Link to={isAdmin ? '/all-lands' : '/lands'}>
                                        <button
                                            className="nav-link active"
                                            id="pills-home-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-home"
                                            type="button"
                                            role="tab"
                                            aria-controls="pills-home"
                                            aria-selected="true"
                                        >
                                            All Lands
                                        </button>
                                    </Link>

                                </li>
                                <li className="nav-item" role="presentation">
                                    <Link to={isAdmin ? 'pending-requests' : 'requests'}>
                                        <button
                                            className="nav-link"
                                            id="pills-contact-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-contact"
                                            type="button"
                                            role="tab"
                                            aria-controls="pills-contact"
                                            aria-selected="false"
                                        >
                                            {isAdmin
                                                ? <>Pending Requests</>
                                                : <>My Requests</>}
                                        </button>
                                    </Link>
                                </li>
                                {isAdmin ? <li className="nav-item" role="presentation">
                                    <Link to='/user-data'>
                                        <button
                                            className="nav-link"
                                            id="pills-home-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-home"
                                            type="button"
                                            role="tab"
                                            aria-controls="pills-home"
                                            aria-selected="true"
                                        >
                                            Users
                                        </button>
                                    </Link>
                                </li> : null}
                            </ul>
                            <div className="tab-content d-flex justify-content-center text-white h-100 w-100"
                                 id="pills-tabContent">
                                <Outlet context={outletContext}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="modal fade"
                    id="sellModal"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex={-1}
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <SellLandModal
                            landData={landData}
                            setLandData={setLandData}
                            onClick={() => handleOnSaveSellLand()}
                            closeModal={() => sellModal?.hide()}
                        />
                    </div>
                </div>

                <UserContextConsumer>
                    {({user}) => (
                        <div className="modal fade" id="changePwdModal" data-bs-backdrop="static"
                             data-bs-keyboard="false"
                             tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Change Password</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control text-bg-dark" id="floatingInput"
                                                   placeholder="User Id" value={user.publicId} disabled/>
                                            <label htmlFor="floatingInput">User Public Id</label>
                                        </div>
                                        <div className="form-floating">
                                            <input type="password" className="form-control text-bg-dark"
                                                   id="floatingPassword"
                                                   placeholder="Password" value={newPassword}
                                                   onChange={(ev) => setNewPassword(ev.target.value)}/>
                                            <label htmlFor="floatingPassword">Password</label>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-success ff-poppins"
                                                onClick={handleChangePassword}>Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                </UserContextConsumer>
            </div>
        </ToastContextProvider>
    );
}


export function useCustomOutletContext() {
    return useOutletContext<OutletContextType>()
}
