import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { NjsCategoryStore } from './categories.entity';
import { NjsCategoryService } from './categories.service';

@Module({
  imports: [PrismaModule],
  providers: [NjsCategoryService, NjsCategoryStore],
  controllers: [CategoriesController],
  exports: [NjsCategoryStore, NjsCategoryStore],
})
export class CategoryModule {}
