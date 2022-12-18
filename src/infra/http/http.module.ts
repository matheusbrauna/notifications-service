import { Module } from '@nestjs/common';
import { SendNotificationUseCase } from '@application/use-cases/send-notification-use-case';
import { DatabaseModule } from '@infra/database/database.module';
import { NotificationsController } from './controllers/notifications.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [SendNotificationUseCase],
})
export class HttpModule {}
