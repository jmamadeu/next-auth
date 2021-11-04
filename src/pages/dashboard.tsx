import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';

const DashboardPage: NextPage = () => {

  const { user } = useContext(AuthContext)

  return (
    <div>
      <Head>
        <title>Dashboard Page</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <h1>Dashboard</h1>

      <h3>Hello mr: {user?.email} </h3>
    </div>
  );
};

export default DashboardPage;
