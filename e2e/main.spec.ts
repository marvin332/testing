import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('Пользователь может загрузить файл, после чего он отображается в истории', async ({ page }) => {
    await page.goto('/');

    const filePath = resolve(__dirname, 'fixtures', 'test.csv');
    await page.setInputFiles('input[type="file"]', filePath);

    await expect(page.getByText('Аналитика')).toBeVisible();

    await expect(page.getByText('test.csv')).toBeVisible();
});
