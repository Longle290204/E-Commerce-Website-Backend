import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task~status.enum';
import { DataSource } from 'typeorm';
import { User } from '../auth/user.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Task } from './task~entity';

describe('TasksService', () => {
  let tasksService: TasksService;
  // let dataSource;
  let configService: ConfigService;
  let taskRepository: jest.Mocked<Repository<Task>>;
  let dataSource;

  // Mock DataSource
  const mockDataSource = () => ({
    getRepository: jest.fn().mockReturnThis(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    andWhere: jest.fn(),
    getMany: jest.fn(),
    delete: jest.fn(),
  });

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'TEST_VALUE':
          return 'test_value';
        case 'TEST_VALUE_PRODUCTION':
          return 'test_value_production';
        default:
          return null;
      }
    }),
  };

  const mockUser: User = {
    username: 'Ariel',
    id: 'someId',
    phoneNumber: 'somePhoneNumber',
    password: 'somePassword',
    tasks: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: DataSource, useFactory: mockDataSource },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    // Khởi tạo module test và compile() nó thành công thì bạn có thể sử dụng module.get<Type>(provider) để lấy ra instance của nó và
    // sử dụng

    tasksService = module.get<TasksService>(TasksService);
    // VD: tasksService là một instance của TasksService --> Sử dụng bằng cách tasksService.getTaskById()
    dataSource = module.get<DataSource>(DataSource);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getTaskById', () => {
    it('calls getRepository.findOne and returns the task', async () => {
      const mockTask = { title: 'Test task' };
      dataSource.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
      expect(dataSource.findOne).toHaveBeenCalledWith({
        where: { id: 'someId', user: mockUser },
      });
    });

    it('throws a NotFoundException if task is not found', () => {
      dataSource.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('creates and saves a task successfully', async () => {
      const createTaskDto = { title: 'Test task', description: 'Test desc' };
      dataSource.create.mockReturnValue('someTask');
      dataSource.save.mockResolvedValue('someTask');

      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(result).toEqual('someTask');
      expect(dataSource.create).toHaveBeenCalledWith({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: TaskStatus.OPEN,
        user: mockUser,
      });
      expect(dataSource.save).toHaveBeenCalledWith('someTask');
    });
  });

  describe('deleteTask', () => {
    it('successfully deletes the task', async () => {
      dataSource.delete.mockResolvedValue({ affected: 1 });

      await tasksService.deleteTask('someId', mockUser);
      expect(dataSource.delete).toHaveBeenCalledWith({
        id: 'someId',
        user: mockUser,
      });
    });

    it('throws a NotFoundException when task is not found', () => {
      dataSource.delete.mockResolvedValue({ affected: 0 });

      expect(tasksService.deleteTask('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
