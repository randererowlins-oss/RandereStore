import { stylingRequestRepository } from '../repositories/styling-request.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { StylingRequestStatus } from '../types/index.js';

export class StylingRequestService {
  async submitRequest(data: any) {
    return stylingRequestRepository.create(data);
  }

  async getRequestById(id: string) {
    const request = await stylingRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundError(`Styling request '${id}' not found`);
    }
    return request;
  }

  async getUserRequests(userId: string) {
    return stylingRequestRepository.findByUserId(userId);
  }

  async listRequests(params: any) {
    return stylingRequestRepository.findAll(params);
  }

  async updateRequestStatus(id: string, updates: {
    status: StylingRequestStatus;
    stylistNotes?: string | null;
  }) {
    const updated = await stylingRequestRepository.updateStatus(id, updates);
    if (!updated) {
      throw new NotFoundError(`Styling request '${id}' not found`);
    }
    return updated;
  }
}

export const stylingRequestService = new StylingRequestService();
