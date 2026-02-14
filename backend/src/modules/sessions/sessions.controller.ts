import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  // API xem lịch sử: GET /sessions?classId=...
  @Get()
  findAll(@Query('classId') classId: string) {
    return this.sessionsService.findByClass(classId);
  }

  // API chi tiết buổi: GET /sessions/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }
}
