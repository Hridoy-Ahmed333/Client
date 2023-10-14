import {createContext} from "react";
import {LandType} from "../types/land.type.ts";

let _land: LandType = {
    _id: "",
    district: "",
    division: "",
    isForSale: false,
    landImages: null,
    owner: '',
    owners: [],
    postOffice: "",
    price: 0,
    propertyId: "",
    state: "",
    status: false,
    token: "",
    village: ""
}

const modalContext = createContext({
    show: false, land: _land
})

export const ModalContextProvider = modalContext.Provider
export const ModalContextConsumer = modalContext.Consumer
