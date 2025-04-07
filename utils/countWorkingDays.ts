import { nonWorkingDays } from '../data/bayview/nonWorkingDays';
import moment, { Moment } from 'moment';

// Define the types for non-working days

// Function to check if a date is within any non-working date range
function isNonWorkingDay(date: Moment | string): boolean {
    return nonWorkingDays.some(day => {
        if (typeof day === 'string') {
            return moment(date).isSame(day, 'day');
        } else {
            const start = moment(day.start);
            const end = moment(day.end);
            return moment(date).isBetween(start, end, 'day', '[]');  // Inclusive range
        }
    });
}

// Function to count working days, excluding Saturdays, Sundays, and custom non-working days
function countWorkingDays(startDate: Moment, endDate: Moment): number {
    let currentDate = startDate.clone();
    let workingDays = 0;

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        const dayOfWeek = currentDate.day(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
        
        // Exclude Sunday (0), Saturday (6), and custom non-working days
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isNonWorkingDay(currentDate)) {
            workingDays++;
        }
        
        currentDate.add(1, 'days');
    }

    return workingDays;
}

export default countWorkingDays;