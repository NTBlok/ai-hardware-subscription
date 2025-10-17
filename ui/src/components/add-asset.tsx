import { useRouter } from "next/router";
import React from "react";
import FormikSelectMenu from './FormikSelectMenu';
import { AddButton } from "./header-container";
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
import { toast } from "react-toastify";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, TextField } from "@mui/material";
import { useSubscription } from "./subscription-table";
import { useLocation } from "./location-table";
import { usePostAsset } from "./asset-table";

export default function AddAsset( params:{ formTitle: string; }) {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { getSubscriptionsData, subscriptionsData, subscriptionsLoading, subscriptionsError } = useSubscription({});
  const { getLocationsData, locationsData, locationsLoading, locationsError } = useLocation({});
  const [open, setOpen] = React.useState(false);
  const { postAssetData, postAsset, postAssetLoading, postAssetError } = usePostAsset({});
  const router = useRouter();
  
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  
  const subscriptionsSelectOptions = subscriptionsLoading
  ? []
  : subscriptionsData?.map((subscription) => ({
    value: subscription.id,
    label: `${subscription.name}`
  }));

  const locationsSelectOptions = locationsLoading
  ? []
  : locationsData?.map((location) => ({
    value: location.id,
    label: `${location.name}`
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
        'subscription_id': undefined,
        'location_id': undefined,
        'name': '',
        'serial': ''
      }} 
      onSubmit={async (values): Promise<void | Promise<any>> => {
        if (values.subscription_id && values.location_id) {
          postAssetData(values);
          toast('Asset added.'); 
          router.reload();
        }
        }}    
    >
      {({ submitForm }) => (
        <Form data-testid="add-asset-modal">
         <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>{params.formTitle}</DialogTitle>
                <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Subscription</InputLabel>
                <Field 
                  id="add-asset-select-subscription"
                  name="subscription_id"
                  key="select-subscription-id"
                  component={FormikSelectMenu}
                >
                  {
                    subscriptionsSelectOptions?.map((subscription) => (
                      <MenuItem key={`subscription-${subscription.value}`} value={subscription.value}>{subscription.label}</MenuItem> 
                    ))
                  }
                </Field> 
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Location</InputLabel>
                <Field 
                  id="add-asset-select-location"
                  name="location_id"
                  key="select-location-id"
                  component={FormikSelectMenu}
                >
                  {
                    locationsSelectOptions?.map((location) => (
                      <MenuItem key={`location-${location.value}`} value={location.value}>{location.label}</MenuItem> 
                    ))
                  }
                </Field> 
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Field 
                as={TextField}
                id="outlined-basic"
                name="name"
                label="Name of asset"
                variant="outlined"
              /> 
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Field 
                as={TextField}
                id="outlined-basic"
                name="serial"
                label="Serial of asset"
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