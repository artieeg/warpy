import axios from 'axios';
import * as TokenService from './token';

const API = 'http://192.168.1.6:9999/';

interface IAPIParams {
  auth: boolean;
  headers?: any;
}

const defaultParams: IAPIParams = {
  auth: true,
};

const getHeaders = (params: IAPIParams) => {
  return {
    authorization: params.auth ? TokenService.accessToken : undefined,
  };
};

export const get = async (
  resource: string,
  params: IAPIParams = defaultParams,
) => {
  const headers = {
    ...getHeaders(params),
    ...params.headers,
  };

  return axios.get(API + resource, {
    headers,
  });
};
