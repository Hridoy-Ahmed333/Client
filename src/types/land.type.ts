import {UserType} from "./user.type.ts";

export interface LandType {
    _id?: string;
    token: string;
    owner: string | UserType;
    propertyId: string;
    division: string;
    district: string;
    state: string;
    landImages: string[] | FileList | null;
    owners?: string[]
    village: string
    postOffice: string
    status?: boolean
    price?: number;
    isForSale?: boolean
}
