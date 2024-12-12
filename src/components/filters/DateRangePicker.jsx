import { Button, CalendarCell, CalendarGrid, DateInput, DateRangePicker as AriaDateRangePicker, DateSegment, Dialog, Group, Heading, Label, Popover, RangeCalendar } from 'react-aria-components';
import React, {useState} from 'react';
import styles from './DateRangePicker.module.css';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, ChevronDown } from 'lucide-react';
import {parseDate} from '@internationalized/date';
import { format, addDays } from 'date-fns';

function CustomDateRangePicker({ handleDateRangeChange, filterState }) {

    const today = new Date();
    const tomorrow = addDays(today, 1);

    const [value, setValue] = useState({
        start: filterState.dateRange.start || parseDate(format(today, 'yyyy-MM-dd')),
        end: filterState.dateRange.end || parseDate(format(tomorrow, 'yyyy-MM-dd'))
      });

  return (
    <AriaDateRangePicker
        className={styles.dateRangePicker}
        aria-label="Date range (uncontrolled)"
        defaultValue={{
          start: parseDate(format(today, 'yyyy-MM-dd')),
          end: parseDate(format(tomorrow, 'yyyy-MM-dd'))
        }}
        onChange={handleDateRangeChange}
     >
      <Label className={styles.dateRangePicker__title}>Event Date Range</Label>
      <Group className={styles.group}>
        <DateInput slot="start" className={styles.input}>
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <span aria-hidden="true">–</span>
        <DateInput slot="end" className={styles.input}>
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <Button className={styles.button}>
            <ChevronDown size={16} />
        </Button>
      </Group>
      <Popover className={styles.popover}>
        <Dialog>
          <RangeCalendar className={styles.rangeCalendar}>
            <header className={styles.rangeCalendar__header}>
              <Button slot="previous" className={styles.calendarBtn}>
                <ArrowLeftCircleIcon size={24} />
              </Button>
              <Heading className={`${styles.rangeCalendar__title} h4`}/>
              <Button slot="next" className={styles.calendarBtn}>
                <ArrowRightCircleIcon size={24} />
              </Button>
            </header>
            <CalendarGrid className={styles.rangeCalendar__grid}>
              {(date) => <CalendarCell date={date} className={styles.calendarCell}/>}
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}

export default CustomDateRangePicker;