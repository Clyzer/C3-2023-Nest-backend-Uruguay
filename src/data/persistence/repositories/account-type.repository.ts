import { Injectable, NotFoundException } from '@nestjs/common';

import { GeneralCRUD } from './base';
import { AccountTypeEntity } from '../entities';
import { IAccountTypeRepository, IDisableable } from './interfaces';
import { PaginationModel } from '../../models';

@Injectable()
export class AccountTypeRepository extends GeneralCRUD<AccountTypeEntity> implements IAccountTypeRepository, IDisableable<AccountTypeEntity> {

  public static instance: AccountTypeRepository;

  public static getInstance(): AccountTypeRepository {
    if (!AccountTypeRepository.instance) {
      AccountTypeRepository.instance = new AccountTypeRepository();
    }
    return AccountTypeRepository.instance;
  }

  register(entity: AccountTypeEntity): AccountTypeEntity {
    this.database.push(entity);
    return this.database.at(-1) ?? entity;
  }

  update(id: string, entity: AccountTypeEntity): AccountTypeEntity {
    const indexCurrentEntity = this.database.findIndex(
        (item) => item.id == id,
    );
    if (indexCurrentEntity >= 0)
      this.database[indexCurrentEntity] = {
        ...this.database[indexCurrentEntity],
        ...entity,
        id,
      } as AccountTypeEntity;
    else throw new NotFoundException();
    return this.database[indexCurrentEntity];
  }

  delete(id: string, soft?: boolean | undefined): void {
    let finded = this.database.findIndex(
      (item) => 
        item.id == id
    );
    if (finded == undefined) throw new NotFoundException();
    this.database.splice(finded, 1);
  }

  findAll(paginator?: PaginationModel): AccountTypeEntity[] {
    let finded = this.database;
    if (finded == undefined) throw new NotFoundException();
    return finded.slice(paginator?.offset, paginator?.limit);
  }

  findOneById(id: string): AccountTypeEntity {
    let finded = this.database.find( (item) => item.id == id );
    if (finded == undefined) throw new NotFoundException();
    return finded;
  }

  findByState(state: boolean): AccountTypeEntity[] {
    let finded = this.database.filter( (item) => item.state == state );
    if (finded == undefined) throw new NotFoundException();
    return finded;
  }

  findByName(name: string): AccountTypeEntity {
    let finded = this.database.find( (item) => item.name == name );
    if (finded == undefined) throw new NotFoundException();
    return finded;
  }
}