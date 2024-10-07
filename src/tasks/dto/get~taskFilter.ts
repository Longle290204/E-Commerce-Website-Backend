import { IsEnum, IsString, IsOptional } from 'class-validator';
import { TaskStatus } from '../task~status.enum';
import { TasksService } from '../tasks.service';

export class GetFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
