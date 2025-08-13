import { IconButton } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import { FormikProps } from 'formik';
import { Paperclip, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface CustomFilePickerProps {
  name: string;
  formik?: FormikProps<any>;
  label: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'soft' | 'plain';
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning';
  placeholder?: string;
}

const CustomFilePicker: React.FC<CustomFilePickerProps> = ({
  name,
  formik,
  label,
  required = false,
  helperText,
  fullWidth = true,
  accept,
  multiple = false,
  disabled = false,
  size = 'md',
  variant = 'outlined',
  color = 'neutral',
  placeholder
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fieldError = formik?.touched[name] && formik?.errors[name];
  const hasError = Boolean(fieldError);

  const handleFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);

    if (formik) {
      formik.setFieldValue(name, multiple ? files : files?.[0] || null);
    }
  };

  const handleDeleteFiles = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering file select
    setSelectedFiles(null);
    if (formik) {
      formik.setFieldValue(name, null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileDisplayText = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return placeholder || `Choose ${label.toLowerCase()}`;
    }

    if (selectedFiles.length === 1) {
      return selectedFiles[0].name;
    }

    return `${selectedFiles.length} files selected`;
  };

  const hasFiles = selectedFiles && selectedFiles.length > 0;

  return (
    <FormControl error={hasError} required={required} disabled={disabled} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <FormLabel>
        {label}
        {required && <span style={{ color: 'var(--joy-palette-danger-500)' }}> *</span>}
      </FormLabel>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Input
        readOnly
        value={getFileDisplayText()}
        onClick={handleFileSelect}
        disabled={disabled}
        size={size}
        variant={variant}
        color={hasError ? 'danger' : color}
        startDecorator={<Paperclip size={16} />}
        endDecorator={
          <>
            {hasFiles && (
              <IconButton size="sm" onClick={handleDeleteFiles} disabled={disabled} sx={{ mr: 0.5 }}>
                <X size={16} />
              </IconButton>
            )}
            <IconButton size="sm" onClick={handleFileSelect} disabled={disabled}>
              <Upload size={16} />
            </IconButton>
          </>
        }
        sx={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          '&:hover': disabled
            ? {}
            : {
                bgcolor: 'background.level1'
              }
        }}
      />
      {(hasError || helperText) && <FormHelperText>{hasError ? String(fieldError) : helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomFilePicker;
