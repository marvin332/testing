import { HIGHLIGHT_TITLES } from '@utils/consts';
import { describe, it, expect } from 'vitest';

import {
    transformAnalysisData,
    convertHighlightsToArray,
    isCsvFile,
    validateServerResponse,
    InvalidServerResponseError,
} from './analysis.ts';

const encode = (obj: Record<string, any>) => {
    const json = JSON.stringify(obj) + '\n';
    return new TextEncoder().encode(json);
};

describe('convertHighlightsToArray', () => {
    it('конвертирует строки и числа в массив объектов с правильным title и description', () => {
        const highlights = { key1: 'value1', key2: 2 };
        // @ts-ignore
        const result = convertHighlightsToArray(highlights);

        expect(result).toEqual([
            {
                title: 'value1',
                description: HIGHLIGHT_TITLES['key1'] ?? 'Неизвестный параметр',
            },
            {
                title: '2',
                description: HIGHLIGHT_TITLES['key2'] ?? 'Неизвестный параметр',
            },
        ]);
    });

    it('использует заголовок по умолчанию для неизвестных ключей', () => {
        const highlights = { unknownKey: 'some' };
        // @ts-ignore
        const result = convertHighlightsToArray(highlights);
        expect(result[0].description).toBe('Неизвестный параметр');
    });
});

describe('isCsvFile', () => {
    it('распознаёт файл с расширением .csv', () => {
        const file = new File([''], 'test.CSV');
        expect(isCsvFile(file)).toBe(true);
    });

    it('возвращает false для других расширений', () => {
        const file = new File([''], 'test.txt');
        expect(isCsvFile(file)).toBe(false);
    });
});

describe('validateServerResponse', () => {
    it('возвращает true для данных с ожидаемыми ключами', () => {
        const validKey = Object.keys(HIGHLIGHT_TITLES)[0];
        const raw = { [validKey]: 'test' };
        expect(validateServerResponse(raw)).toBe(true);
    });

    it('возвращает false, если нет валидных ключей', () => {
        const raw = { nope: 1 };
        expect(validateServerResponse(raw)).toBe(false);
    });

    it('кидает ошибку при null значениях', () => {
        const validKey = Object.keys(HIGHLIGHT_TITLES)[0];
        const raw = { [validKey]: null };
        // @ts-ignore
        expect(() => validateServerResponse(raw)).toThrow(InvalidServerResponseError);
    });
});

describe('transformAnalysisData', () => {
    it('парсит и преобразует корректный потоковый ответ', () => {
        const rows = 3;
        const validKey = Object.keys(HIGHLIGHT_TITLES)[0];
        const rawData = { rows_affected: rows, [validKey]: 'val', numKey: 5 };
        const input = encode(rawData);

        const { highlights, highlightsToStore } = transformAnalysisData(input);
        expect(highlights).toEqual({ [validKey]: 'val', numKey: 5 });

        expect(highlightsToStore).toEqual([
            {
                title: 'val',
                description: HIGHLIGHT_TITLES[validKey],
            },
            {
                title: '5',
                description: HIGHLIGHT_TITLES['numKey'] ?? 'Неизвестный параметр',
            },
        ]);
    });

    it('кидает InvalidServerResponseError для некорректного ответа', () => {
        const input = encode({ bad: 'data' });
        expect(() => transformAnalysisData(input)).toThrow(InvalidServerResponseError);
    });
});
