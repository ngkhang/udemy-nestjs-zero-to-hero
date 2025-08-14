import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  public async getAllTasks(
    userId: User['id'],
    filterTaskDto: FilterTaskDto,
  ): Promise<Task[]> {
    const tasks = await this.taskRepository.getAllTasks(userId, filterTaskDto);
    return tasks;
  }

  public async getTaskByID(taskId: Task['id'], user: User): Promise<Task> {
    const taskExist = await this.taskRepository.findOne({
      where: {
        id: taskId,
        user,
      },
    });

    if (!taskExist)
      throw new NotFoundException(`Task with id ${taskId} not found`);
    return taskExist;
  }

  public async createTask(
    userId: User['id'],
    createTaskDto: CreateTaskDto,
  ): Promise<string> {
    const taskId = await this.taskRepository.createTask(userId, createTaskDto);

    return taskId;
  }

  public async deleteTaskByID(
    taskId: Task['id'],
    userId: User['id'],
  ): Promise<void> {
    // Approach 1: Using .remove()
    // const taskExist = await this.getTaskByID(taskId);
    // const taskRemoved = await this.taskRepository.remove(taskExist);

    // Approach 2: Using .delete()
    const taskRemoved = await this.taskRepository.delete({
      id: taskId,
      user: {
        id: userId,
      },
    });

    if (!taskRemoved.affected) {
      throw new BadRequestException(`Task is ${taskId} not found`);
    }
  }

  public async updateTaskById(
    taskId: Task['id'],
    updateTask: Partial<Task>,
    user: User,
  ): Promise<Task> {
    const taskExist = await this.getTaskByID(taskId, user);

    const updateTaskExist = {
      ...taskExist,
      ...updateTask,
    };

    await this.taskRepository.update(taskId, updateTaskExist);
    return updateTaskExist;
  }
}
