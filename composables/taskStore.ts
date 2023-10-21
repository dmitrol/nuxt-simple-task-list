import { defineStore } from "pinia";
import { ITask, ITaskTemplate } from "~/types";

export const useTaskStore = defineStore("task-store", {
  state: () => ({
    tasks: [] as ITask[],
  }),
  actions: {
    async getAll() {
      try {
        let data = await $fetch<ITask[]>("/api/tasks/");
        this.tasks = data;
        return data as ITask[];
      } catch (error) {
        throw createError({
          message: "unknown error",
        });
      }
    },
    async add(task: ITaskTemplate) {
      await $fetch("/api/tasks/add", {
        method: "POST",
        body: task,
      }).then(async () => {
        await this.getAll();
      });
    },
    async update(id: String, task: ITask) {
      await $fetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: task,
      }).then(async () => {
        await this.getAll();
      });
    },
    async remove(id: String) {
      await $fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      }).then(async () => {
        await this.getAll();
      });
    },
  },
});
