export interface IParcel{
    id?:string;
    sender:string;
    receiver: string;
    weight:string;
    price: number;
    fromlocation:string;
    toloaction:string;
    status?:string;
    trackingno:string;
    isdeleted?:string;
}