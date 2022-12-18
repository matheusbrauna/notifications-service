import { Content } from '@application/entities/content';
import { Notification } from '@application/entities/notification';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';
import { CancelNotificationUseCase } from './cancel-notification-use-case';
import { NotificationNotFoundError } from './errors/notification-not-found-error';

describe('Cancel notification', () => {
  it('Should be able cancel a notification', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();
    const cancelNotificationUseCase = new CancelNotificationUseCase(
      notificationsRepository,
    );

    const notification = new Notification({
      content: new Content('Nova solicitação de amizade'),
      category: 'social',
      recipientId: 'example-recipient-id',
    });

    await notificationsRepository.create(notification);

    await cancelNotificationUseCase.execute({
      notificationId: notification.id,
    });

    expect(notificationsRepository.notifications[0].canceledAt).toEqual(
      expect.any(Date),
    );
  });

  it('Should not be able to cancel a non existing notification', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();
    const cancelNotificationUseCase = new CancelNotificationUseCase(
      notificationsRepository,
    );

    expect(() =>
      cancelNotificationUseCase.execute({
        notificationId: 'fake-notification-id',
      }),
    ).rejects.toThrow(NotificationNotFoundError);
  });
});
