import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SendNotificationUseCase } from '@application/use-cases/send-notification-use-case';
import { CreateNotificationInput } from '../dtos/create-notification-input';
import { NotificationViewModel } from '../view-models/notification-view-model';
import { CancelNotificationUseCase } from '@application/use-cases/cancel-notification-use-case';
import { ReadNotificationUseCase } from '@application/use-cases/read-notification-use-case';
import { UnreadNotificationUseCase } from '@application/use-cases/unread-notification-use-case';
import { GetRecipientNotificationsUseCase } from '@application/use-cases/get-recipient-notifications-use-case';
import { CountRecipientNotificationsUseCase } from '@application/use-cases/count-recipient-notifications-use-case';

@Controller('Notifications')
export class NotificationsController {
  constructor(
    private sendNotificationUseCase: SendNotificationUseCase,
    private cancelNotificationUseCase: CancelNotificationUseCase,
    private readNotificationUseCase: ReadNotificationUseCase,
    private unreadNotificationUseCase: UnreadNotificationUseCase,
    private getRecipientNotificationsUseCase: GetRecipientNotificationsUseCase,
    private countRecipientNotificationsUseCase: CountRecipientNotificationsUseCase,
  ) {}

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    await this.cancelNotificationUseCase.execute({
      notificationId: id,
    });
  }

  @Get('count/from/:recipientId')
  async countFromRecipient(@Param('recipientId') recipientId: string) {
    const { count } = await this.countRecipientNotificationsUseCase.execute({
      recipientId,
    });

    return {
      count,
    };
  }

  @Get('from/:recipientId')
  async getFromRecipient(@Param('recipientId') recipientId: string) {
    const { notifications } =
      await this.getRecipientNotificationsUseCase.execute({
        recipientId,
      });

    return {
      notifications: notifications.map(NotificationViewModel.toHTTP),
    };
  }

  @Patch(':id/read')
  async read(@Param('id') id: string) {
    await this.readNotificationUseCase.execute({
      notificationId: id,
    });
  }

  @Patch(':id/unread')
  async unread(@Param('id') id: string) {
    await this.unreadNotificationUseCase.execute({
      notificationId: id,
    });
  }

  @Post()
  async create(@Body() body: CreateNotificationInput) {
    const { category, content, recipientId } = body;

    const { notification } = await this.sendNotificationUseCase.execute({
      category,
      content,
      recipientId,
    });

    return {
      notification: NotificationViewModel.toHTTP(notification),
    };
  }
}
