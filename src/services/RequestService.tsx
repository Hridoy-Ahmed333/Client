import {ResponseType} from "../types/response.type.ts";
import axios from "axios";
import {API} from "./API.tsx";
import {RequestType} from "../types/request.type.ts";
import {UserType} from "../types/user.type.ts";
import {getWeb3Service} from "./Web3Service.tsx";

const ws = getWeb3Service()
export const getAllMyRequests = (): Promise<ResponseType> => {
    return new Promise<ResponseType>((resolve, reject) => {
        axios.get(API + 'request/')
            .then(r => {
                resolve({
                    status: true,
                    msg: r.data.data.filter((v: RequestType) => (v.user as UserType)?.publicId === localStorage.getItem('userId'))
                })
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const getPendingRequests = (): Promise<ResponseType> => {
    return new Promise<ResponseType>((res, rej) => {
        axios.get(API + 'request/pending/' + localStorage.getItem('userId'))
            .then(r => {
                console.log(r)
                res({
                    status: true,
                    msg: r.data.data
                })
            })
            .catch(err => {
                rej(err)
            })
    });
}
export const getAllRequestsAdmin = (): Promise<ResponseType> => {
    return new Promise<ResponseType>((res, rej) => {
        axios.get(API + 'request/')
            .then(r => {
                res({
                    status: true,
                    msg: r.data.data
                })
            })
            .catch(err => {
                rej(err)
            })
    });
}

export const getLandOwners = (land: string): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
        ws.getLandContract(land).then(c => {
            c.methods.getLandData().call().then((r: any) => {
                console.log(r)
                resolve({status: true, msg: r.owners as string[]})
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    })
}

export const updateRequest = (id: string | undefined, status: number): Promise<ResponseType> => {
    return new Promise<ResponseType>((res, rej) => {
        axios.put(API + 'request', {id: id, status: status})
            .then(r => {
                res({status: true, msg: r.data})
            })
            .catch(err => {
                rej(err)
            })
    });
}

export const deleteRequest = (rId: string) => {
    return axios.delete(API + 'request/' + rId)
}
