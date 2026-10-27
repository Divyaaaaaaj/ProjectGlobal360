import { expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class createAsset {
  constructor(private page: Page) {}

  public AssetTag: string = "";
  public SerialNumber: string = "";
  public Company: string = "";
  public SelectedUser: string = "";

  async navigate() {
    await this.page.goto("https://demo.snipeitapp.com/login");
  }

  async login(username: string, password: string) {
    await this.page.locator("#username").fill(username);
    await this.page.locator("#password-field").fill(password);
    await this.page.locator("#submit").click();
    await this.page.waitForTimeout(5000);
    await expect(this.page.locator("#success-notification")).toContainText(
      "You have successfully logged in.",
    );
     await expect(this.page.locator("h1.pagetitle")).toHaveText("Dashboard");
  }

  async createasset() {
    await this.page.getByRole("link", { name: "Assets view all" }).click();
    await this.page.getByRole("button", { name: "+" }).click();
    // await this.page.waitForTimeout(3000);
    await this.page.getByText("Select Company").click();
    const companyOptions = this.page.locator("li.select2-results__option");
    const companies = await companyOptions.allTextContents();
    companies.forEach((company, index) => {
    });

    this.Company = (await companyOptions.first().textContent())?.trim() || "";
    await companyOptions.first().click();
    this.AssetTag = faker.string.alphanumeric(16);
    await this.page
      .getByRole("textbox", { name: "Asset Tag", exact: true })
      .fill(this.AssetTag);
    this.SerialNumber = faker.string.alphanumeric(10);
    await this.page.locator("#serial_1").fill(this.SerialNumber);
    await this.page.locator("#select2-model_select_id-container").click();
    await this.page
      .locator(".select2-container--open .select2-search__field")
      .fill("Macbook");
    // await this.page.waitForTimeout(2000);
    const options = await this.page
      .locator("li.select2-results__option")
      .allTextContents();
    await this.page
      .locator("li.select2-results__option")
      .filter({ hasText: "Macbook Pro 13" })
      .click();
    await this.page.locator("#select2-status_select_id-container").click();
    await this.page.getByRole("option", { name: "Ready to Deploy" }).click();
    // await this.page.waitForTimeout(5000);
    await this.page.locator("#submit_button").click();
    await expect(this.page.locator("#success-notification")).toContainText(
      `Asset with tag ${this.AssetTag} was created successfully`,
    );
  }

  async verifyCreatedAsset() {
    await this.page.getByRole("button", { name: "Refresh" }).click();
    await this.page.locator("input.search-input").fill(this.AssetTag);
    await this.page.locator("input.search-input").press("Enter");
    const rows = this.page.locator("tbody tr");
    await expect(rows).toHaveCount(1);
    const row = this.page.locator("tbody tr").first();
    await expect(row).toContainText(this.AssetTag);
    await expect(
      this.page.locator('a[data-original-title="deployable"]'),
    ).toContainText("Ready to Deploy");
    await this.page.getByRole("link", { name: "Checkout" }).click();
    await expect(
      this.page.getByRole("heading", { name: `Asset Tag ${this.AssetTag}` }),
    ).toBeVisible();
    await this.page.locator("#select2-assigned_user_select-container").click();
    const userOptions = this.page.locator(
      'li.select2-results__option[role="option"]',
    );
    const count = await userOptions.count();
    for (let i = 0; i < count; i++) {
      console.log(await userOptions.nth(i).textContent());
    }
    await userOptions.nth(0).click();
    const submitButton = this.page.locator("#submit_button");
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    await expect(this.page.locator(".alert-success")).toContainText(
      "Asset checked out successfully.",
    );
  }
}
