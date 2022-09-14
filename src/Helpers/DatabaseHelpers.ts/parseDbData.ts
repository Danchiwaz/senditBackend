import { IParcel } from "../../Interfaces/parcelInterface";

const parseDbData = (data: any, key: string) => {
  const array = data.rows[0][key];
  if (array) return array[0];
    return null;
};

export default parseDbData;


export const parseDataToRow = (data:any):IParcel => {
  return data.rows;
}


export const parseSendReceivedParcels = (data: any,key:string) => {
  const dataReturned = data.rows[0][key];
  if(dataReturned) return dataReturned;
  return null;
};


