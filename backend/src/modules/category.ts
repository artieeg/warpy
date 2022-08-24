import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryService, CategoryStore } from '@warpy-be/app';
import { PrismaModule } from './prisma';
import { GetCategoriesResponse } from '@warpy/lib';
import { PrismaService } from './prisma';

@Injectable()
export class NjsCategoryStore extends CategoryStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsCategoryService extends CategoryService {
  constructor(categoryStore: NjsCategoryStore) {
    super(categoryStore);
  }
}

@Controller()
export class CategoriesController {
  constructor(private categoriesService: NjsCategoryService) {}

  @MessagePattern('categories.get')
  async onCategoriesRequest(): Promise<GetCategoriesResponse> {
    const categories = await this.categoriesService.getAllCategories();

    return { categories };
  }
}

@Module({
  imports: [PrismaModule],
  providers: [NjsCategoryService, NjsCategoryStore],
  controllers: [CategoriesController],
  exports: [NjsCategoryStore, NjsCategoryStore],
})
export class CategoryModule {}
