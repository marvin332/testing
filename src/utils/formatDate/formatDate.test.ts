import { formatDate } from '@utils/formatDate/formateDate.ts';
import { describe, it, expect } from 'vitest';

const cases: Array<[number | Date, string]> = [
    [new Date('2024-01-01'), '01.01.2024'],
    [new Date('2024-12-31'), '31.12.2024'],
    [new Date('2020-02-29'), '29.02.2020'],
    [new Date('2023-04-05'), '05.04.2023'],
    [new Date('1999-11-09'), '09.11.1999'],
    [new Date(2022, 11, 31).getTime(), '31.12.2022'],
    [0, '01.01.1970'],
];

describe('formatDate', () => {
    it.each(cases)(
        'преобразует %p в строку %s',
        (input, expected) => {
            expect(formatDate(input)).toBe(expected);
        }
    );

    it('работает с текущей датой без ошибок', () => {
        const now = new Date();
        const result = formatDate(now);

        expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    });
});
