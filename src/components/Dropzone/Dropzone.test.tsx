import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';

import { Dropzone } from './Dropzone';

describe('Dropzone', () => {
    test('При выборе файла должен вызываться onFileSelect', () => {
        const onFileSelect = vi.fn();
        const { container } = render(
            <Dropzone file={null} status="idle" error={null} onFileSelect={onFileSelect} onClear={vi.fn()} />
        );
        const input = container.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();
        fireEvent.change(input!, {
            target: { files: [new File(['test'], 'test.csv', { type: 'text/csv' })] },
        });

        expect(onFileSelect).toHaveBeenCalled();
    });

    test('Отображает ошибку при попытке загрузить файл не в формате CSV', () => {
        const onFileSelect = vi.fn();
        render(<Dropzone file={null} status="idle" error={'Ошибка'} onFileSelect={onFileSelect} onClear={vi.fn()} />);
        expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
    });

    test('Показывает индикатор загрузки, когда status равен "processing"', () => {
        render(<Dropzone file={null} status="processing" error={null} onFileSelect={vi.fn()} onClear={vi.fn()} />);
        expect(screen.getByText(/идёт парсинг файла/i)).toBeInTheDocument();
    });

    test('Отображает статус «Готово!», когда status равен "completed"', () => {
        render(
            <Dropzone
                file={new File([''], 'test.csv')}
                status="completed"
                error={null}
                onFileSelect={vi.fn()}
                onClear={vi.fn()}
            />
        );
        expect(screen.getByText(/готово!/i)).toBeInTheDocument();
    });
});
