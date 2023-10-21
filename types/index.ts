export interface ITask extends ITaskTemplate {
  _id: String;
}

export interface ITaskTemplate {
  text: String;
  completed: Boolean;
}
