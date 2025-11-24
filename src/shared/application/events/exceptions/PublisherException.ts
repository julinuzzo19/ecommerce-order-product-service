import { ApplicationException } from '../../exceptions/ApplicationException.js';

export class PublisherException extends ApplicationException {
  static publishError(details: string): PublisherException {
    return new PublisherException(`Error publishing event: ${details}`);
  }
}
