type NonWorkingDay = string | { start: string, end: string };

// List of custom non-working days (specific dates and ranges)
export const nonWorkingDays: NonWorkingDay[] = [
    '2024-04-25',
    '2024-06-10',
    '2024-10-07',
    '2025-01-27',
    '2025-06-09',
    '2025-10-06',
    '2026-01-26',
    '2026-04-27',
    '2026-06-08',
    '2026-10-05',
    { start: '2024-12-23', end: '2025-01-03' },
    { start: '2025-04-18', end: '2025-04-25' },
    { start: '2025-12-24', end: '2026-01-02' },
    { start: '2026-04-03', end: '2026-04-06' }
];
