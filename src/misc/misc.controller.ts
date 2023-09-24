import { Controller, Post, Body, Ip } from '@nestjs/common';
import { MiscService } from './misc.service';
import { ContactMessageDto } from './dto/misc-dto';

@Controller()
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Post('/contact-us')
  async getGenre(@Body() body: ContactMessageDto, @Ip() ip: string) {
    return this.miscService.sendEmail(ip, body);
  }
}
