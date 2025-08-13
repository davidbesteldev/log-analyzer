import { ImportTypeEnum } from '@app/modules/logs/enums'

export interface IImportStrategy {
  getType(): ImportTypeEnum
  handle(file: Express.Multer.File): Promise<void>
}
