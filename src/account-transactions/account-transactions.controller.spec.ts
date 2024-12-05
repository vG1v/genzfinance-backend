import { Test, TestingModule } from '@nestjs/testing';
import { AccountTransactionsController } from './account-transactions.controller';

describe('AccountTransactionsController', () => {
  let controller: AccountTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountTransactionsController],
    }).compile();

    controller = module.get<AccountTransactionsController>(AccountTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
