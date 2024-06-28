import React from 'react';
import { DateTime } from 'luxon/src/datetime';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

type DateSelectorProps = {
  label: string;
  initalDate: DateTime;
  onDateChange: (date: DateTime | null | string | undefined) => void;
};

export const DateSelector = ({
  label,
  initalDate,
  onDateChange,
}: DateSelectorProps) => {
  return (
    <FormControl variant="standard">
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DesktopDatePicker
          format="yyyy-MM-dd"
          label={label}
          value={initalDate}
          defaultValue={initalDate}
          onChange={onDateChange}
        />
      </LocalizationProvider>
    </FormControl>
  );
};
