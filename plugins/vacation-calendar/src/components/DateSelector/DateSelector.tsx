import { DatePicker } from '@backstage/ui';
import { parseDate, type DateValue } from '@internationalized/date';
import dayjs, { type Dayjs } from 'dayjs';

type DateSelectorProps = {
  label: string;
  initialDate: Dayjs;
  onDateChange: (date: Dayjs | null) => void;
};

function toDateValue(date: Dayjs): DateValue {
  return parseDate(date.format('YYYY-MM-DD'));
}

export const DateSelector = ({
  label,
  initialDate,
  onDateChange,
}: DateSelectorProps) => {
  const handleChange = (value: DateValue | null) => {
    if (value) {
      onDateChange(dayjs(value.toString()));
    } else {
      onDateChange(null);
    }
  };

  return (
    <DatePicker
      label={label}
      value={toDateValue(initialDate)}
      onChange={handleChange}
    />
  );
};
