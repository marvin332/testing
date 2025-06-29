import { STORAGE_KEY } from '@utils/consts.ts';
import { addToHistory, clearHistory, getHistory, removeFromHistory } from '@utils/storage/storage.ts';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('storage functions', () => {
    let call = 0;
    const uuids = ['00000-00000-00000-00000-00001', '00000-00000-00000-00000-00002'];

    beforeEach(() => {
        localStorage.clear();
        call = 0;

        // @ts-ignore
        vi.spyOn(crypto, 'randomUUID').mockImplementation(() => uuids[call++]);

        vi.spyOn(Date, 'now').mockReturnValue(1672531200000);
    });

    it('getHistory возвращает пустой массив, если нет данных', () => {
        expect(getHistory()).toEqual([]);
    });

    it('addToHistory сохраняет элемент и возвращает новый объект с id и timestamp', () => {
        const newItem = addToHistory({ fileName: 'file.csv' });
        expect(newItem).toEqual({
            id: uuids[0],
            timestamp: 1672531200000,
            fileName: 'file.csv',
        });

        const raw = localStorage.getItem(STORAGE_KEY);
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(parsed).toEqual([newItem]);
    });

    it('getHistory возвращает добавленные элементы в правильном порядке', () => {
        const first = addToHistory({ fileName: 'first.csv' });
        const second = addToHistory({ fileName: 'second.csv' });

        const history = getHistory();
        expect(history).toEqual([second, first]);
    });

    it('removeFromHistory удаляет только указанный элемент по id', () => {
        const first = addToHistory({ fileName: 'one.csv' });
        const second = addToHistory({ fileName: 'two.csv' });

        removeFromHistory(first.id);
        expect(getHistory()).toEqual([second]);
    });

    it('removeFromHistory не ломается при несуществующем id', () => {
        addToHistory({ fileName: 'file.csv' });
        expect(() => removeFromHistory('non-existent')).not.toThrow();
        expect(getHistory()).toHaveLength(1);
    });

    it('clearHistory очищает все данные', () => {
        addToHistory({ fileName: 'file.csv' });
        clearHistory();
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(getHistory()).toEqual([]);
    });

    it('getHistory корректно обрабатывает некорректный JSON', () => {
        localStorage.setItem(STORAGE_KEY, '{ invalid json');
        expect(getHistory()).toEqual([]);
    });
});
