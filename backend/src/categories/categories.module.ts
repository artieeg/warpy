import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesEntity } from './categories.entity';
import { CategoriesService } from './categories.service';

@Module({
  imports: [PrismaModule],
  providers: [CategoriesEntity, CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesEntity, CategoriesService],
})
export class CategoryModule {}
