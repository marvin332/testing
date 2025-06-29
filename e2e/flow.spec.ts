import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('полный предполагаемый алгоритм действий пользователя', async ({ page }) => {
    await page.goto('/');

    const filePath = resolve(__dirname, 'fixtures', 'test.csv');
    await page.setInputFiles('input[type="file"]', filePath);
    await page.getByRole('button', { name: /отправить/i }).click();
    await expect(page.getByText(/готово/i)).toBeVisible();
    await expect(page.getByText(/Аналитика|highlights|хайлайты/i)).toBeVisible();

    await page.getByRole('link', { name: /история/i }).click();
    await expect(page.getByText('test.csv')).toBeVisible();

    if (await page.getByRole('button', { name: /очистить/i }).isVisible()) {
        await page.getByRole('button', { name: /очистить/i }).click();
        await expect(page.locator('text=test1.csv')).not.toBeVisible();
    }

    await page.getByRole('link', { name: /генератор/i }).click();
    await expect(page.getByRole('button', { name: /начать генерацию/i })).toBeVisible();
});
