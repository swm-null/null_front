import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { refreshableApi } from 'pages/home/api';
import { Tag } from 'pages/home/subPages/interfaces';
import { paginationDashboardTagRelations } from 'pages/home/subPages/dashboard/interfaces';

export interface paginationDashboardTagRelationsResponse
  extends paginationDashboardTagRelations,
    validResponse {}

export const getDashboardTagRelations = async ({
  tagId,
  page,
  limit,
}: {
  tagId?: string;
  page: number;
  limit: number;
}): Promise<paginationDashboardTagRelationsResponse | errorResponse> => {
  const method = getMethodName();

  const params = new URLSearchParams();
  if (tagId) params.append('id', tagId);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const endpoint = `/tag/descendants?${params.toString()}`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      total_count: response.data.total_count,
      current_count: response.data.current_count,
      total_page: response.data.total_page,
      current_page: response.data.current_page,
      tag: response.data.tag,
      tag_relations: response.data.child_tags,
    };
    return responseInfo as paginationDashboardTagRelationsResponse;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface getTagsResponse extends validResponse {
  tags: Tag[];
}

export const getChildTags = async (
  tagId?: string
): Promise<getTagsResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = tagId ? `/tag/ancestors?id=${tagId}` : `/tag/children`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: '특정 태그의 자식 태그를 가져오는 것을 성공했습니다.',
      tags: response.data,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isDashboardTagRelationsResponse = (
  response: paginationDashboardTagRelationsResponse | errorResponse
): response is paginationDashboardTagRelationsResponse => {
  return (
    (response as paginationDashboardTagRelationsResponse).tag_relations !== undefined
  );
};

export const isGetTagsResponse = (
  response: getTagsResponse | errorResponse
): response is getTagsResponse => {
  return (response as getTagsResponse).tags !== undefined;
};
