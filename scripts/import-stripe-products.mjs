import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const csvFileName = "apex_wellness_stripe_product_import.csv";
const expectedSearchPaths = [
  path.join(projectRoot, csvFileName),
  path.join(projectRoot, "scripts", csvFileName),
  path.join(projectRoot, "data", csvFileName),
  path.join(projectRoot, "imports", csvFileName),
  path.join(projectRoot, "public", csvFileName),
];
const downloadsPath = path.join(
  process.env.USERPROFILE ?? "C:\\Users\\Sdcon",
  "Downloads",
  csvFileName,
);

function parseArgs(argv) {
  const args = {
    dryRun: false,
    liveConfirm: false,
    csvPath: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--live-confirm") {
      args.liveConfirm = true;
    } else if (arg === "--csv") {
      args.csvPath = argv[index + 1] ?? "";
      index += 1;
    } else if (arg.startsWith("--csv=")) {
      args.csvPath = arg.slice("--csv=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function loadEnv() {
  for (const fileName of [".env.local", ".env"]) {
    const envPath = path.join(projectRoot, fileName);
    if (!fs.existsSync(envPath)) {
      continue;
    }

    const parsed = dotenv.parse(fs.readFileSync(envPath));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

function resolveCsvPath(csvPathArg) {
  if (csvPathArg) {
    const explicitPath = path.resolve(projectRoot, csvPathArg);
    if (!fs.existsSync(explicitPath)) {
      throw new Error(`CSV file was not found at: ${explicitPath}`);
    }
    return explicitPath;
  }

  for (const candidate of [...expectedSearchPaths, downloadsPath]) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    [
      `CSV file "${csvFileName}" was not found.`,
      "Place it in one of these locations and rerun the command:",
      ...expectedSearchPaths.map((candidate) => `- ${candidate}`),
      `- ${downloadsPath}`,
    ].join("\n"),
  );
}

function normalizeBoolean(value, fallback = true) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) {
    return fallback;
  }
  if (["true", "1", "yes", "y", "active"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "n", "inactive"].includes(normalized)) {
    return false;
  }
  return null;
}

function cleanString(value) {
  return String(value ?? "").trim();
}

function metadataFromRow(row, extra = {}) {
  const keys = [
    "stripe_product_id",
    "sku",
    "category",
    "strength",
    "size",
    "availability_status",
    "preorder",
    "fulfillment_window",
    "referral_review_required",
    "source_url",
    "notes",
  ];
  const metadata = {
    imported_from: "apex_wellness_stripe_product_import.csv",
    ...extra,
  };

  for (const key of keys) {
    const value = cleanString(row[key]);
    if (value) {
      metadata[key] = value.slice(0, 500);
    }
  }

  return metadata;
}

function productKey(row) {
  return cleanString(row.stripe_product_id) || cleanString(row.product_name);
}

function validateRows(rows, headers) {
  const errors = [];
  const requiredHeaders = [
    "product_name",
    "stripe_price_lookup_key",
    "price_nickname",
    "unit_amount_cents",
  ];

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      errors.push(`Missing required CSV header: ${header}`);
    }
  }

  const seenLookupKeys = new Set();
  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    for (const field of requiredHeaders) {
      if (!cleanString(row[field])) {
        errors.push(`Row ${rowNumber}: missing required field "${field}".`);
      }
    }

    const active = normalizeBoolean(row.product_active, true);
    if (active === null) {
      errors.push(`Row ${rowNumber}: product_active must be TRUE or FALSE when provided.`);
    }

    const amount = Number(cleanString(row.unit_amount_cents));
    if (!Number.isInteger(amount) || amount <= 0) {
      errors.push(`Row ${rowNumber}: unit_amount_cents must be a positive integer.`);
    }

    const lookupKey = cleanString(row.stripe_price_lookup_key);
    if (lookupKey && seenLookupKeys.has(lookupKey)) {
      errors.push(`Row ${rowNumber}: duplicate stripe_price_lookup_key "${lookupKey}" in CSV.`);
    }
    seenLookupKeys.add(lookupKey);

    const recurringInterval = cleanString(row.recurring_interval);
    if (recurringInterval) {
      errors.push(`Row ${rowNumber}: recurring_interval must be empty for one-time prices.`);
    }

    const taxBehavior = cleanString(row.tax_behavior);
    if (taxBehavior && !["inclusive", "exclusive", "unspecified"].includes(taxBehavior)) {
      errors.push(
        `Row ${rowNumber}: tax_behavior must be inclusive, exclusive, or unspecified when provided.`,
      );
    }
  });

  const productRows = new Map();
  for (const row of rows) {
    const key = productKey(row);
    if (!key) {
      continue;
    }

    const existing = productRows.get(key);
    if (!existing) {
      productRows.set(key, row);
      continue;
    }

    for (const field of ["product_name", "product_description", "product_active", "product_tax_code"]) {
      if (cleanString(existing[field]) !== cleanString(row[field])) {
        errors.push(`Product "${key}" has inconsistent "${field}" values across rows.`);
      }
    }
  }

  return errors;
}

async function getExistingProduct(stripe, productId) {
  if (!productId) {
    return null;
  }

  try {
    return await stripe.products.retrieve(productId);
  } catch (error) {
    if (error?.code === "resource_missing") {
      return null;
    }
    throw error;
  }
}

async function getExistingPrice(stripe, lookupKey) {
  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    limit: 1,
  });

  return prices.data[0] ?? null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  loadEnv();

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing. Add a Stripe test secret key to .env.local before running the import.",
    );
  }
  if (secretKey.startsWith("sk_live") && !args.liveConfirm) {
    throw new Error(
      "Refusing to run with a live Stripe key. Rerun with --live-confirm only after test mode has been reviewed.",
    );
  }

  const csvPath = resolveCsvPath(args.csvPath);
  const csvContent = fs.readFileSync(csvPath, "utf8");
  const rows = parse(csvContent, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    trim: true,
  });
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const validationErrors = validateRows(rows, headers);

  console.log(`Stripe product import (${args.dryRun ? "dry run" : "write mode"})`);
  console.log(`Mode: ${secretKey.startsWith("sk_live") ? "live" : "test"}`);
  console.log(`CSV: ${csvPath}`);
  console.log(`Rows: ${rows.length}`);
  console.log(`Headers: ${headers.join(", ")}`);

  if (validationErrors.length) {
    console.log("\nValidation failed:");
    for (const error of validationErrors) {
      console.log(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  const stripe = new Stripe(secretKey);
  const grouped = new Map();
  for (const row of rows) {
    const key = productKey(row);
    const current = grouped.get(key) ?? [];
    current.push(row);
    grouped.set(key, current);
  }

  const summary = {
    productsCreated: [],
    productsUpdated: [],
    pricesCreated: [],
    pricesSkipped: [],
  };

  for (const [key, productRows] of grouped.entries()) {
    const productRow = productRows[0];
    const productId = cleanString(productRow.stripe_product_id);
    const active = normalizeBoolean(productRow.product_active, true) ?? true;
    const productParams = {
      name: cleanString(productRow.product_name),
      description: cleanString(productRow.product_description) || undefined,
      active,
      tax_code: cleanString(productRow.product_tax_code) || undefined,
      metadata: metadataFromRow(productRow, {
        product_import_key: key,
        variant_count: String(productRows.length),
      }),
    };

    let stripeProduct = await getExistingProduct(stripe, productId);
    if (stripeProduct) {
      summary.productsUpdated.push(`${stripeProduct.id} (${productParams.name})`);
      if (!args.dryRun) {
        stripeProduct = await stripe.products.update(stripeProduct.id, productParams);
      }
    } else {
      const createParams = productId ? { id: productId, ...productParams } : productParams;
      summary.productsCreated.push(`${productId || "(new Stripe id)"} (${productParams.name})`);
      if (!args.dryRun) {
        stripeProduct = await stripe.products.create(createParams);
      } else {
        stripeProduct = { id: productId || `dry_run_${key}` };
      }
    }

    for (const row of productRows) {
      const lookupKey = cleanString(row.stripe_price_lookup_key);
      const existingPrice = await getExistingPrice(stripe, lookupKey);
      if (existingPrice) {
        summary.pricesSkipped.push(`${lookupKey} (${existingPrice.id})`);
        continue;
      }

      const priceParams = {
        product: stripeProduct.id,
        lookup_key: lookupKey,
        nickname: cleanString(row.price_nickname),
        currency: (cleanString(row.currency) || "usd").toLowerCase(),
        unit_amount: Number(cleanString(row.unit_amount_cents)),
        tax_behavior: cleanString(row.tax_behavior) || undefined,
        metadata: metadataFromRow(row, {
          product_name: cleanString(row.product_name),
          price_nickname: cleanString(row.price_nickname),
        }),
      };

      summary.pricesCreated.push(`${lookupKey} (${priceParams.currency} ${priceParams.unit_amount})`);
      if (!args.dryRun) {
        await stripe.prices.create(priceParams);
      }
    }
  }

  console.log("\nSummary:");
  console.log(`Products created: ${summary.productsCreated.length}`);
  for (const item of summary.productsCreated) console.log(`- ${item}`);
  console.log(`Products updated: ${summary.productsUpdated.length}`);
  for (const item of summary.productsUpdated) console.log(`- ${item}`);
  console.log(`Prices created: ${summary.pricesCreated.length}`);
  for (const item of summary.pricesCreated) console.log(`- ${item}`);
  console.log(`Prices skipped: ${summary.pricesSkipped.length}`);
  for (const item of summary.pricesSkipped) console.log(`- ${item}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unexpected import failure.");
  process.exitCode = 1;
});
