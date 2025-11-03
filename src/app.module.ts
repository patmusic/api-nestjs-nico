import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { Env } from './env.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // para que ConfigService esté disponible en todo el proyecto
    }),
    TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService<Env>) => {
    // Usar únicamente variables declaradas en `Env` (POSTGRES_*)
    const host = configService.get('POSTGRES_HOST');
    const port = Number(configService.get('POSTGRES_PORT')) || 5432;
    const username = configService.get('POSTGRES_USER');
    const password = configService.get('POSTGRES_PASSWORD');
    const database = configService.get('POSTGRES_DB');

    console.log('TypeORM connecting to', host, port, database);

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      // Si necesitas SSL (por ejemplo Supabase), agrega una variable en Env
      // y cámbialo aquí; por ahora dejamos la configuración básica.
      autoLoadEntities: true,
      synchronize: true,
    };
  },
  inject: [ConfigService],
})
,
    UsersModule,
  ],
})
export class AppModule {}
