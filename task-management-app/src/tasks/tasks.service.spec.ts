import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { User } from '../auth/user.entity';
import { Task } from './task.entity';
import { TaskStatus } from './task-status';
import { NotFoundException } from '@nestjs/common';

const mockGetAllTasks = jest.fn();
const mockFindOne = jest.fn();

const mockTasksRepository = () => ({
  getAllTasks: mockGetAllTasks,
  findOne: mockFindOne,
});

const mockUser: User = {
  id: 'someId',
  username: 'User01',
  password: '12345',
  tasks: [],
};

const mockTask: Task = {
  id: 'task-id',
  title: 'task-title',
  description: 'task-description',
  status: TaskStatus.OPEN,
  user: mockUser,
};

describe('TasksService', () => {
  let tasksService: TasksService;

  beforeEach(async () => {
    mockGetAllTasks.mockReset();
    mockFindOne.mockReset();

    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
  });

  describe('getAllTasks', () => {
    it('should get all tasks from the repository', async () => {
      expect(mockGetAllTasks).not.toHaveBeenCalled();
      mockGetAllTasks.mockResolvedValue('value');
      const result = await tasksService.getAllTasks(mockUser.id, {});
      expect(mockGetAllTasks).toHaveBeenCalled();
      expect(result).toEqual('value');
    });
  });

  describe('getTaskByID', () => {
    it('should get task by id from the repository and returns the result', async () => {
      mockFindOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskByID(mockTask.id, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error as task is not found', async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(
        tasksService.getTaskByID(mockTask.id, mockUser),
      ).rejects.toThrow(
        new NotFoundException(`Task with id ${mockTask.id} not found`),
      );
    });
  });
});
