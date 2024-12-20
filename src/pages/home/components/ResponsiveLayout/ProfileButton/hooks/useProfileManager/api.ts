import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { refreshableApi } from 'pages/home/api';
import { profile } from '../../profileInterface';

interface profileResponse extends profile, validResponse {}

export const getUserProfile = async (): Promise<profileResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/user/me`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      email: response.data.email,
      name: response.data.name,
      profileImageUrl: response.data.profile_image_url,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const editUserProfile = async (
  email: string,
  newName: string,
  newImageUrl: string
): Promise<profileResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/user/me`;

  try {
    const response = await refreshableApi.put(
      endpoint,
      JSON.stringify({ email, name: newName, profile_image_url: newImageUrl })
    );
    const responseInfo = {
      method,
      status: response.status,
      email: response.data.email,
      name: response.data.name,
      profileImageUrl: response.data.profile_image_url,
    };
    return responseInfo as profileResponse;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const deleteUserAccount = async (): Promise<
  validResponse | errorResponse
> => {
  const method = getMethodName();
  const endpoint = '/user';
  try {
    const response = await refreshableApi.delete(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: response.data,
    } as validResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isProfileResponse = (
  response: profileResponse | errorResponse
): response is profileResponse => {
  return (response as profileResponse).email !== undefined;
};
