import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GifService } from 'lib';

@Injectable()
export class NjsGifService extends GifService {
  constructor(configService: ConfigService) {
    super(configService.get<string>('tenorAPIKey'));
  }
}
