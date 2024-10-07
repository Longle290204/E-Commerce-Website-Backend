import {
  Controller,
  Query,
  Param,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  UseGuards,
  Logger,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { Task } from './task~entity';
import { GetFilterDto } from './dto/get~taskFilter';
import { CreateTaskDto } from './dto/create~task';
import { UpdateTaskStatusDto } from './dto/update~task';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { log } from 'console';

@Controller('tasks')
@UseGuards(AuthGuard(), RolesGuard)
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private taskService: TasksService) {}

  // @Get('admin')
  // @Roles(Role.Admin)
  // getAdminTask() {
  //   return;
  // }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating task. Data: ${JSON.stringify(createTaskDto)}`,
    );
    
    return this.taskService.createTask(createTaskDto, user);
  }

  // Khi ấn send, lập tức tạo ra một mảng bất kì đối tượng và được lưu vào cơ sở dữ liệu cùng lúc

  // http://localhost:3002/tasks/oiupqwerew?id=324324
  @Get('/:id')
  @Roles(Role.User)
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    // console.log(234);
    return this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  DeleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }
  // http://localhost:3002/tasks/1234?id=5678
  // http://localhost:3002/tasks?id=1234231432&search=04939087987

  @Get()
  getTaskWithFilters(
    @Query() filterDto: GetFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    console.log(123);
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filter: ${JSON.stringify(filterDto)}`,
    );
    return this.taskService.getTaskWithFilters(filterDto, user);
  }

  @Patch('/:id/status')
  UpdateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }
}
