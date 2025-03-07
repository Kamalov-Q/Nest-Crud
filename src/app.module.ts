import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://kamalovquvomiddin:kamalov@nestcrud.hddsy.mongodb.net/?retryWrites=true&w=majority&appName=NestCrud"),
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
