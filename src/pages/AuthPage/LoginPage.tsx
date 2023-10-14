import {Component} from 'react';
import Login from "../../components/Login.tsx";
import {UserType} from "../../types/user.type.ts";
import {LoginType} from "../../types/login.type.ts";
import {registerUser, userLogin} from "../../services/AuthService.tsx";

interface StateType {
    authStatus: string;
    isLoggedIn: boolean;
    isProgress: boolean;
    prgMsg: string;
    isSpinner: boolean;
    isWarn: boolean;
    isSuccess: boolean;
}

class LoginPage extends Component<NonNullable<unknown>, StateType> {

    constructor(props: NonNullable<unknown>) {
        super(props);
        this.state = {
            isLoggedIn: false,
            authStatus: '',
            isProgress: false,
            prgMsg: 'Authenticating...',
            isSpinner: true,
            isWarn: false,
            isSuccess: false
        }
    }

    handleLogin = (data: LoginType) => {
        this.setState({isSpinner: true, isProgress: true, prgMsg: 'Authenticating user..'})
        userLogin(data)
            .then(r => {
                console.log(r)
                if (r.status) {
                    this.setState({isSpinner: false, isSuccess: true, prgMsg: 'successfully logged in'})
                    this.setState({authStatus: r.msg as string})
                    if (r.msg === 'admin') {
                        localStorage.setItem('isAdmin', 'true')
                        localStorage.setItem('username', 'admin')
                        window.location.replace('/all-lands')
                        return
                    } else {
                        localStorage.setItem('username', (r.msg as UserType)?.name?.split(' ')[1] || 'user')
                    }
                    this.setState({isLoggedIn: true});
                    window.location.replace('/lands')
                } else {
                    console.log(r.msg)
                    this.setState({isWarn: true, isSuccess: false, isSpinner: false, prgMsg: r.msg as string})
                    this.resetProgress()
                }
            })
    };

    resetProgress() {
        setTimeout(() => {
            this.setState({
                isWarn: false,
                isSuccess: false,
                isSpinner: true,
                prgMsg: 'Loading...',
                isProgress: false
            })
        }, 2000)
    }

    handleNewUserRegistration = (data: UserType) => {
        this.setState({isSpinner: true, isProgress: true, prgMsg: 'Registering user'})
        console.log(data)

        let formData: FormData = new FormData()

        Object.keys(data).forEach((k) => {
            if (k != 'nationalIdCard')
                // @ts-ignore
                formData.append(k, data[k])
        })
        for (const img of data.nationalIdCard as FileList) {
            formData.append('nationalIdCard', img)
        }
        registerUser(formData)
            .then(r => {
                console.log(r)
                localStorage.setItem('username', data.name || 'user')
                this.setState({authStatus: r.msg as string})
                this.setState({isLoggedIn: true});
                window.location.replace('/lands')
                // loadData()
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    isWarn: true,
                    prgMsg: err.message || 'Registration failed !!!',
                    isSpinner: false,
                    isSuccess: false
                })
                this.resetProgress()
            })
    }

    render() {
        return (
            <div>
                <div className="w-full h-[100vh] max-h-full flex flex-col justify-center items-center bg-gray-800">
                    <div className="login-container w-fit h-fit bg-inherit">
                        <Login msg={this.state.authStatus}
                               onRegister={(u: UserType) => this.handleNewUserRegistration(u)}
                               onLogin={(login: LoginType) => this.handleLogin(login)}/>
                    </div>

                    {this.state.isProgress ? <div
                        className="progress border border-gray-300 p-2 w-fit px-5 shadow-lg shadow-zinc-500 md:px-10 mt-5 h-fit bg-gray-800 flex flex-row items-center justify-around space-x-5">

                        {this.state.isSpinner ? <div className="spinner-border text-amber-500" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div> : this.state.isWarn ? <span className="text-2xl">⚠️</span> : this.state.isSuccess ?
                            <span className=" text-2xl">✅</span> : null}
                        <span
                            className="text-base font-[Poppins] font-light text-zinc-300">{this.state.prgMsg}</span>
                    </div> : null}

                </div>
            </div>
        );
    }
}

export default LoginPage;
