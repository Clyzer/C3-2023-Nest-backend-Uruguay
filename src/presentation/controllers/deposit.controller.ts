import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountService, DepositService } from '../../business/services';
import { CreateDepositDto, HistoryDto, PaginationDto } from '../../business/dtos';
import { DepositEntity } from '../../data/persistence';

@ApiTags('deposit')
@Controller('api/deposit')
export class DepositController {

    constructor(private readonly depositService: DepositService, private readonly accountService: AccountService) {}

    @Post('/create-deposit')
    createDeposit(@Body() deposit: CreateDepositDto) {
        const newDeposit = new DepositEntity();
        newDeposit.account = this.accountService.getAccountById(deposit.accountId);
        newDeposit.amount = deposit.balance;
        newDeposit.dateTime = deposit.dateTime || Date.now(); 
        return this.depositService.createDeposit(newDeposit);
    }
    
    @Post('/delete-deposit')
    deleteDeposit(@Query('deposit') deposit: string): string {
        return this.depositService.deleteDeposit(deposit).toString();
    }
    
    @Post('/get-history')
    getHistory(@Body() account: string, pagination?: PaginationDto, dataRange?: HistoryDto): string {
        return this.depositService.getHistory(account, pagination, dataRange).toString();
    }

}
