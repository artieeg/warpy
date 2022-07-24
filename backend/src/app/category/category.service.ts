import { CategoryStore } from './category.store';

export class CategoryService {
  constructor(private categoryStore: CategoryStore) {}

  async getAllCategories() {
    return this.categoryStore.getAll();
  }
}
