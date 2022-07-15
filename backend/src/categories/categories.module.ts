import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { NjsCategoryStore } from './categories.entity';
import { NjsCategoryStore } from './categories.service';

@Module({
  imports: [PrismaModule],
  providers: [NjsCategoryStore, NjsCategoryStore],
  controllers: [CategoriesController],
  exports: [NjsCategoryStore, NjsCategoryStore],
})
export class CategoryModule {}
