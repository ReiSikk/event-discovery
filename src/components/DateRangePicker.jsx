import { Button, CalendarCell, CalendarGrid, DateInput, DateRangePicker as AriaDateRangePicker, DateSegment, Dialog, Group, Heading, Label, Popover, RangeCalendar } from 'react-aria-components';
import React from 'react';
import styles from './DateRangePicker.module.css';
import { ArrowDown, ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';

function CustomDateRangePicker() {
  return (
    <AriaDateRangePicker className={styles.dateRangePicker}>
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
            <ArrowDown size={16} />
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
            <CalendarGrid>
              {(date) => <CalendarCell date={date} className={styles.calendarCell}/>}
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}

export default CustomDateRangePicker;