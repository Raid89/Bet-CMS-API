import { IsString, IsBoolean, IsOptional, IsDate } from 'class-validator';

export class CreateApplicationDto {
    @IsString()
    @IsOptional()
    name!: string;

    @IsString()
    @IsOptional()
    path!: string;

    @IsString()
    version!: string;

    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @IsDate()
    @IsOptional()
    date?: Date;
}

export class UpdateApplicationDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    path?: string;

    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @IsDate()
    @IsOptional()
    date?: Date;
}
