import { CustomerModel } from ".";

export interface LoginResponseModel {
    customer: CustomerModel;
    token: string;
}
