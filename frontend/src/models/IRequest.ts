import { UsersInterface } from "./IUser";
import { JobTypesInterface } from "./IJobType";
import { RHDsInterface } from "./IRHD";
import { HistorysInterface } from "./IHistory";

export interface RequestsInterface {

    ID?: number;
    Date_Start?: Date | null;
    Explain?: string;
    
    UserID?: number;
    User?: UsersInterface;

    JobTypeID?: number;
    JobType?: JobTypesInterface;

    Room_has_Device_ID?: number;
    RHD?: RHDsInterface;

    History?:HistorysInterface;         //ส่งข้อมูลไปhis
   
}