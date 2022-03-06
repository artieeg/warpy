import { Injectable } from '@nestjs/common';
import { CategoriesEntity } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(private categoriesEntity: CategoriesEntity) {}

  async getAllCategories() {
    return this.categoriesEntity.getAll();
  }
}
