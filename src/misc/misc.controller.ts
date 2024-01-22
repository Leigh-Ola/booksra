import {
  Controller,
  Post,
  Body,
  Ip,
  Get,
  Query,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { IsAdminUser } from '../users/users-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MiscService } from './misc.service';
import { ContactMessageDto, UpdateMessageDto } from './dto/misc-dto';
import { MessageTypesEnum } from '../utils/types';
import { Express } from 'express';

@Controller()
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Post('/contact-us')
  async getGenre(@Body() body: ContactMessageDto, @Ip() ip: string) {
    return this.miscService.sendEmail(ip, body);
  }

  @Post('/message')
  @UseGuards(IsAdminUser)
  async updateMessage(@Body() body: UpdateMessageDto) {
    return this.miscService.updateMessage(body);
  }

  @Get('/message')
  async getMessage(@Query('type') type: MessageTypesEnum) {
    return this.miscService.getMessage(type);
  }

  @Post('/upload-image')
  @UseGuards(IsAdminUser)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|heif|tiff|webp|bmp|tif|heic|svg)$/i,
        })
        .addMaxSizeValidator({
          // Checks if a given file's size is less than the provided value (measured in bytes)
          // max size should be 10mb
          maxSize: 20 * 1024 * 1024,
          message: 'Image must be less than 20mb',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.miscService.uploadImage(file);
  }
}
