import {createContext} from "react";

const toastContext = createContext({
    show: false, msg: '', bg: ''
})

export const ToastContextProvider = toastContext.Provider
export const ToastContextConsumer = toastContext.Consumer
