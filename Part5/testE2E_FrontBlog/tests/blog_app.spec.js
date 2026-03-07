import { test, expect, beforeEach, describe, request } from "@playwright/test";
import { text } from "node:stream/consumers";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const locatorUser = page.getByText("username");
    const locatorPass = page.getByText("password");
    const locatorButton = page.getByRole("button", { name: "login" });

    await expect(locatorButton).toBeVisible();
    await expect(locatorUser).toBeVisible();
    await expect(locatorPass).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("mluukkai");
      await page.getByRole("textbox").last().fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("mluukkai");
      await page.getByRole("textbox").last().fill("wrong");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });
});

describe("When logged in", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await page.goto("http://localhost:5173");
    await page.getByRole("textbox").first().fill("mluukkai");
    await page.getByRole("textbox").last().fill("salainen");
    await page.getByRole("button", { name: "login" }).click();
  });

  test("A blog can be created", async ({ page }) => {
    await page.getByRole("button", { name: "create new blog" }).click();
    const textboxes = await page.getByRole("textbox").all();
    await textboxes[0].fill("Testing with Playwright");
    await textboxes[1].fill("Playwright");
    await textboxes[2].fill("https://playwright.dev/");
    await page.getByRole("button", { name: "create" }).click();
    const text = page.getByTestId("blog-title-author");
    await expect(text).toBeVisible();
  });

  test("A blog can be edited", async ({ page }) => {
    await page.getByRole("button", { name: "create new blog" }).click();
    const textboxes = await page.getByRole("textbox").all();
    await textboxes[0].fill("Initial Blog");
    await textboxes[1].fill("Initial author");
    await textboxes[2].fill("https://example.com");
    await page.getByRole("button", { name: "create" }).click();

    const viewButton = await page.getByRole("button", { name: "view" });
    await viewButton.click();
    const editButton = await page.getByRole("button", { name: "Edit" });
    await editButton.click();
    const editTextboxes = await page.getByRole("textbox").all();
    await editTextboxes[0].fill("Updated Blog");
    await editTextboxes[1].fill("Updated author");
    await editTextboxes[2].fill("https://updated.com");
    await page.getByRole("button", { name: "save" }).click();

    const titleLocator = page.locator("text=Updated Blog").first();
    await expect(titleLocator).toBeVisible();
  });

  test("A user who created a blog can delete it", async ({ page }) => {
    await page.getByRole("button", { name: "create new blog" }).click();
    const textboxes = await page.getByRole("textbox").all();
    await textboxes[0].fill("Blog to Delete");
    await textboxes[1].fill("Initial author");
    await textboxes[2].fill("https://example.com");
    await page.getByRole("button", { name: "create" }).click();

    const viewButton = await page.getByRole("button", { name: "view" });
    await viewButton.click();
    page.once("dialog", (d) => d.accept());
    const removeButton = await page.getByRole("button", { name: "Remove" });
    await removeButton.click();

    await expect(page.locator("text=Blog to Delete")).toHaveCount(1);
  });

  test('Only the creator can see the delete button', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    const textboxes = await page.getByRole('textbox').all()
    await textboxes[0].fill('Blog to Delete')
    await textboxes[1].fill('Delete Title')
    await textboxes[2].fill('https://delete.example.com')
    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('button', { name: 'logout' }).click()
    await page.getByRole('textbox').first().fill('anotheruser')
    await page.getByRole('textbox').last().fill('password')
    await page.getByRole('button', { name: 'login' }).click()

    const deleteButton = await page.locator('text=Delete').first()
    await expect(deleteButton).not.toBeVisible()
  })

test('Blogs are ordered by likes', async ({ page }) => {
  
  await page.getByRole('button', { name: 'create new blog' }).click();
  const inputs1 = await page.getByRole('textbox').all();
  await inputs1[0].fill('Blog with 1 like');
  await inputs1[1].fill('Title 1');
  await inputs1[2].fill('https://example.com/1');
  await page.getByRole('button', { name: 'create' }).click();

    const card1 = page.locator('.blog', { hasText: 'Blog with 1 like' }).first();
  await card1.getByRole('button', { name: 'view' }).click();
  await card1.getByRole('button', { name: 'like' }).click();

  await page.getByRole('button', { name: 'create new blog' }).click();
  const inputs2 = await page.getByRole('textbox').all();
  await inputs2[0].fill('Blog with 2 likes');
  await inputs2[1].fill('Title 2');
  await inputs2[2].fill('https://example.com/2');
  await page.getByRole('button', { name: 'create' }).click();

  const blogs = page.getByTestId('blog');
  await expect(blogs).toHaveCount(2);

  const card2 = page.locator('.blog', { hasText: 'Blog with 2 likes' }).first();
  await card2.getByRole('button', { name: 'view' }).click();
  await new Promise(resolve => setTimeout(resolve, 300)); 
  await card2.getByRole('button', { name: 'like' }).click();
  await new Promise(resolve => setTimeout(resolve, 300)); 
  await card2.getByRole('button', { name: 'like' }).click();

  await expect(page.getByTestId('blog').first()).toContainText('Blog with 2 likes');
  await expect(page.getByTestId('blog').nth(1)).toContainText('Blog with 1 like');
});
});
