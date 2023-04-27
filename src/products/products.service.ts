import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      desc,
      price,
    });
    const result = await newProduct.save();

    return result.id as string;
  }

  async getProducts(): Promise<any[]> {
    const results = await this.productModel.find().exec();

    return results.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.desc,
      price: prod.price,
    }));
  }

  async getSingleProduct(productId) {
    const product = await this.findProduct(productId);

    return {
      id: product.id,
      title: product.title,
      description: product.desc,
      price: product.price,
    };
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.desc = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    await updatedProduct.save();

    return {
      sucess: true,
    };
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();

    if (result.deletedCount === 0) {
      throw new NotAcceptableException('Could not find product.');
    }

    return {
      sucess: true,
    };
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch {
      throw new NotAcceptableException('Could not find product.');
    }

    if (!product) {
      throw new NotAcceptableException('Could not find product.');
    }

    return product;
  }
}
