import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProductDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
