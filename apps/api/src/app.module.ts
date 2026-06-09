import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BudgetsModule } from './budgets/budgets.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import typeormConfig from './config/typeorm.config';
import { ExpensesModule } from './expenses/expenses.module';
import { MembersModule } from './members/members.module';
import { SettlementsModule } from './settlements/settlements.module';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow('database'),
      }),
    }),
    UsersModule,
    AuthModule,
    TripsModule,
    MembersModule,
    ExpensesModule,
    BudgetsModule,
    SettlementsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
