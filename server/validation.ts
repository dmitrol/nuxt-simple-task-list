import Joi from "joi";

export const TaskValidator = Joi.object({
  text: Joi.string().min(3).required(),
  completed: Joi.boolean().required(),
});
