import { test } from "@playwright/test";
import { createAsset } from "../pages/createAsset";

test("Asset Created successfully", async ({ page }) => {
  const createssset = new createAsset(page);

  await createssset.navigate();
  await createssset.login("admin", "password");
  await createssset.createasset();
  await createssset.verifyCreatedAsset();
});
