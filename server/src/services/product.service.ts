import { productRepository } from '../repositories/product.repository.js';
import { slugify } from '../utils/slugify.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class ProductService {
  async listProducts(params: any) {
    return productRepository.findAll(params);
  }

  async getFeaturedDrop() {
    return productRepository.getFeaturedDrop(6);
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundError(`Product '${slug}' not found`);
    }
    // Increment view count asynchronously
    productRepository.incrementViewCount(product.id).catch(() => {});
    return product;
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product '${id}' not found`);
    }
    return product;
  }

  async getCategories() {
    return productRepository.findCategories();
  }

  async createProduct(data: any) {
    let baseSlug = slugify(data.name);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await productRepository.findBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    return productRepository.create({
      ...data,
      slug: finalSlug,
    });
  }

  async updateProduct(id: string, data: any) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Product '${id}' not found`);
    }

    if (data.name && data.name !== existing.name && !data.slug) {
      let baseSlug = slugify(data.name);
      let finalSlug = baseSlug;
      let counter = 1;
      while (true) {
        const check = await productRepository.findBySlug(finalSlug);
        if (!check || check.id === id) break;
        finalSlug = `${baseSlug}-${counter++}`;
      }
      data.slug = finalSlug;
    }

    return productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Product '${id}' not found`);
    }
    return productRepository.delete(id);
  }
}

export const productService = new ProductService();
