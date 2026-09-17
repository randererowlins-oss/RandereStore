import { Request, Response, NextFunction } from 'express';
import { storyService } from '../services/story.service.js';

export class StoryController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await storyService.listStories(req.query);
      res.status(200).json({
        success: true,
        data: result.stories,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const story = await storyService.getStoryBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: story,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const story = await storyService.createStory(req.body);
      res.status(201).json({
        success: true,
        message: 'Story published',
        data: story,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const story = await storyService.updateStory(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Story updated',
        data: story,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await storyService.deleteStory(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Story deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const storyController = new StoryController();
