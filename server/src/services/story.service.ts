import { storyRepository } from '../repositories/story.repository.js';
import { slugify } from '../utils/slugify.js';
import { NotFoundError } from '../utils/errors.js';

export class StoryService {
  async listStories(params: any) {
    return storyRepository.findAll(params);
  }

  async getStoryBySlug(slug: string) {
    const story = await storyRepository.findBySlug(slug);
    if (!story) {
      throw new NotFoundError(`Story '${slug}' not found`);
    }
    return story;
  }

  async createStory(data: any) {
    let baseSlug = slugify(data.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await storyRepository.findBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    return storyRepository.create({
      ...data,
      slug: finalSlug,
    });
  }

  async updateStory(id: string, data: any) {
    const existing = await storyRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Story '${id}' not found`);
    }

    if (data.title && data.title !== existing.title && !data.slug) {
      let baseSlug = slugify(data.title);
      let finalSlug = baseSlug;
      let counter = 1;
      while (true) {
        const check = await storyRepository.findBySlug(finalSlug);
        if (!check || check.id === id) break;
        finalSlug = `${baseSlug}-${counter++}`;
      }
      data.slug = finalSlug;
    }

    return storyRepository.update(id, data);
  }

  async deleteStory(id: string) {
    const existing = await storyRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Story '${id}' not found`);
    }
    return storyRepository.delete(id);
  }
}

export const storyService = new StoryService();
