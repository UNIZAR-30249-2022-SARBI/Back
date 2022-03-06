import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import {
    Transport
} from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
        urls: [
            'amqps://cvnjcdyw:RoDsoKA93AwQiJKg5WhC35FzeD20LQm9@roedeer.rmq.cloudamqp.com/cvnjcdyw'
        ],
        queue: 'gicuz',
            // false = manual acknowledgement; true = automatic acknowledgment
        noAck: false,
        prefetchCount: 1
    }
    });

    await app.listen();
}

bootstrap();
