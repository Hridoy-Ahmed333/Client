import React, {ChangeEvent, useEffect, useState} from "react";
import {LoginType} from "../types/login.type.ts";
import {getWeb3Service} from "../services/Web3Service.tsx";
import {UserType} from "../types/user.type.ts";
import {sendVerificationOTP} from "../services/AuthService.tsx";

interface LoginProps {
    onLogin: (login: LoginType) => void;
    onRegister: (register: UserType) => void
    msg: string
}

export default function Login(props: LoginProps) {
    const login: LoginType = {username: "", password: ""};
    const user: UserType = {
        emailID: "", name: "", nationalId: "", phone: '', publicId: "", nationalIdCard: ''

    }
    const [loginData, setLoginData] = useState(login);
    const [isRegister, setIsRegister] = useState(false);
    const [userData, setUserData] = useState(user);
    const [errMsg, setErrMsg] = useState('')

    const [isVerified, setIsVerified] = useState(false)
    const [otp, setOtp] = useState('')
    const [isOTPSent, setIsOTPSent] = useState(false)
    const [OTPReceived, setOTPReceived] = useState('')
    const setUserPwd = (ev: ChangeEvent<HTMLInputElement>) => {
        setLoginData({...loginData, password: ev.target.value})
        setUserData({...userData, password: ev.target.value})
    }

    const handleOnSubmit = (ev: React.MouseEvent<HTMLButtonElement>, i: number) => {
        ev.preventDefault()

        if (i) {
            if (userData.emailID == '') {
                setErrMsg('Enter valid email')
                return
            }
            if (userData.name == '') {
                setErrMsg('Enter valid name')
                return
            }
            if (userData.nationalId == '') {
                setErrMsg('Enter valid nationalId')
                return
            }
            if (userData.phone == '') {
                setErrMsg('Enter valid phone')
                return
            }
            if (userData.password == '') {
                setErrMsg('Enter valid password')
                return
            }
            if (userData.nationalIdCard == '') {
                setErrMsg('Upload your national Id card image')
                return
            }
            props.onRegister(userData)
        } else {
            if (loginData.password == '') {
                setErrMsg('Enter valid password')
                return
            }
            props.onLogin(loginData)
        }

    }

    useEffect(() => {
        getWeb3Service()
            .getCurrentAccount()
            .then((a: string) => {
                setLoginData({...loginData, username: a})
                setUserData({...userData, publicId: a})
            })
    }, [])

    const handleOnIdCardSelected = (ev: React.ChangeEvent<HTMLInputElement>) => {
        console.log((ev.target as HTMLInputElement).files?.[0])
        setUserData({...userData, nationalIdCard: (ev.target as HTMLInputElement).files})
    };

    function handleSendOTP() {
        if (userData.nationalId.length >= 1) {
            sendVerificationOTP(userData.nationalId).then(r => {
                console.log(r)
                if (r.data.status === 'success') {
                    setOTPReceived(r.data.otp as string)
                    setIsOTPSent(true)
                } else {
                    setErrMsg(r.data.msg)
                }
            }).catch(err => {
                console.log(err)
                setErrMsg(err.message)
            })
        }
    }

    function handleVerifyOTP() {
        if (Number(otp) === Number(OTPReceived)) {
            setIsVerified(true)
            setErrMsg('OTP Verified')
        } else {
            setErrMsg('Invalid OTP')
        }
    }

    return (
        <div className="login card p-3">
            <div className="h3 mt-3 mx-2">
                {isRegister
                    ?
                    <>REGISTER</>
                    : <>LOGIN</>}
            </div>
            <form>
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                required
                                value={loginData.username}
                                disabled
                            />
                            <label htmlFor="floatingInput">Users public Id</label>
                        </div>
                    </div>
                    {isRegister
                        ? <>
                            <div className="col-12 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="Users fullname"
                                        required
                                        value={userData.name}
                                        onChange={(ev) => setUserData({...userData, name: ev.target.value})}
                                    />
                                    <label htmlFor="floatingPassword">Full name</label>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="National ID"
                                        required
                                        value={userData.nationalId}
                                        onChange={(ev) => setUserData({...userData, nationalId: ev.target.value})}
                                    />
                                    <label htmlFor="floatingPassword">National Id</label>
                                </div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="Password"
                                        value={userData.emailID}
                                        required
                                        onChange={(ev) => setUserData({...userData, emailID: ev.target.value})}
                                    />
                                    <label htmlFor="floatingPassword">Email ID</label>
                                </div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="Phone"
                                        value={userData.phone || ''}
                                        required
                                        onChange={(ev) => setUserData({...userData, phone: ev.target.value})}
                                    />
                                    <label htmlFor="floatingPassword">Phone Number</label>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div>
                                    <label htmlFor="id-card" className="font-light text-sm ff-poppins">Select National
                                        Id card</label>
                                    <input id="id-card" type="file" className="form-control"
                                           onChange={(event) => handleOnIdCardSelected(event)}/>
                                </div>
                            </div>
                            <div className="col-12 mb-3 flex flex-row items-center">
                                <div className="form-floating flex-1">
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="OTP"
                                        value={otp}
                                        required
                                        onChange={(ev) => setOtp(ev.target.value)}
                                    />
                                    <label htmlFor="floatingPassword">OTP</label>
                                </div>
                                <button
                                    className="btn btn-sm btn-primary ms-3 py-2 px-3 h-fit bg-blue-600 hover:bg-white hover:text-blue-700"
                                    type="button"
                                    disabled={!isOTPSent}
                                    onClick={handleVerifyOTP}>
                                    Verify OTP
                                </button>
                                <button
                                    className="btn btn-sm btn-success py-2 px-3 ms-3 h-fit bg-green-600 hover:bg-white hover:text-green-700"
                                    type="button"
                                    disabled={isOTPSent}
                                    onClick={() => handleSendOTP()}>
                                    Send OTP
                                </button>

                            </div>
                        </>
                        : null}

                    <div className="col-12">
                        <div className="form-floating">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                autoComplete="password"
                                placeholder="Password"
                                required
                                value={loginData.password}
                                onChange={(ev) => setUserPwd(ev)}
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                    </div>
                    <div className="col-12 py-2">
                        <div className="text-danger text-center small-text ff-poppins">
                            {errMsg}
                            {/*{props.msg}*/}
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-end">
                        {isRegister
                            ?
                            <button type="submit"
                                    className={`px-3 py-2.5 rounded-xl text-sm ${isVerified ? ' shadow text-zinc-50 bg-black hover:!bg-white ' +
                                        'hover:!text-black hover:shadow-amber-400' : 'bg-gray-300 text-zinc-500'}`}
                                    onClick={(event) => handleOnSubmit(event, 1)}
                                    disabled={!isVerified}>
                                Register
                            </button>
                            : <button type="submit"
                                      className="px-3 py-2.5 rounded-xl shadow text-sm bg-black text-zinc-50 hover:!bg-white hover:!text-black hover:shadow-amber-400"
                                      onClick={(event) => handleOnSubmit(event, 0)}>Login
                            </button>}

                    </div>
                    <div className="col-12">
                    <span className="small-text text-danger">
                        {!isRegister
                            ? <>Don't have an account </>
                            : <>Already have an account</>}
                        <button type="button" className="btn btn-link p-1 small-text fw-bold text-decoration-none"
                                onClick={() => setIsRegister(!isRegister)}>
                           {!isRegister
                               ? <> Register here</>
                               : <>Login</>}
                        </button>
                    </span>
                    </div>
                </div>
            </form>

        </div>
    );
}
