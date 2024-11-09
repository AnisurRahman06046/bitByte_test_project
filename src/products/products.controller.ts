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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  //   create product
  @Roles(UserRoles.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new product. Only admin access' })
  @ApiBody({
    schema: {
      example: {
        name: 'Product Name',
        description: 'Product description goes here.',
        price: 99.99,
        category: 'Electronics',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product is created successfully',
    schema: {
      example: {
        id: 5,
        name: 'Lenovo HE05X',
        description: null,
        price: 50000,
        category: 'Accessories',
        status: 1,
        createdAt: '2024-11-09T08:24:56.606Z',
        updatedAt: '2024-11-09T08:24:56.606Z',
      },
    },
  })
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
  @ApiOperation({ summary: 'Fetch all products. Only admin access' })
  @ApiResponse({
    status: 200,
    description: 'All products are fetched successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'All products are fetched',
        data: {
          data: [
            {
              id: 4,
              name: 'Mac mini m2',
              description: 'this is the updated data',
              price: 50000,
              category: 'Computers',
              status: 1,
              createdAt: '2024-11-09T08:21:14.413Z',
              updatedAt: '2024-11-09T09:43:26.812Z',
            },
          ],
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
        timestamp: '2024-11-09T09:43:52.362Z',
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit number of products per page',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'sortByPrice',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    description: 'Sort products by price',
  })
  @ApiQuery({
    name: 'sortByCreatedAt',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    description: 'Sort products by creation date',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search products by name or description',
  })
  async fetchProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
    @Query('sortByPrice') sortByPrice?: 'asc' | 'desc',
    @Query('sortByCreatedAt') sortByCreatedAt?: 'asc' | 'desc',
    @Query('search') search?: string,
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
      search,
    });
    return {
      message: 'All products are fetched',
      data: result,
    };
  }

  //   fetch single product
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single product by ID.Public route' })
  @ApiResponse({
    status: 200,
    description: 'Product is fetched successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Product of 4 id is fetched',
        data: {
          id: 4,
          name: 'Mac mini m2',
          description: 'this is the updated data',
          price: 50000,
          category: 'Computers',
          status: 1,
          createdAt: '2024-11-09T08:21:14.413Z',
          updatedAt: '2024-11-09T09:43:26.812Z',
        },
        timestamp: '2024-11-09T09:43:38.691Z',
      },
    },
  })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  async fetchProduct(@Param('id') id: number) {
    const result = await this.productService.fetchProduct(+id);
    return {
      message: `Product of ${id} id is fetched`,
      data: result,
    };
  }

  //   update a product
  @Patch('')
  @ApiBody({
    schema: {
      example: {
        id: 4, // required
        name: 'iPhone Updated',
        description: 'this is the updated data',
        price: 50000,
        category: 'Smartphones',
      },
    },
  })
  @ApiOperation({ summary: 'Update product details' })
  @ApiResponse({
    status: 200,
    description: 'Product is updated successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Product is updated',
        data: {
          id: 4,
          name: 'Mac mini m2',
          description: 'this is the updated data',
          price: 50000,
          category: 'Computers',
          status: 1,
          createdAt: '2024-11-09T08:21:14.413Z',
          updatedAt: '2024-11-09T09:43:26.812Z',
        },
        timestamp: '2024-11-09T09:43:27.354Z',
      },
    },
  })
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
  @ApiBody({
    schema: {
      example: {
        id: 2, // required
      },
    },
  })
  @ApiOperation({ summary: 'Delete a product (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Product is deleted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Product is deleted',
        data: {
          id: 2,
          name: 'iPhone Updated',
          description: 'this is the updated data',
          price: 50000,
          category: 'Smartphones',
          status: -1,
          createdAt: '2024-11-09T08:20:36.514Z',
          updatedAt: '2024-11-09T09:32:51.020Z',
        },
        timestamp: '2024-11-09T09:32:51.567Z',
      },
    },
  })
  async deleteProduct(@Body() payload: DeleteProductDto) {
    const { id } = payload;
    const result = await this.productService.deleteProduct(+id);
    return {
      message: 'Product is deleted',
      data: result,
    };
  }
}
