import { Container, Box, Typography, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, { FC } from "react";
import theme from "src/theme";

interface HeaderContainerProps extends React.HTMLAttributes<HTMLElement> {
  header: string;
  actions?: React.ReactNode;
  breadCrumb?: {
    onClick?: () => void;
    text: string;
    to?: React.ReactNode;
  };
}

interface AddButtonSelectModalProps {
  onClick: () => void;
}


export const AddButton: FC<AddButtonSelectModalProps> = ({ 
  onClick
}) => { 
  
  return (
  <Button sx={{
    float: 'right',
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '40px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      opacity: [0.9, 0.8, 0.7],
     }
  }}
  onClick={onClick}
  data-testid="header-container-add-button"
  ><AddIcon/>Add</Button>
  )
}

const HeaderContainer = ({
  actions,
  header,
  ...props
}: HeaderContainerProps): JSX.Element => {

  return (
    <Container>
      <Box sx={{ 
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 1,
          gridTemplateRows: 'auto',
          gridTemplateAreas: `". . header . actions"`,
       }}>
        <Box sx={{ gridArea: 'header' }}>
         <Typography variant="h4" component="h1" gutterBottom>
        {header}
      </Typography>
         </Box>
         <Box sx={{ 
          gridArea: 'actions', 
          float: 'right' 
          }}>
         {actions}
         </Box>
       </Box>
    </Container>
  )
  
}

export default HeaderContainer;