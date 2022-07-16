import { Injectable } from '@nestjs/common';
import { CategoryService } from 'lib/services/category';

@Injectable()
export class NjsCategoryService extends CategoryService {}
