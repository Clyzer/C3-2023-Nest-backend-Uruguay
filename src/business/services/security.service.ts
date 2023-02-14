  import { Injectable, InternalServerErrorException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
  // Data transfer objects
  import { SignInDto, SignUpDto } from '../../business/dtos';
  // Entities
  import { AccountEntity, AccountTypeEntity, CustomerEntity, DocumentTypeEntity } from '../../data/persistence/entities';
  // Jwt
  import { JwtService } from '@nestjs/jwt';
  import { AccountRepository, AccountTypeRepository, CustomerRepository, DocumentTypeRepository, LoginResponseModel } from '../../data';
  
  @Injectable()
  export class SecurityService {

    private readonly customerRepository: CustomerRepository;
    private readonly documentTypeRepository: DocumentTypeRepository;
    private readonly accountRepository: AccountRepository;
    private readonly accountTypeRepository: AccountTypeRepository;
  
    constructor(private readonly jwtService: JwtService) {
      this.customerRepository = CustomerRepository.getInstance();
      this.documentTypeRepository = DocumentTypeRepository.getInstance();
      this.accountRepository = AccountRepository.getInstance();
      this.accountTypeRepository = AccountTypeRepository.getInstance();
    }

    //constructor(
    //  private readonly customerService: CustomerService,
    //  private readonly accountService: AccountService,
    //  private readonly jwtService: JwtService
    //) {}
  
    signIn(user: SignInDto): LoginResponseModel {
      //const answer = this.customerService.findOneByEmailAndPassword( user.email, user.password );
      const answer = this.customerRepository.findOneByEmailAndPassword( user.email, user.password );
      if (answer) {
        const token = this.jwtService.sign({ customer: answer }, { secret: "Sofka", expiresIn: "30d" });
        return { customer: answer, token: token };
      }
      else throw new UnauthorizedException();
    }

    signInGoogle(email: string): LoginResponseModel {
      //const answer = this.customerService.findOneByEmailAndPassword( user.email, user.password );
      const answer = this.customerRepository.findOneByEmail( email );
      if (answer) {
        const token = this.jwtService.sign({ customer: answer }, { secret: "Sofka", expiresIn: "30d" });
        return { customer: answer, token: token };
      }
      else throw new UnauthorizedException();
    }

    signUp(user: SignUpDto): LoginResponseModel {
      const documentType = new DocumentTypeEntity()
      documentType.name = user.documentTypeName;

      const newCustomer = new CustomerEntity();
      newCustomer.documentType = documentType;
      newCustomer.document = user.document;
      newCustomer.fullName = user.fullName;
      newCustomer.email = user.email;
      newCustomer.avatarUrl = user.avatarUrl;
      newCustomer.phone = user.phone;
      newCustomer.password = user.password;

      if (this.customerRepository.findOneByEmail(newCustomer.email) === undefined){

        this.documentTypeRepository.register(documentType);
        //this.customerService.getCustomerTypeRepo().register(documentType);
        const customer = this.customerRepository.register(newCustomer);
        //const customer = this.customerService.register(newCustomer);
        
        if (customer) {
          const accountType = new AccountTypeEntity();
          accountType.name = user.accountTypeName;
          this.accountTypeRepository.register(accountType);
          //this.accountService.getAccountTypeRepo().register(accountType);

          const newAccount = new AccountEntity();
          newAccount.accountType = accountType;
          newAccount.balance = user.balance || 0;
          newAccount.customer = customer;
        
          const account = this.accountRepository.register(newAccount);
          //const account = this.accountService.createAccount(newAccount);

          if (account) {
            const token = this.jwtService.sign({ customer: newCustomer }, { secret: "Sofka", expiresIn: "30d" });
            return { customer: newCustomer, token: token };
          } else throw new InternalServerErrorException();
        } else throw new InternalServerErrorException();
      } else throw new BadRequestException();
    }
  
    isValid(JWToken: string): string {
      try {
        const token = this.jwtService.verify(JWToken, { secret: "Sofka" });
        if (this.customerRepository.findOneById(token.customer.id)){
          return token;
        } else throw new NotFoundException();
      } catch {
        throw new InternalServerErrorException();
      }
    }

    //signOut(JWToken: string): string {
    //  try {
    //    const token = this.jwtService.verify(JWToken, { secret: "Sofka" });
    //    return token;
    //  } catch {
    //    return 'false';
    //  }
    //}
  }