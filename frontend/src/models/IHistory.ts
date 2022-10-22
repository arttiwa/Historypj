import { CartsInterface } from "./ICart";
import { DMGlevelsInterface } from "./IDMGlevel";
import { UsersInterface } from "./IUser";

export interface HistorysInterface {

    ID?: number;

    Cause?:      string;
	Solution?:   string;
	Price?:      number;
	CartID?:     number;
	UserID?:     number;
	DMGLevelID?: number;
	Cart?:       CartsInterface     
	User?:       UsersInterface     
	DMGLevel?:   DMGlevelsInterface


}