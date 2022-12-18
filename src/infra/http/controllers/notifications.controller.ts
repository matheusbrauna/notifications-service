import { Body, Controller, Post } from '@nestjs/common';
import { SendNotificationUseCase } from '@application/use-cases/send-notification-use-case';
import { CreateNotificationInput } from '../dtos/create-notification-input';

@Controller('Notifications')
export class NotificationsController {
  constructor(private sendNotificationUseCase: SendNotificationUseCase) {}

  @Post()
  async create(@Body() body: CreateNotificationInput) {
    const { category, content, recipientId } = body;

    const { notification } = await this.sendNotificationUseCase.execute({
      category,
      content,
      recipientId,
    });

    return {
      notification,
    };
  }
}
