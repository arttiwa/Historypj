import { HistorysInterface } from "./IHistory";
import { RolesInterface } from "./IRole";
export interface UsersInterface {

    ID?: number,
    Name?: string;
    Email?: string;
    Phone_number?: string;
    Password?: string;

    PositionID?: string;
    RoleID?: string;
    Role?: RolesInterface;
    GenderID?: string;
    History?:HistorysInterface;         //ส่งข้อมูลไปhis
}