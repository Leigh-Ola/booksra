import { Controller, Post, Body, Ip, Get, Query } from '@nestjs/common';
import { MiscService } from './misc.service';
import { ContactMessageDto, UpdateMessageDto } from './dto/misc-dto';
import { MessageTypesEnum } from '../utils/types';

@Controller()
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Post('/contact-us')
  async getGenre(@Body() body: ContactMessageDto, @Ip() ip: string) {
    return this.miscService.sendEmail(ip, body);
  }

  @Post('/message')
  async updateMessage(@Body() body: UpdateMessageDto) {
    return this.miscService.updateMessage(body);
  }

  @Get('/message')
  async getMessage(@Query('type') type: MessageTypesEnum) {
    return this.miscService.getMessage(type);
  }
}
