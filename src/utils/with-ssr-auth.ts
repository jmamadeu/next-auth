import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next';
import { parseCookies } from 'nookies';

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);

    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    return await fn(context);
    // try {
    //   return await fn(context);
    // } catch (err) {
    //   console.log(err)
    //   if (err instanceof AuthTokenError) {
    //     destroyCookie(context, 'nextauth.token');
    //     destroyCookie(context, 'nextauth.refreshToken');

    //     console.log("teste")
    //     return {
    //       redirect: {
    //         destination: '/',
    //         permanent: false,
    //       },
    //     };

    //   }
    // }
  };
}
