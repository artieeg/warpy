import axios from 'axios';
import * as TokenService from './token';

const API = 'http://192.168.1.8:9999/';

interface IAPIParams {
  auth: boolean;
  headers?: any;
  body?: any;
}

const defaultParams: IAPIParams = {
  auth: true,
};

const getHeaders = (params: IAPIParams) => {
  return {
    authorization: params.auth ? TokenService.accessToken : undefined,
    ...params.headers,
  };
};

const client = axios.create({
  baseURL: API,
});

export const get = async (
  resource: string,
  params: IAPIParams = defaultParams,
) => {
  const headers = getHeaders(params);

  return client.get(resource, {
    headers,
  });
};

export const post = async (
  resource: string,
  params: IAPIParams = defaultParams,
) => {
  const headers = getHeaders(params);

  return client.post(resource, params.body, {
    headers,
  });
};
