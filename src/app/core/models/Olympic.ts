import {Participation} from "./Participation";

export interface Olympic {
  id : number;
  country : string;
  participations : Array<Participation>;
  totalMedalsCount? : number;
  totalAthleteCount? : number;
  color? : string;
}
