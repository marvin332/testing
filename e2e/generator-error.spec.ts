import { test, expect } from '@playwright/test';

test('возможное исключение при генерации файла', async ({ page }) => {
    await page.goto('/generate');

    await page.route('**/report?size=*', (route) =>
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'fail' }) })
    );
    await page.getByRole('button', { name: /начать генерацию/i }).click();
    await expect(page.getByText(/произошла ошибка/i)).toBeVisible();
});
