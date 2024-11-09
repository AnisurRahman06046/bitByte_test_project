import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRoles } from 'src/users/constants/user.constants';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  //   create product
  @Roles(UserRoles.ADMIN)
  @Post('create')
  async createProduct(@Body() payload: CreateProductDto) {
    const result = await this.productService.createProduct(payload);
    return {
      message: 'Product is created successfully',
      data: result,
    };
  }
}
