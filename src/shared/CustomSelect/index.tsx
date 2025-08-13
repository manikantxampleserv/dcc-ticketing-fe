import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Option from '@mui/joy/Option';
import Select, { SelectProps } from '@mui/joy/Select';
import { FormikProps } from 'formik';
import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps extends Omit<SelectProps<any, false>, 'name' | 'value' | 'onChange' | 'error'> {
  name: string;
  formik?: FormikProps<any>;
  label: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  options?: SelectOption[];
  children?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  formik,
  label,
  required = false,
  helperText,
  fullWidth = true,
  placeholder,
  disabled,
  size = 'md',
  variant = 'outlined',
  color = 'neutral',
  startDecorator,
  endDecorator,
  options,
  children,
  ...restProps
}) => {
  const fieldValue = formik?.values[name] || '';
  const fieldError = formik?.touched[name] && formik?.errors[name];
  const hasError = Boolean(fieldError);

  const handleChange = (_: React.SyntheticEvent | null, newValue: string | number | null) => {
    if (formik) {
      formik.setFieldValue(name, newValue);
    }
  };

  const handleBlur = () => {
    if (formik) {
      formik.setFieldTouched(name, true);
    }
  };

  return (
    <FormControl error={hasError} required={required} disabled={disabled} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <FormLabel>
        {label}
        {required && <span style={{ color: 'var(--joy-palette-danger-500)' }}> *</span>}
      </FormLabel>

      <Select
        name={name}
        value={fieldValue}
        placeholder={placeholder || `Select ${label.toLowerCase()}`}
        onChange={handleChange}
        onClose={handleBlur}
        disabled={disabled}
        size={size}
        variant={variant}
        color={hasError ? 'danger' : color}
        startDecorator={startDecorator}
        endDecorator={endDecorator}
        {...restProps}
      >
        {/* Render options from array if provided */}
        {options?.map(option => (
          <Option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </Option>
        ))}

        {/* Render children if provided (for custom Option components) */}
        {children}
      </Select>

      {(hasError || helperText) && <FormHelperText>{hasError ? String(fieldError) : helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
