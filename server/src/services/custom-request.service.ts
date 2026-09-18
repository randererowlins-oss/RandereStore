import { customRequestRepository } from '../repositories/custom-request.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { CustomRequestStatus } from '../types/index.js';

export class CustomRequestService {
  async submitRequest(data: any) {
    return customRequestRepository.create(data);
  }

  async getRequestById(id: string) {
    const request = await customRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundError(`Custom request '${id}' not found`);
    }
    return request;
  }

  async getUserRequests(userId: string) {
    return customRequestRepository.findByUserId(userId);
  }

  async listRequests(params: any) {
    return customRequestRepository.findAll(params);
  }

  async updateRequestStatus(id: string, updates: {
    status: CustomRequestStatus;
    quoteAmount?: number | null;
    adminNotes?: string | null;
  }) {
    const updated = await customRequestRepository.updateStatus(id, updates);
    if (!updated) {
      throw new NotFoundError(`Custom request '${id}' not found`);
    }
    return updated;
  }
}

export const customRequestService = new CustomRequestService();
