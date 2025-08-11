import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async getAllTasks(
    @Query() filterTaskDto: FilterTaskDto,
  ): Promise<Task[]> {
    const tasks = await this.tasksService.getAllTasks(filterTaskDto);
    return tasks;
  }

  @Get(':taskId')
  public async getByTaskId(@Param('taskId') taskId: Task['id']): Promise<Task> {
    const tasks = await this.tasksService.getTaskByID(taskId);
    return tasks;
  }

  @Post()
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task['id']> {
    const taskId = await this.tasksService.createTask(createTaskDto);

    return taskId;
  }

  @Delete(':taskId')
  public async deleteTask(@Param('taskId') taskId: Task['id']): Promise<void> {
    const taskIdDeleted = await this.tasksService.deleteTaskByID(taskId);

    return taskIdDeleted;
  }

  @Patch(':taskId/status')
  updateStatusTask(
    @Param('taskId') taskId: Task['id'],
    @Body('status') status: UpdateTaskDto['status'],
  ) {
    const taskUpdated = this.tasksService.updateTaskById(taskId, { status });

    return taskUpdated;
  }

  @Patch(':taskId')
  public async updateTask(
    @Param('taskId') taskId: Task['id'],
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const taskUpdated = await this.tasksService.updateTaskById(
      taskId,
      updateTaskDto,
    );

    return taskUpdated;
  }
}
