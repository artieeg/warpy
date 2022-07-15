import { Injectable } from '@nestjs/common';
import { CategoryStore } from 'lib/stores';

@Injectable()
export class NjsCategoryStore extends CategoryStore {}
