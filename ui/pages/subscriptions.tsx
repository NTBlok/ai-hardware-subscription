import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SubscriptionTableFromAPI from 'src/components/subscription-table';
import NavBar from 'src/components/navbar';
import HeaderContainer, { AddButton } from 'src/components/header-container';

const About: NextPage = () => {
  return (
    <Container>
      <NavBar />
      <Container maxWidth="lg">
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
            header='Subscriptions'
          />
          <SubscriptionTableFromAPI />
        </Box>
      </Container>
    </Container>
  );
};

export default About;
