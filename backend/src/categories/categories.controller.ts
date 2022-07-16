import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IGetCategoriesResponse } from '@warpy/lib';
import { NjsCategoryService } from './categories.service';

@Controller()
export class CategoriesController {
  constructor(private categoriesService: NjsCategoryService) {}

  @MessagePattern('categories.get')
  async onCategoriesRequest(): Promise<IGetCategoriesResponse> {
    const categories = await this.categoriesService.getAllCategories();

    return { categories };
  }
}
