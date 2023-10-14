import {LandType} from "./land.type.ts";
import {UserType} from "./user.type.ts";

export interface RequestType {
    _id?: string;
    user: UserType | string;
    land: LandType;
    date: string;
    status: 0 | 1 | 2 | 3 | 4;
    type: number;
    approver?: string,
    biddingPrice?: string
}
