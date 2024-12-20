import { errorResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { getTagMemos, paginationMemosResponse } from 'pages/home/subPages/api';
import { SortOption } from 'pages/home/subPages/types';

export const getRecentMemos = async (
  page: number,
  limit: number
): Promise<paginationMemosResponse | errorResponse> => {
  const method = getMethodName();

  try {
    const response = (await getTagMemos({
      page: page,
      limit: limit,
      sortOrder: 'LATEST' as SortOption,
    })) as paginationMemosResponse;
    response.method = method;
    return response;
  } catch (error) {
    return errorHandler(error, method);
  }
};
