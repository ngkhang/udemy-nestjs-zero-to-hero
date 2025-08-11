import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
