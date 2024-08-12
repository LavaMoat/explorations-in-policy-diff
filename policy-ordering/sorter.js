const file = process.argv[2];
const policy = require(file || "./policy.json");

const { writeFileSync } = require("fs");

// Sort resources by key
policy.resources = Object.fromEntries(
  Object.entries(policy.resources)
    .sort((a, b) => reverseKey(a[0]).localeCompare(reverseKey(b[0])))
);

writeFileSync(
  "./policy_reordered.json",
  JSON.stringify(policy, null, 2)
);

policy.resources = Object.fromEntries(
  Object.entries(policy.resources)
    .map(([key, value]) => [
      reverseKey(key),
      reversePackages(value),
    ])
    .sort((a, b) => a[0].localeCompare(b[0]))
);

writeFileSync(
  "./policy_reversed.json",
  JSON.stringify(policy, null, 2)
);

function reversePackages(resource) {
  if (!resource.packages) return resource;

  resource.packages = Object.fromEntries(
    Object.entries(resource.packages)
      .map(([key, value]) => [
        reverseKey(key),
        value,
      ])
      .sort((a, b) => a[0].localeCompare(b[0]))
  );
  return resource;
}

function reverseKey(key) {
  return key.split(">").reverse().join("<");
}