import TaskModel from "~/server/models/Task.model";
import { TaskValidator } from "~/server/validation";

export default defineEventHandler(async (evenet) => {
  const id = getRouterParam(evenet, "id");
  const body = await readBody(evenet);

  const { error } = TaskValidator.validate(body, {
    abortEarly: true,
    allowUnknown: true,
  });
  if (error) {
    throw createError({
      message: error.message.replace(/"/g, ""),
      statusCode: 400,
      fatal: false,
    });
  }
  try {
    return await TaskModel.findByIdAndUpdate(id, body);
  } catch (error) {
    throw createError({
      message: "task not updated",
    });
  }
});
