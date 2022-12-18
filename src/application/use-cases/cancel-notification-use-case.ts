import { NotificationsRepository } from '@application/repositories/notifications-repository';
import { Injectable } from '@nestjs/common';
import { NotificationNotFoundError } from './errors/notification-not-found-error';

interface CancelNotificationRequest {
  notificationId: string;
}

type CancelNotificationResponse = void;

@Injectable()
export class CancelNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(
    request: CancelNotificationRequest,
  ): Promise<CancelNotificationResponse> {
    const { notificationId } = request;

    const notification = await this.notificationsRepository.findById(
      notificationId,
    );

    if (!notification) {
      throw new NotificationNotFoundError();
    }

    notification.cancel();

    await this.notificationsRepository.save(notification);
  }
}
