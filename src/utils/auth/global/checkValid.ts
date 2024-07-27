import { errorResponse, validResponse } from './interface';

export const isValidResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  const validStatus = [200, 201, 204];
  return validStatus.includes(response.status);
};
