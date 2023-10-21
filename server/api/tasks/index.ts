import TaskModel from "@/server/models/Task.model"

export default defineEventHandler( async(event) => {
    return await TaskModel.find()
})