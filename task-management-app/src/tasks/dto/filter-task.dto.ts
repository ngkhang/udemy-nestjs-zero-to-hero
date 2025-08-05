import { TaskStatus } from '../task.model';

export class FilterTaskDto {
  status?: TaskStatus;
  search?: string;
}
