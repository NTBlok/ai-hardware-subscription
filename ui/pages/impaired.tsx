import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import HeaderContainer from 'src/components/header-container';
import Box from '@mui/material/Box';
import ImpairedTableFromAPI, { useImpaired } from "src/components/impaired-table"; 
import NavBar from 'src/components/navbar';
import AddImpaired from 'src/components/add-impaired';
import dynamic from 'next/dynamic';
import React from 'react';

const ImpairedBarChart = dynamic (
  () => import('src/components/impaired-barChart'),
  { ssr: false }
);


const About: NextPage = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { getImpairedData, getData, getLoading, getError } = useImpaired({});
  const data = React.useMemo(() => getData, [getData]);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  
  return (
    <Container>
      <NavBar />
      <Container maxWidth="lg">
        <Box>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <HeaderContainer 
            actions={<AddImpaired formTitle={'Add impaired asset'} />}
            header='Impaired'
          />
          <ImpairedTableFromAPI />
        </Box>
        <ImpairedBarChart />
        </Box>
      </Container>
    </Container>
  );
};

export default About;