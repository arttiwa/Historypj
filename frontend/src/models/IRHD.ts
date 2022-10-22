import { DevicesInterface } from "./IDevice";
import { RoomsInterface } from "./IRoom";
import { UsersInterface } from "./IUser";

export interface RHDsInterface {

    ID?: number,
    
    UserID?: number,
    DeviceID?: number,
    RoomID?: number,

    Device?: DevicesInterface;
    User?: UsersInterface;
    Room?: RoomsInterface;
}