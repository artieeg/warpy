import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { NjsCategoryStore } from './categories.entity';
import { CategoriesService } from './categories.service';

@Module({
  imports: [PrismaModule],
  providers: [NjsCategoryStore, CategoriesService],
  controllers: [CategoriesController],
  exports: [NjsCategoryStore, CategoriesService],
})
export class CategoryModule {}
