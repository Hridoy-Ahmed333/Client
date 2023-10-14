export interface UserType {
    id?: number;
    name: string;
    emailID: string;
    phone: string | null;
    publicId: string;
    nationalId: string;
    password?: string;
    balance?: string
    nationalIdCard?: string | File | FileList | null
    isActive?: boolean
}
