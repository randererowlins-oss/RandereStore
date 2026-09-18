import { transformationRepository } from '../repositories/transformation.repository.js';
import { slugify } from '../utils/slugify.js';
import { NotFoundError } from '../utils/errors.js';

export class TransformationService {
  async listTransformations(publishedOnly = true) {
    return transformationRepository.findAll(publishedOnly);
  }

  async getTransformationBySlug(slug: string) {
    const item = await transformationRepository.findBySlug(slug);
    if (!item) {
      throw new NotFoundError(`Transformation '${slug}' not found`);
    }
    return item;
  }

  async createTransformation(data: any) {
    let baseSlug = slugify(data.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await transformationRepository.findBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    return transformationRepository.create({
      ...data,
      slug: finalSlug,
    });
  }

  async updateTransformation(id: string, data: any) {
    const existing = await transformationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Transformation '${id}' not found`);
    }

    if (data.title && data.title !== existing.title && !data.slug) {
      let baseSlug = slugify(data.title);
      let finalSlug = baseSlug;
      let counter = 1;
      while (true) {
        const check = await transformationRepository.findBySlug(finalSlug);
        if (!check || check.id === id) break;
        finalSlug = `${baseSlug}-${counter++}`;
      }
      data.slug = finalSlug;
    }

    return transformationRepository.update(id, data);
  }

  async deleteTransformation(id: string) {
    const existing = await transformationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Transformation '${id}' not found`);
    }
    return transformationRepository.delete(id);
  }
}

export const transformationService = new TransformationService();
