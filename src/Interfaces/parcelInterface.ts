export interface IParcel {
  id?: string;
  sender: string;
  receiver: string;
  weight: string;
  price: number;
  fromlocation: Location;
  tolocation: Location;
  status?: string;
  trackingno: string;
  isdeleted?: string;
  pickdate: string;
  arrivaldate: string;
  sent?: boolean;
  received?: boolean;
  checker?: "no";
}
export interface Location {
  address: string;
  latitute?: number;
  longitude?: number;
}
