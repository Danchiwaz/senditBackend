import joi from "joi";

export const ParcelSavingSchema = joi.object({
  sender: joi.string().required(),
  receiver: joi.string().required(),
  price: joi.string().required().email(),
  fromlocation: joi.string().required(),
  tolocation: joi.string().required(),
  trackingno: joi.string().required(),
  pickdate: joi.string().required(),
  arrivaldate: joi.string().required(),
});
