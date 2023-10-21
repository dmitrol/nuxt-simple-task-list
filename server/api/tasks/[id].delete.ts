import TaskModel from "~/server/models/Task.model";

export default defineEventHandler(async (evenet) => {
  const id = getRouterParam(evenet, "id");

  try {
    return await TaskModel.findByIdAndDelete(id);
  } catch (error) {
    throw createError({
      message: "task not deleted",
    });
  }
});
