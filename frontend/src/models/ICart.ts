import { UsersInterface } from "./IUser";
import { EstimateInterface } from "./IEstimate";
import {RequestsInterface } from "./IRequest";
import { HistorysInterface } from "./IHistory";

export interface CartsInterface {

    ID?: number;
    Start_Work?: Date | null;
    
    UserID?: number;
    User?: UsersInterface;

    EstimateID?: number;
    Estimate?: EstimateInterface;

    RequestID?: number;
    Request?: RequestsInterface;
   
    History?:HistorysInterface;         //ส่งข้อมูลไปhis

}