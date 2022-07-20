import { IStreamCategory } from '@warpy/lib';
import { ICategoryStore } from './category.store';

export interface ICategoryService {
  getAllCategories(): Promise<IStreamCategory[]>;
}

export class CategoryService implements ICategoryService {
  constructor(private categoryStore: ICategoryStore) {}

  async getAllCategories() {
    return this.categoryStore.getAll();
  }
}
