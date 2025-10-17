import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { AddButton } from 'src/components/header-container';
import TextField from '@mui/material/TextField';
import { useAssets } from './asset-table';
import { Formik, Field, Form } from 'formik';
import { usePostImpaired } from './impaired-table';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { MenuItem } from '@mui/material';
import * as Yup from 'yup';
import FormikSelectMenu from './FormikSelectMenu';

// const AddImpairedSchema = Yup.object().shape({
//   asset_id: Yup.number().required(),
//   description: Yup.string().required()
// });

export default function AddImpaired( params:{ formTitle: string;  }) {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { getAssetsData, assetsData, getAssetsLoading, getAssetsError } = useAssets({});
  const [open, setOpen] = React.useState(false);
  const { postImpairedData, postData, postLoading, postError } = usePostImpaired({});
  const router = useRouter();

  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  const assetsSelectOptions = getAssetsLoading
    ? []
    : assetsData?.filter((asset) => !asset.impaired )
    .map((asset) => ({
      value: asset.id,
      label: `${asset.serial}`
    }));


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <>
      <AddButton onClick={handleClickOpen} />
      <Formik
        initialValues={{
          'asset_id': undefined,
          'description': ''
          }} 
        // validationSchema={AddImpairedSchema}
        onSubmit={async (values): Promise<void | Promise<any>> => {
          if (values.asset_id) {
            postImpairedData(values);
            toast('Impaired asset added.'); 
            router.reload();
          }
          }} 
          >
             {({ submitForm }) => (
              <Form data-testid="add-impaired-modal">
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>{params.formTitle}</DialogTitle>
                <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Asset</InputLabel>
                <Field 
                  id="add-impaired-select-asset"
                  name="asset_id"
                  key="select-asset-id"
                  component={FormikSelectMenu}
                >
              {
                assetsSelectOptions?.map((asset) => (
                  <MenuItem key={`asset-${asset.value}`} value={asset.value}>{asset.label}</MenuItem>
                ))
              }
              </Field>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Field 
                as={TextField}
                id="outlined-basic"
                name="description"
                label="Describe impaired asset"
                variant="outlined"
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(e) => {submitForm(); handleClose(e)}}>Ok</Button>
        </DialogActions>
      </Dialog>
              </Form>
              )}
          </Formik>
    </>
  );
}