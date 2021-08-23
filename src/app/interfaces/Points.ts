export class Points{
  points: number = 0;
  referedUserName?: string = ''; // user name of registered user if points by inivitation
  referedUserUid?: string = ''; // user id of registered user if points by inivitation
  taskId?: string = ''; // task id of completed task if points by task completion
  taskPlatform?: string = '';
  taskPlatformItem?: Array<''>;
  type: string = ''; // refer or task
  uid: string = ''; // user_id
  dateCreated?: number;
}
