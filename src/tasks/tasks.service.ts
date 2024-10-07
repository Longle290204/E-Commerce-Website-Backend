import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './task~entity';
import { GetFilterDto } from './dto/get~taskFilter';
import { CreateTaskDto } from './dto/create~task';
import { TaskStatus } from './task~status.enum';
import { DataSource } from 'typeorm';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });
  private taskRepository = this.dataSource.getRepository(Task);

  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    {
      process.env.STAGE === 'dev'
        ? console.log(configService.get('TEST_VALUE'))
        : console.log(configService.get('TEST_VALUE_PRODUCTION'));
    }
    console.log(process.env.STAGE);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    console.log(task);
    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    console.log('ID:', id);
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async getTaskWithFilters(
    filterDto: GetFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.andWhere({ user });

    if (status) {
      query.andWhere('LOWER(task.status) = LOWER(:status)', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks user "${user.username}". Filter ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
