import axios from 'axios';
import * as TokenService from './token';
import config from '@app/config';

const API = config.API;

interface IArgs {
  auth: boolean;
  headers?: any;
  body?: any;
  params?: any;
}

const defaultParams: IArgs = {
  auth: true,
};

const getHeaders = (args: IArgs) => {
  return {
    authorization: args.auth ? TokenService.accessToken : undefined,
    ...args.headers,
  };
};

const client = axios.create({
  baseURL: API,
});

export const get = async (resource: string, args: IArgs = defaultParams) => {
  const headers = getHeaders(args);

  return client.get(resource, {
    headers,
    params: args.params,
  });
};

export const post = async (resource: string, args: IArgs = defaultParams) => {
  const headers = getHeaders(args);

  return client.post(resource, args.body, {
    headers,
  });
};
