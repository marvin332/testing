import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest';

import { GeneratePage } from './GeneratePage';

beforeAll(() => {
    vi.stubGlobal('URL', {
        createObjectURL: vi.fn(),
        revokeObjectURL: vi.fn(),
    });
});

beforeEach(() => {
    const fetchMock = vi.fn(() =>
        Promise.resolve({
            ok: true,
            headers: { get: () => 'attachment; filename="report.csv"' },
            blob: () => Promise.resolve(new Blob(['test'], { type: 'text/csv' })),
        })
    );
    vi.stubGlobal('fetch', fetchMock);
});

describe('GeneratePage', () => {
    test('рендер сообщения об успехе после генерации', async () => {
        render(<GeneratePage />);
        fireEvent.click(screen.getByRole('button', { name: /начать генерацию/i }));
        await waitFor(() => {
            expect(screen.getByText((content) => /отч[её]т.*сгенерирован/i.test(content))).toBeInTheDocument();
        });
    });

    test('рендер ошибки при неудаче', async () => {
        const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'fail' }),
            })
        );

        render(<GeneratePage />);
        fireEvent.click(screen.getByRole('button', { name: /начать генерацию/i }));
        await waitFor(() => expect(screen.getByText(/произошла ошибка/i)).toBeInTheDocument());
    });

    test('disable кнопки во время генерации', async () => {
        let resolvePromise!: (value: unknown) => void;
        const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
        fetchMock.mockImplementationOnce(
            () =>
                new Promise((r) => {
                    resolvePromise = r;
                })
        );

        render(<GeneratePage />);
        fireEvent.click(screen.getByRole('button', { name: /начать генерацию/i }));

        expect(screen.getByRole('button')).toBeDisabled();

        resolvePromise({
            ok: true,
            headers: { get: () => '' },
            blob: () => Promise.resolve(new Blob()),
        });
    });
});
