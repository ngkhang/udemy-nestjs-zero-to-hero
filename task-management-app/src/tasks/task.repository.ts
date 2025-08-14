import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status';
import { FilterTaskDto } from './dto/filter-task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  public async getAllTasks(
    userId: User['id'],
    filterTaskDto: FilterTaskDto,
  ): Promise<Task[]> {
    const { search, status } = filterTaskDto;

    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId });

    if (status) {
      query.where('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  public async createTask(
    userId: User['id'],
    createTaskDto: CreateTaskDto,
  ): Promise<Task['id']> {
    const newTask = this.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user: {
        id: userId,
      },
    });

    const result = await this.save(newTask);
    return result.id;
  }
}
