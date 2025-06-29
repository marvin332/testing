import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));

test.describe('nav bar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Отображаются все навигационные ссылки', async ({ page }) => {
        await expect(page.getByRole('link', { name: /csv аналитик/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /csv генератор/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /история/i })).toBeVisible();
    });

    test('активная ссылка выделятся', async ({ page }) => {
        const csvAnalystLink = page.getByRole('link', { name: /csv аналитик/i });
        await expect(csvAnalystLink).toHaveClass(/active/);

        const csvGeneratorLink = page.getByRole('link', { name: /csv генератор/i });
        const historyLink = page.getByRole('link', { name: /история/i });

        await expect(csvGeneratorLink).not.toHaveClass(/active/);
        await expect(historyLink).not.toHaveClass(/active/);
    });

    test('переход на страницу генератора', async ({ page }) => {
        await page.getByRole('link', { name: /csv генератор/i }).click();

        await expect(page).toHaveURL(/.*\/generate/);

        const csvGeneratorLink = page.getByRole('link', { name: /csv генератор/i });
        await expect(csvGeneratorLink).toHaveClass(/active/);

        await expect(page.getByRole('button', { name: /начать генерацию/i })).toBeVisible();
    });

    test('переход на страницу истории', async ({ page }) => {
        await page.getByRole('link', { name: /история/i }).click();

        await expect(page).toHaveURL(/.*\/history/);

        const historyLink = page.getByRole('link', { name: /история/i });
        await expect(historyLink).toHaveClass(/active/);

        await expect(page.getByText(/история/i)).toBeVisible();
    });

    test('возврат на главную страницу', async ({ page }) => {
        await page.getByRole('link', { name: /csv генератор/i }).click();
        await expect(page).toHaveURL(/.*\/generate/);

        await page.getByRole('link', { name: /csv аналитик/i }).click();

        await expect(page).toHaveURL(/.*\/$/);

        const csvAnalystLink = page.getByRole('link', { name: /csv аналитик/i });
        await expect(csvAnalystLink).toHaveClass(/active/);

        await expect(page.getByText(/загрузить/i)).toBeVisible();
    });

    test('навигация между всеми разделами', async ({ page }) => {
        await page.getByRole('link', { name: /csv генератор/i }).click();
        await expect(page).toHaveURL(/.*\/generate/);
        await expect(page.getByRole('link', { name: /csv генератор/i })).toHaveClass(/active/);

        await page.getByRole('link', { name: /история/i }).click();
        await expect(page).toHaveURL(/.*\/history/);
        await expect(page.getByRole('link', { name: /история/i })).toHaveClass(/active/);

        await page.getByRole('link', { name: /csv аналитик/i }).click();
        await expect(page).toHaveURL(/.*\/$/);
        await expect(page.getByRole('link', { name: /csv аналитик/i })).toHaveClass(/active/);

        await page.getByRole('link', { name: /история/i }).click();
        await expect(page).toHaveURL(/.*\/history/);
        await expect(page.getByRole('link', { name: /история/i })).toHaveClass(/active/);

        await page.getByRole('link', { name: /csv генератор/i }).click();
        await expect(page).toHaveURL(/.*\/generate/);
        await expect(page.getByRole('link', { name: /csv генератор/i })).toHaveClass(/active/);
    });

    test('навигация работает после загрузки файла', async ({ page }) => {
        const filePath = resolve(__dirname, 'fixtures', 'test.csv');
        await page.setInputFiles('input[type="file"]', filePath);
        await page.getByRole('button', { name: /отправить/i }).click();
        await expect(page.getByText(/готово/i)).toBeVisible();

        await page.getByRole('link', { name: /csv генератор/i }).click();
        await expect(page).toHaveURL(/.*\/generate/);

        await page.getByRole('link', { name: /история/i }).click();
        await expect(page).toHaveURL(/.*\/history/);

        await page.getByRole('link', { name: /csv аналитик/i }).click();
        await expect(page).toHaveURL(/.*\/$/);
    });
});
