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
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(@Query() filterTaskDto: FilterTaskDto): Task[] {
    // Case 1: The Filter defined, call tasksService.getTasksFilter
    if (Object.keys(filterTaskDto).length) {
      const tasks = this.tasksService.getTasksFilter(filterTaskDto);
      return tasks;
    }

    // Case 2: The Filter is not defined, call tasksService.getAllTasks
    const tasks = this.tasksService.getAllTasks();
    return tasks;
  }

  @Get(':taskId')
  getByTaskId(@Param('taskId') taskId: Task['id']): Task | null {
    const tasks = this.tasksService.getTaskByID(taskId);
    return tasks;
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task['id'] {
    const taskId = this.tasksService.createTask(createTaskDto);

    return taskId;
  }

  @Delete(':taskId')
  deleteTask(@Param('taskId') taskId: Task['id']) {
    const taskIdDeleted = this.tasksService.deleteTaskByID(taskId);

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
  updateTask(
    @Param('taskId') taskId: Task['id'],
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const taskUpdated = this.tasksService.updateTaskById(taskId, updateTaskDto);

    return taskUpdated;
  }
}
