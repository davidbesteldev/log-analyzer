import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiOperation } from '@nestjs/swagger'

import { ImportDTO } from '@app/modules/logs/dto'

import { LogService } from './log.service'

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Importar dados de um arquivo' })
  import(@Body() body: ImportDTO, @UploadedFile() file: Express.Multer.File) {
    return this.logService.uploadFile(file, body)
  }
}
