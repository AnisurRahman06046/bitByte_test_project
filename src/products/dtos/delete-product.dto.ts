import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteProductDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
