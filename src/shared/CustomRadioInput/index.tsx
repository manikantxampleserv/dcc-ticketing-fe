import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Radio from '@mui/joy/Radio';
import RadioGroup, { RadioGroupProps } from '@mui/joy/RadioGroup';
import { FormikProps } from 'formik';
import React from 'react';

interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

interface CustomRadioInputProps extends Omit<RadioGroupProps, 'name' | 'value' | 'onChange'> {
  name: string;
  formik?: FormikProps<any>;
  label: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
}

const CustomRadioInput: React.FC<CustomRadioInputProps> = ({
  name,
  formik,
  label,
  required = false,
  helperText,
  fullWidth = true,
  options,
  orientation = 'vertical',
  size = 'md',
  variant = 'outlined',

  ...restProps
}) => {
  const fieldValue = formik?.values[name] || '';
  const fieldError = formik?.touched[name] && formik?.errors[name];
  const hasError = Boolean(fieldError);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (formik) {
      formik.setFieldValue(name, event.target.value);
    }
  };

  const handleBlur = () => {
    if (formik) {
      formik.setFieldTouched(name, true);
    }
  };

  return (
    <FormControl error={hasError} required={required} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <FormLabel>
        {label}
        {required && <span style={{ color: 'var(--joy-palette-danger-500)' }}> *</span>}
      </FormLabel>

      <RadioGroup
        name={name}
        value={fieldValue}
        onChange={handleChange}
        onBlur={handleBlur}
        orientation={orientation}
        size={size}
        variant={variant}
        sx={{
          gap: 1,
          border: 0,
          mt: 1,
          ...(orientation === 'horizontal' && {
            flexDirection: 'row',
            flexWrap: 'wrap'
          })
        }}
        {...restProps}
      >
        {options.map(option => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            disabled={option.disabled}
            slotProps={{
              root: {
                sx: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                  ...(orientation === 'horizontal' && {
                    minWidth: 'auto',
                    mr: 2
                  })
                }
              }
            }}
          />
        ))}
      </RadioGroup>

      {(hasError || helperText) && <FormHelperText>{hasError ? String(fieldError) : helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomRadioInput;
