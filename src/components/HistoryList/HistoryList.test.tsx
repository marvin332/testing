import { useHistoryStore } from '@store/historyStore.ts';
import { render, screen } from '@testing-library/react';
import { describe, test, beforeEach, expect, vi } from 'vitest';

import { HistoryList } from './HistoryList';

import '@testing-library/jest-dom';

// Приводим useHistoryStore к типу мок-функции Vitest
type VitestMock = ReturnType<typeof vi.fn>;
const useHistoryStoreMock = useHistoryStore as unknown as VitestMock;

vi.mock('@store/historyStore.ts', async () => {
    const actual = (await vi.importActual('@store/historyStore.ts')) as any;
    return {
        ...actual,
        useHistoryStore: vi.fn(),
    };
});

describe('HistoryList', () => {
    beforeEach(() => {
        useHistoryStoreMock.mockReturnValue({
            history: [{ id: '1', fileName: 'file.csv', timestamp: Date.now(), highlights: [{}] }],
            showModal: vi.fn(),
            setSelectedItem: vi.fn(),
            removeFromHistoryStore: vi.fn(),
            updateHistoryFromStorage: vi.fn(),
        });
    });

    test('не отображает элемент, если история пуста', () => {
        useHistoryStoreMock.mockReturnValue({
            history: [],
            showModal: vi.fn(),
            setSelectedItem: vi.fn(),
            removeFromHistoryStore: vi.fn(),
            updateHistoryFromStorage: vi.fn(),
        });
        render(<HistoryList />);
        expect(screen.queryByText(/file\.csv/i)).toBeNull();
    });
});
