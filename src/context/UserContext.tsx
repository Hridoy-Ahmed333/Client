import {createContext} from "react";
import {UserType} from "../types/user.type.ts";

let user: UserType = {emailID: "", name: "", nationalId: "", phone: "", publicId: ""}

const userContext = createContext({user: user})

export const UserContextProvider = userContext.Provider
export const UserContextConsumer = userContext.Consumer
