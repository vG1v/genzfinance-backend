import { Test, TestingModule } from '@nestjs/testing';
import { AccountTransactionsService } from './account-transactions.service';

describe('AccountTransactionsService', () => {
  let service: AccountTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountTransactionsService],
    }).compile();

    service = module.get<AccountTransactionsService>(AccountTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
