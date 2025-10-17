import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import Router from 'next/router'

const Home: NextPage = () => {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    const { pathname } = Router
    if (pathname == '/') {
      Router.push('/subscriptions')
    }
  });

  return (
    <>
      {domLoaded && (
    <Typography>Redirecting to /subscriptions</Typography>
    )}
    </>
  )
};

export default Home;
