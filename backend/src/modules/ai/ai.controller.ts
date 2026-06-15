import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('diagnose')
  @UseInterceptors(FileInterceptor('image'))
  async diagnoseDisease(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required for AI diagnosis');
    }
    return this.aiService.diagnoseDisease(file.buffer, file.mimetype);
  }

  @Post('advice')
  async getFarmingAdvice(
    @Body('question') question: string,
    @Body('context') context?: any,
  ) {
    if (!question) {
      throw new BadRequestException('Question is required for AI advice');
    }
    const advice = await this.aiService.getFarmingAdvice(question, context);
    return { response: advice };
  }
}
