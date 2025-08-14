import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async getAllTasks(
    @Query() filterTaskDto: FilterTaskDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    const tasks = await this.tasksService.getAllTasks(user.id, filterTaskDto);
    return tasks;
  }

  @Get(':taskId')
  public async getByTaskId(
    @Param('taskId') taskId: Task['id'],
    @GetUser() user: User,
  ): Promise<Task> {
    const tasks = await this.tasksService.getTaskByID(taskId, user);
    return tasks;
  }

  @Post()
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task['id']> {
    const taskId = await this.tasksService.createTask(user.id, createTaskDto);

    return taskId;
  }

  @Delete(':taskId')
  public async deleteTask(
    @Param('taskId') taskId: Task['id'],
    @GetUser() user: User,
  ): Promise<void> {
    const taskIdDeleted = await this.tasksService.deleteTaskByID(
      taskId,
      user.id,
    );

    return taskIdDeleted;
  }

  @Patch(':taskId/status')
  updateStatusTask(
    @Param('taskId') taskId: Task['id'],
    @Body('status') status: UpdateTaskDto['status'],
    @GetUser() user: User,
  ) {
    const taskUpdated = this.tasksService.updateTaskById(
      taskId,
      { status },
      user,
    );

    return taskUpdated;
  }

  @Patch(':taskId')
  public async updateTask(
    @Param('taskId') taskId: Task['id'],
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const taskUpdated = await this.tasksService.updateTaskById(
      taskId,
      updateTaskDto,
      user,
    );

    return taskUpdated;
  }
}
