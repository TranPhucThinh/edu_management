import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetTeacherId } from 'src/common/decorators/get-user.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('stats')
  getStats(@GetTeacherId() teacherId: string) {
    return this.dashboardService.getStats(teacherId);
  }
}
