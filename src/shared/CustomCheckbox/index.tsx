import Checkbox, { CheckboxProps } from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import { FormikProps } from 'formik';
import React from 'react';

interface CustomCheckboxProps extends Omit<CheckboxProps, 'name' | 'checked' | 'onChange' | 'onBlur'> {
  name: string;
  formik?: FormikProps<any>;
  label: string;
  helperText?: string;
  fullWidth?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  formik,
  label,
  helperText,
  fullWidth = true,
  disabled,
  size = 'md',
  variant = 'outlined',
  color = 'primary',
  ...restProps
}) => {
  const fieldValue = formik?.values[name] || false;
  const fieldError = formik?.touched[name] && formik?.errors[name];
  const hasError = Boolean(fieldError);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (formik) {
      formik.setFieldValue(name, event.target.checked);
    }
  };

  const handleBlur = () => {
    if (formik) {
      formik.setFieldTouched(name, true);
    }
  };

  return (
    <FormControl error={hasError} disabled={disabled} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Checkbox
        name={name}
        checked={fieldValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        size={size}
        variant={variant}
        color={hasError ? 'danger' : color}
        label={label}
        {...restProps}
      />
      {(hasError || helperText) && (
        <FormHelperText sx={{ ml: hasError ? 0 : '32px' }}>{hasError ? String(fieldError) : helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomCheckbox;
