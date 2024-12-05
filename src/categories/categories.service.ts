import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  findAll() {
    return [
      { id: 1, name: 'Food' },
      { id: 2, name: 'Transportation' },
    ];
  }
}
