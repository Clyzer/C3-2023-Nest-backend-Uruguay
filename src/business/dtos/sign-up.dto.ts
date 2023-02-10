import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, Min, IsUrl } from 'class-validator';

export class SignUpDto {

    @ApiProperty()
    @IsString({ message: 'the document type name is not a string.' })
    documentTypeName: string;

    @ApiProperty()
    @IsString({ message: 'the account type name is not a string.' })
    accountTypeName: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber(undefined, { message: 'the balance must to be a number.' })
    @IsPositive()
    balance?: number;

    @ApiProperty()
    @IsNumber(undefined, { message: 'the document must to be a number.' })
    document: string;

    @ApiProperty()
    @IsString({ message: 'the full name is not a string.' })
    fullName: string;

    @ApiProperty()
    @IsEmail(undefined, { message: 'the data provider is not a valid email.' })
    email: string;

    @ApiProperty()
    @IsNumberString({ message: "phone must to be a number." })
    phone: string;

    @ApiProperty()
    @IsUrl(undefined, { message: 'avatarurl must to be a url' })
    @IsOptional()
    avatarUrl?: string;

    @ApiProperty()
    @IsString({ message: "password is not a string." })
    @Min(5)
    password: string;
    
}