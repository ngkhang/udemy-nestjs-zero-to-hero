import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  private task: Task[] = [
    {
      id: 'c7f2d1c0-060b-4643-a31a-e040a5c61996',
      title: 'Task 1',
      description: 'Must Completed',
      status: TaskStatus.OPEN,
    },
  ];

  public getAllTasks(): Task[] {
    return this.task;
  }

  public getTasksFilter(filterTaskDto: FilterTaskDto): Task[] {
    const { search, status } = filterTaskDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  public getTaskByID(taskId: Task['id']): Task {
    const taskExist = this.task.find((task) => task.id === taskId);

    if (!taskExist)
      throw new NotFoundException(`Task with id ${taskId} not found`);
    return taskExist;
  }

  public createTask(createTaskDto: CreateTaskDto): Task['id'] {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.task.push(task);

    return task.id;
  }

  public deleteTaskByID(taskId: Task['id']): Task['id'] | null {
    const taskExist = this.getTaskByID(taskId);

    const newTasks = this.task.filter((task) => task.id !== taskExist.id);

    this.task = newTasks;

    return taskId;
  }

  public updateTaskById(
    taskId: Task['id'],
    updateTask: Partial<Task>,
  ): Task | string {
    const taskExist = this.getTaskByID(taskId);

    const updateTaskExist = { ...taskExist, ...updateTask };

    this.task = this.task.map((task) => {
      if (task.id === taskId) return { ...task, ...updateTaskExist };

      return task;
    });

    return updateTaskExist;
  }
}
