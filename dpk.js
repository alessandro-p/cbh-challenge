const crypto = require("crypto");


exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  const candidate = event.partitionKey ?
    event.partitionKey :
    _getHashHexValue(JSON.stringify(event));

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = _getHashHexValue(candidate);
  }

  return typeof candidate !== "string" ?
    JSON.stringify(candidate) :
    candidate;
};

function _getHashHexValue(value) {
  return crypto.createHash("sha3-512").update(value).digest("hex");
}
