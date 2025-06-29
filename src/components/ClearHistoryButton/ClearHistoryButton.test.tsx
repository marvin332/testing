import { ClearHistoryButton } from '@components/ClearHistoryButton/ClearHistoryButton.tsx';
import { render, fireEvent, screen } from '@testing-library/react';
import * as storage from '@utils/storage/storage.ts';
import { vi, beforeEach, describe, expect, test } from 'vitest';

describe('ClearHistoryButton', () => {
    vi.mock('@store/historyStore.ts', () => ({
        useHistoryStore: () => ({
            clearHistory: vi.fn(),
            history: [{ id: '1', fileName: 'file.csv', timestamp: Date.now(), highlights: [{}] }],
        }),
    }));
    vi.mock('@utils/storage', () => {
        return {
            clearHistory: vi.fn(),
        };
    });
    beforeEach(() => {
        vi.spyOn(storage, 'clearHistory').mockImplementation(() => {});
    });
    test('При клике должна вызываться функция очистки истории', () => {
        render(<ClearHistoryButton />);
        const button = screen.getByText('Очистить всё');
        fireEvent.click(button);
        expect(storage.clearHistory).toHaveBeenCalled();
    });
});
