import { Injectable } from '@nestjs/common';

@Injectable()
export class BannerService {
  create(createBannerDto: any) {
    return 'This action adds a new banner';
  }

  findAll() {
    return `This action returns all banner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: any) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
