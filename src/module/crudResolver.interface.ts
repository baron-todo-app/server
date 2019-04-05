import { ISoftDelete } from 'app.interface';

export { ICRUDResolver, ICRUDService };

interface ICRUDResolver<T> {
  getTask: (p: any) => Promise<T> | T;
  getTasks: (p: any) => Promise<T[]> | T[];
  addTask: (p: any) => Promise<T> | T;
  updateTask: (p: any) => Promise<T> | T;
  deleteTask: (p: any) => Promise<T> | T;
}

interface ICRUDService<T, U> {
  findOneTask: (p: any) => Promise<T> | T;
  findTasks: (p: any) => Promise<T[]> | T[];
  addTask: (p: any) => Promise<T> | T;
  updateTask: (p: U, p2: any) => Promise<T> | T;
  softDeleteTask: (p: U, p2: ISoftDelete) => Promise<T> | T;
}
