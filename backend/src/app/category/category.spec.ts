import { getMockedInstance } from '@warpy-be/utils';
import { CategoryService } from './category.service';
import { CategoryStore } from './category.store';

describe('CategoryService', () => {
  const store = getMockedInstance<CategoryStore>(CategoryStore);
  const service = new CategoryService(store as any);

  const categories = [1, 2, 3];

  store.getAll.mockResolvedValue(categories as any);

  it('fetches categories', async () => {
    expect(service.getAllCategories()).resolves.toStrictEqual(categories);
  });
});
