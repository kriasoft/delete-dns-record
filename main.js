/**
 * Delete Cloudflare DNS Record Action for GitHub
 * https://github.com/marketplace/actions/cloudflare-delete-dns-record
 */

const cp = require("child_process");

const getCurrentRecordId = () => {
  //https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    `https://api.cloudflare.com/client/v4/zones/${process.env.INPUT_ZONE}/dns_records?name=${process.env.INPUT_NAME}`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const { success, result, errors } = JSON.parse(stdout.toString());

  if (!success) {
    console.log(`::error ::${errors[0].message}`);
    process.exit(1);
  }

  const name = process.env.INPUT_NAME;
  const record = result.find((x) => x.name === name);

  if (!record) {
    return null
  }

  return record.id;
};

const deleteRecord = (id) => {
  // https://api.cloudflare.com/#dns-records-for-a-zone-delete-dns-record
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--silent", "--request", "DELETE"],
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    `https://api.cloudflare.com/client/v4/zones/${process.env.INPUT_ZONE}/dns_records/${id}`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const { success, result, errors } = JSON.parse(stdout.toString());

  if (!success) {
    console.log(`::error ::${errors[0].message}`);
    process.exit(1);
  }
};

const id = process.env.INPUT_ID || getCurrentRecordId();
if (!id) {
  console.log("Record doesn't exist. Nothing to delete.");
  process.exit(0);
}
deleteRecord(id);


