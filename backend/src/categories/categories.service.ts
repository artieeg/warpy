import { Injectable } from '@nestjs/common';
import { CategoryService } from 'lib/services/category';

@Injectable()
export class NjsCategoryStore extends CategoryService {}
