import { IUser } from "./auth.schema";

export interface IRegisterData{
    email: string
    password: string
    name:string
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IAuthResponse{
    message: string
    token: string
    user:{
        id:string
        name:string
        email:string
        role?:string
    }
}

export interface IAuthResquest extends Request{
    user?:IUser
}

export interface IApiError {
  error: string;
  status?: number;
}

export interface IJwtPayload {
  id: string;
  role: string;
  name?: string;
  tokenVersion: number;
}