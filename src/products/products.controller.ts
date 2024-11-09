import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRoles } from 'src/users/constants/user.constants';
import { Public } from 'src/auth/public.route';
import { UpdateProductDto } from './dtos/update-product.dto';
import { DeleteProductDto } from './dtos/delete-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  //   create product
  @Roles(UserRoles.ADMIN)
  @Post()
  async createProduct(@Body() payload: CreateProductDto) {
    const result = await this.productService.createProduct(payload);
    return {
      message: 'Product is created successfully',
      data: result,
    };
  }

  //   fetch all products
  @Public()
  @Get()
  async fetchProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
    @Query('sortByPrice') sortByPrice?: 'asc' | 'desc',
    @Query('sortByCreatedAt') sortByCreatedAt?: 'asc' | 'desc',
  ) {
    // Ensure page and limit are integers
    const pageInt = parseInt(page.toString(), 10);
    const limitInt = parseInt(limit.toString(), 10);

    const result = await this.productService.fetchProducts({
      page: pageInt,
      limit: limitInt,
      category,
      sortByPrice,
      sortByCreatedAt,
    });
    return {
      message: 'All products are fetched',
      data: result,
    };
  }

  //   fetch single product
  @Public()
  @Get(':id')
  async fetchProduct(@Param('id') id: number) {
    const result = await this.productService.fetchProduct(+id);
    return {
      message: `Product of ${id} id is fetched`,
      data: result,
    };
  }

  //   update a product
  @Patch('')
  async updateProduct(@Body() payload: UpdateProductDto) {
    const result = await this.productService.updateProduct(payload);
    return {
      message: 'Product is updated',
      data: result,
    };
  }

  //   delete a product ; here it is soft delete
  @Roles(UserRoles.ADMIN)
  @Delete('')
  async deleteProduct(@Body() payload: DeleteProductDto) {
    const { id } = payload;
    const result = await this.productService.deleteProduct(+id);
    return {
      message: 'Product is deleted',
      data: result,
    };
  }
}
