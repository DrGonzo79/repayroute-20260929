import {expect,test} from "@playwright/test";

test("generates a route brief and exposes the method", async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Generate my route brief"}).click();
  await expect(page.getByRole("heading",{name:"Prepare for a possible payment jump"})).toBeVisible();
  await expect(page.getByText("$523")).toBeVisible();
  await expect(page.getByText("$338 more than the entered current payment")).toBeVisible();
  await page.getByRole("button",{name:"How the estimate works"}).click();
  await expect(page.getByText(/amortizes the entered balance/)).toBeVisible();
});

test("switches demo borrower and saves a session brief",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Jordan"}).click();
  await expect(page.getByLabel("Adjusted gross income")).toHaveValue("78000");
  await page.getByRole("button",{name:"Generate my route brief"}).click();
  await page.getByRole("button",{name:"Save this demo brief"}).click();
  await expect(page.getByRole("button",{name:"Brief saved for this session"})).toBeVisible();
});

test("validates invalid financial inputs",async({page})=>{
  await page.goto("/");
  await page.getByLabel("Federal loan balance").fill("0");
  await page.getByRole("button",{name:"Generate my route brief"}).click();
  await expect(page.getByText(/Check the highlighted numbers/)).toBeVisible();
});

test("mobile layout has no horizontal overflow",async({page},testInfo)=>{
  test.skip(!testInfo.project.name.includes("mobile"),"mobile-only assertion");
  await page.goto("/");
  await page.getByRole("button",{name:"Generate my route brief"}).click();
  await expect(page.getByRole("heading",{name:"Prepare for a possible payment jump"})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
