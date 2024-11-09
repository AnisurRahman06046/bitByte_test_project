import { Injectable, NotFoundException } from '@nestjs/common';
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
  async fetchProducts(query: any) {
    const {
      page = 1,
      limit = 10,
      category,
      sortByPrice,
      sortByCreatedAt,
    } = query;

    const skip = (page - 1) * limit;
    const orderBy = [];

    if (sortByPrice) {
      orderBy.push({ price: sortByPrice });
    }
    if (sortByCreatedAt) {
      orderBy.push({ createdAt: sortByCreatedAt });
    }

    const where = category ? { category } : {};

    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await this.prisma.product.count({ where });

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
      },
    });
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    return product;
  }

  //   update a product
  async updateProduct(id: number, payload: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: id },
      data: payload,
    });

    return updatedProduct;
  }

  //   delete a product
  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: id, status: -1 },
    });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    const result = await this.prisma.product.update({
      where: { id: id },
      data: { status: -1 },
    });
    return result;
  }
}
