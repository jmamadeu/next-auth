import jwtDecode from 'jwt-decode';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next';
import { parseCookies } from 'nookies';
import { validateUserPermissions } from './validate-user-permissions';

type WithSSRAuthOptionsProperties = {
  roles?: Array<string>;
  permissions?: Array<string>;
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptionsProperties
): GetServerSideProps {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);
    const token = cookies['nextauth.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    if(options) {

      const user = jwtDecode<{ permissions?: string[]; roles?: string[] }>(token);
  
      const userHasValidPermissions = validateUserPermissions({
        ...options,
        user,
      });

      if(!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }
    }


    return await fn(context);
  };
}
