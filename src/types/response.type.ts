import { LandType } from "./land.type.ts";
import { UserType } from "./user.type.ts";
import { RequestType } from "./request.type.ts";
import { MasterDataType } from "./master-data.type.ts";

export interface ResponseType {
    status: boolean;
    msg: string | LandType[] | UserType[] | UserType | LandType | RequestType | RequestType[] | string[] | MasterDataType[] | MasterDataType;
}
