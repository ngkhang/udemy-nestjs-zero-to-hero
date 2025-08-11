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

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  public async getAllTasks(filterTaskDto: FilterTaskDto): Promise<Task[]> {
    const tasks = await this.taskRepository.getAllTasks(filterTaskDto);
    return tasks;
  }

  public async getTaskByID(taskId: Task['id']): Promise<Task> {
    const taskExist = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
    });

    if (!taskExist)
      throw new NotFoundException(`Task with id ${taskId} not found`);
    return taskExist;
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<string> {
    const taskId = await this.taskRepository.createTask(createTaskDto);

    return taskId;
  }

  public async deleteTaskByID(taskId: Task['id']): Promise<void> {
    // const taskExist = await this.getTaskByID(taskId);

    // Approach 1: Using .remove()
    // const taskRemoved = await this.taskRepository.remove(taskExist);

    // Approach 2: Using .delete()
    const taskRemoved = await this.taskRepository.delete(taskId);

    if (!taskRemoved.affected) {
      throw new BadRequestException(`Task is ${taskId} not found`);
    }
  }

  public async updateTaskById(
    taskId: Task['id'],
    updateTask: Partial<Task>,
  ): Promise<Task> {
    const taskExist = await this.getTaskByID(taskId);

    const updateTaskExist = {
      ...taskExist,
      ...updateTask,
    };

    await this.taskRepository.update(taskId, updateTaskExist);
    return updateTaskExist;
  }
}
