import TaskModel from "@/server/models/Task.model";
import { TaskValidator } from "~/server/validation";

export default defineEventHandler(async (event) => {

  const body = await readBody(event);

  const { error } = TaskValidator.validate(body);
  if (error) {
    throw createError({
      message: error.message.replace(/"/g, ""),
      statusCode: 400,
      fatal: false,
    });
  }

  try {
    await TaskModel.create(body);
    return { message: "Task added" };
  } catch (error) {
    throw createError({
      message: "task not added",
    });
  }
});
