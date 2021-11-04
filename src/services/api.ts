import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOutAndRemoveCookies } from '../contexts/auth';
import { AuthTokenError } from './errors/auth-token-error';

let isRefreshingToken = false;

type FailedRequestQueueProperties = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError<any, any>) => void;
};

const failedRequestsQueue: Array<FailedRequestQueueProperties> = [];

export function setupApiClient(context: any = undefined) {
  let cookies = parseCookies(context);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    },
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (error.response.data.code === 'token.expired') {
          cookies = parseCookies();

          const { 'nextauth.refreshToken': refreshToken } = cookies;

          const originalConfig = error.config;

          if (!isRefreshingToken) {
            isRefreshingToken = true;

            api
              .post('/refresh', { refreshToken })
              .then(({ data }) => {
                setCookie(context, 'nextauth.token', data.token, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                });

                setCookie(context, 'nextauth.refreshToken', data.refreshToken, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                });
                api.defaults.headers.common[
                  'Authorization'
                ] = `Bearer ${data.token}`;

                failedRequestsQueue.forEach((req) => req.onSuccess(data.token));
                failedRequestsQueue.splice(0, failedRequestsQueue.length);
              })
              .catch((err) => {
                failedRequestsQueue.forEach((fail) => fail.onFailure(err));
              })
              .finally(() => {
                isRefreshingToken = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                if (originalConfig.headers) {
                  originalConfig.headers['Authorization'] = `Bearer ${token}`;
                }

                resolve(api(originalConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error);
              },
            });
          });
        } else {
          if (process.browser) {
            signOutAndRemoveCookies();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
