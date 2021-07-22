/**
 * Create DNS Record Action for GitHub
 * https://github.com/marketplace/actions/create-dns-record
 */

const cp = require("child_process");

const event = require(process.env.GITHUB_EVENT_PATH);
const pr = event.pull_request ? event.pull_request.number : "?";

let res;
let result;
let id = process.env.INPUT_ID;
let perPage = process.env.PER_PAGE ? process.env.PER_PAGE : "100";

if (!id) {
  result = cp.spawnSync("curl", [
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    `https://api.cloudflare.com/client/v4/zones/${process.env.INPUT_ZONE}/dns_records?per_page=${perPage}`,
  ]);

  if (result.status !== 0) {
    process.exit(result.status);
  }

  res = JSON.parse(result.stdout.toString());

  if (!res.success) {
    console.log(`::error ::${res.errors[0].message}`);
    process.exit(1);
  }

  const name = (process.env.INPUT_NAME || "")
    .replace(/\{pr\}/gi, pr)
    .replace(/\{pr_number\}/gi, pr)
    .replace(/\{head_ref\}/gi, process.env.GITHUB_HEAD_REF);
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
