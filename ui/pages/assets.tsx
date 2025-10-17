import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AssetTableFromAPI, { useAssets } from 'src/components/asset-table';
import NavBar from 'src/components/navbar';
import HeaderContainer, { AddButton } from 'src/components/header-container';
import React from 'react';
import AddAsset from 'src/components/add-asset';

const About: NextPage = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { getAssetsData, assetsData, getAssetsLoading, getAssetsError } = useAssets({});
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
            actions={<AddAsset formTitle={'Add new asset'} />}
            header='Assets'
          />
          <AssetTableFromAPI getData={assetsData} getLoading={getAssetsLoading} getError={getAssetsError} />
        </Box>
      </Container>
    </Container>
  );
};

export default About;
