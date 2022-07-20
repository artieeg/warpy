import { ICategoryStore } from 'lib/stores';
import { IStreamCategory } from '@warpy/lib';

export interface ICategoryService {
  getAllCategories(): Promise<IStreamCategory[]>;
}

export class CategoryService implements ICategoryService {
  constructor(private categoryStore: ICategoryStore) {}

  async getAllCategories() {
    return this.categoryStore.getAll();
  }
}
