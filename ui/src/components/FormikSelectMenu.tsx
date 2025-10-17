import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';

const FormikSelectMenu = ({ children, form, field }: {
  children: any;
  form: any;
  field: any;
}) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <Select
      input={<OutlinedInput label="Asset" id="demo-dialog-native" />}
      name={name}
      value={value}
      onChange={e => {
        setFieldValue(name, e.target.value);
      }}
    >
      {children}
    </Select>
  );
};

export default FormikSelectMenu;