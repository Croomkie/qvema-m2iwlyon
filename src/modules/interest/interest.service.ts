import { Injectable } from '@nestjs/common';
import { Interest } from './entities/interest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestRepo: Repository<Interest>,
  ) {}

  async getInterests(): Promise<Interest[] | null> {
    return await this.interestRepo.find();
  }

  async getRecommendation(userId: string) {
    //TODO: Implement recommendation logic based on user interests
  }
}
