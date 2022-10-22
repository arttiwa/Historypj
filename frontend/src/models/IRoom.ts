import { BuildingsInterface } from "./IBuilding";

export interface RoomsInterface {

    ID?: number,
    Name?: string,
    Location?: string,
    BuildingID?: number,
    Building?: BuildingsInterface
}