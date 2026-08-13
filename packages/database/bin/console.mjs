#!/usr/bin/env node
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// CLI Paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const rl = readline.createInterface({ input, output });

// CLI Actions
const actions = [
  {
    key: "1",
    label: "Validate all contribution JSON",
    command: ["pnpm", ["contrib:validate"]],
  },
  {
    key: "2",
    label: "Validate geo JSON only",
    command: ["pnpm", ["contrib:validate:geo"]],
  },
  {
    key: "3",
    label: "Validate reference JSON only",
    command: ["pnpm", ["contrib:validate:reference"]],
  },
  {
    key: "4",
    label: "Export CSV files from contribution JSON",
    command: ["pnpm", ["export:csv"]],
  },
  {
    key: "5",
    label: "Import geo JSON to PostgreSQL UPSERT",
    command: ["pnpm", ["import:geo"]],
    dangerous: true,
  },
  {
    key: "6",
    label: "Import reference JSON to PostgreSQL UPSERT",
    command: ["pnpm", ["import:reference"]],
    dangerous: true,
  },
  {
    key: "7",
    label: "Import all JSON to PostgreSQL UPSERT",
    command: ["pnpm", ["import:all"]],
    dangerous: true,
  },
];

// CLI Banner
function banner() {
  console.log("");
  console.log("============================================================");
  console.log("  S O L V Y S T   A T L A S   D A T A   C L I");
  console.log("============================================================");
  console.log("Source of truth : contributions/**/*.json");
  console.log("Runtime target  : PostgreSQL via trusted UPSERT import");
  console.log("Generated export: data/csv");
  console.log("");
}

// CLI Menu
function menu() {
  for (const action of actions) {
    console.log(action.key + ". " + action.label);
  }
  console.log("0. Exit");
  console.log("");
}

// Run Command
async function runCommand(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: packageRoot,
      stdio: "inherit",
      shell: false,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(command + " " + args.join(" ") + " exited with " + code));
    });
    child.on("error", reject);
  });
}

// Confirm Database Write
async function confirmDangerous(action) {
  console.log("");
  console.log("This action writes to the configured PostgreSQL database.");
  console.log("Run migrations and staging validation before production sync.");
  const answer = await rl.question('Type "IMPORT" to continue: ');
  return answer.trim() === "IMPORT";
}

// CLI Loop
try {
  while (true) {
    banner();
    menu();
    const choice = (await rl.question("Select command: ")).trim();
    if (choice === "0") break;

    const action = actions.find((item) => item.key === choice);
    if (!action) {
      console.log("Unknown option");
      continue;
    }

    if (action.dangerous && !(await confirmDangerous(action))) {
      console.log("Import cancelled");
      continue;
    }

    const [command, args] = action.command;
    await runCommand(command, args);
    await rl.question("\nPress Enter to continue...");
  }
} finally {
  rl.close();
}
