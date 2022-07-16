import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryService, CategoryStore } from 'lib';
import { PrismaModule } from '.';
import { IGetCategoriesResponse } from '@warpy/lib';

@Injectable()
export class NjsCategoryStore extends CategoryStore {}

@Injectable()
export class NjsCategoryService extends CategoryService {}

@Controller()
export class CategoriesController {
  constructor(private categoriesService: NjsCategoryService) {}

  @MessagePattern('categories.get')
  async onCategoriesRequest(): Promise<IGetCategoriesResponse> {
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
