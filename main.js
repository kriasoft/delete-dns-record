/**
 * Create DNS Record Action for GitHub
 * https://github.com/marketplace/actions/create-dns-record
 */

const cp = require("child_process");

let res;
let result;
let id = process.env.INPUT_ID;

if (!id) {
  result = cp.spawnSync("curl", [
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    `https://api.cloudflare.com/client/v4/zones/${process.env.INPUT_ZONE}/dns_records`,
  ]);

  if (result.status !== 0) {
    process.exit(result.status);
  }

  res = JSON.parse(result.stdout.toString());

  if (!res.success) {
    console.log(`::error ::${res.errors[0].message}`);
    process.exit(1);
  }

  const name = process.env.INPUT_NAME;
  const record = res.result.find((x) => x.name === name);

  if (!record) {
    console.log('::error ::Cannot find "${name}" record.');
    process.exit(1);
  }

  id = record.id;
}

if (!id) {
  console.log(`::error ::DNS record ID or record name is required.`);
  process.exit(1);
}

// https://api.cloudflare.com/#dns-records-for-a-zone-delete-dns-record
result = cp.spawnSync("curl", [
  ...["--silent", "--request", "DELETE"],
  ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
  ...["--header", "Content-Type: application/json"],
  `https://api.cloudflare.com/client/v4/zones/${process.env.INPUT_ZONE}/dns_records/${id}`,
]);

if (result.status !== 0) {
  process.exit(result.status);
}

res = JSON.parse(result.stdout.toString());

if (!res.success) {
  console.log(`::error ::${res.errors[0].message}`);
  process.exit(1);
}

console.dir(res.result);
