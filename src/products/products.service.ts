import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  //   create product
  async createProduct(payload: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: payload,
    });
    return product;
  }

  //   get all products

//   async fetchProducts(query?: any) {
//     const {
//       page = 1,
//       limit = 10,
//       category,
//       sortByPrice,
//       sortByCreatedAt,
//     } = query;

//     const skip = (page - 1) * limit;
//     const orderBy: any[] = [];

//     // Prepare dynamic filter for category
//     const where: any = { status: 1 };

//     // Filter by category if provided
//     if (category) {
//       where.category = category;
//     }

//     // Handle sorting by price or createdAt
//     if (sortByPrice) {
//       orderBy.push({ price: sortByPrice === 'asc' ? 'asc' : 'desc' });
//     }
//     if (sortByCreatedAt) {
//       orderBy.push({ createdAt: sortByCreatedAt === 'asc' ? 'asc' : 'desc' });
//     }

//     // Fetch products with dynamic filters
//     const products = await this.prisma.product.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy,
//     });

//     // Calculate total products matching the filter
//     const total = await this.prisma.product.count({
//       where,
//     });

//     if (products.length === 0) {
//       throw new HttpException('No products found', HttpStatus.NOT_FOUND);
//     }

//     return {
//       data: products,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }
async fetchProducts(query?: any) {
    const {
      page = 1,
      limit = 10,
      category,
      sortByPrice,
      sortByCreatedAt,
      search, // Add the search parameter
    } = query;
  
    const skip = (page - 1) * limit;
    const orderBy: any[] = [];
    
    // Prepare dynamic filter for category
    const where: any = { status: 1 };
  
    // Filter by category if provided
    if (category) {
      where.category = category;
    }
  
    // Add full-text search filter if search query is provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } }, // Search in the name field
        { description: { contains: search, mode: 'insensitive' } }, // Search in the description field
      ];
    }
  
    // Handle sorting by price or createdAt
    if (sortByPrice) {
      orderBy.push({ price: sortByPrice === 'asc' ? 'asc' : 'desc' });
    }
    if (sortByCreatedAt) {
      orderBy.push({ createdAt: sortByCreatedAt === 'asc' ? 'asc' : 'desc' });
    }
  
    // Fetch products with dynamic filters
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });
  
    // Calculate total products matching the filter
    const total = await this.prisma.product.count({
      where,
    });
  
    if (products.length === 0) {
      throw new HttpException('No products found', HttpStatus.NOT_FOUND);
    }
  
    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  
  //   get single product
  async fetchProduct(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
        status: 1,
      },
    });
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    return product;
  }

  //   update a product
  async updateProduct(payload: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: payload.id },
    });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    const { id, ...data } = payload;
    const updatedProduct = await this.prisma.product.update({
      where: { id: id },
      data: data,
    });

    return updatedProduct;
  }

  //   delete a product
  async deleteProduct(id: number) {
    // Find the product by ID
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });

    // If the product doesn't exist, throw a NotFoundException
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    // If the product is already deleted, throw a BadRequestException
    if (product.status === -1) {
      throw new BadRequestException('Product is already deleted');
    }

    // Update the product's status to -1 (mark as deleted)
    const result = await this.prisma.product.update({
      where: { id: id },
      data: { status: -1 },
    });

    return result;
  }
}
