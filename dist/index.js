#!/usr/bin/env node

// src/index.ts
import welcome from "cli-welcome";

// package.json
var package_default = {
  name: "@minaboktor2628/starter-app",
  description: "A starter app with boilerplate using the t3 stack, shadcn-ui, next-auth, and a few handy components, utility functions, and hooks",
  version: "1.1.0",
  module: "./dist/index.mjs",
  type: "module",
  types: "./dist/index.d.ts",
  main: "./dist/index.js",
  bin: "./dist/index.js",
  repository: {
    type: "git",
    url: "https://github.com/minaboktor2628/starter-app-cli"
  },
  scripts: {
    build: "tsup && node ./dist/index.js  ",
    publish: "npm publish --access-public",
    test: 'echo "Error: no test specified" && exit 1'
  },
  keywords: [
    "starter code",
    "boilerplate"
  ],
  author: "Mina Boktor",
  license: "MIT",
  devDependencies: {
    "@types/cli-welcome": "^2.2.2",
    "@types/figlet": "^1.5.8",
    "@types/gradient-string": "^1.1.6",
    "@types/inquirer": "^9.0.7",
    "@types/node": "^20.12.13",
    prettier: "^3.2.5",
    tsup: "^8.0.2",
    typescript: "^5.4.5"
  },
  dependencies: {
    chalk: "^5.3.0",
    "chalk-animation": "^2.0.3",
    figlet: "^1.7.0",
    "gradient-string": "^2.0.2",
    inquirer: "^9.2.22",
    nanospinner: "^1.1.0",
    "cli-welcome": "^2.2.3",
    "simple-git": "^3.24.0"
  }
};

// src/index.ts
import inquirer from "inquirer";
import path from "path";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import simpleGit from "simple-git";
import figlet from "figlet";
import gradient from "gradient-string";
var sleep = (ms = 100) => new Promise((r) => setTimeout(r, ms));
async function init() {
  welcome({
    title: "Next.js starter app",
    tagLine: `by ${package_default.author}`,
    description: package_default.description,
    version: package_default.version,
    bgColor: "#204216",
    color: "#000000",
    bold: true
  });
  figlet("Mina ' s   Boilerplate", (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
  await sleep();
}
async function getProjectNameAndLocation() {
  const spinner = createSpinner(`Checking input...`).start();
  await sleep(2e3);
  const lastArg = process.argv[process.argv.length - 1];
  const isLastArgDot = lastArg === ".";
  if (isLastArgDot) {
    const currentDir = process.cwd();
    const dirName = path.basename(currentDir);
    spinner.success({
      text: `Using current directory's name as project name: ${chalk.bold.bgGreen(dirName)}`
    });
    return dirName;
  } else {
    spinner.stop();
    spinner.clear();
    const answer = await inquirer.prompt({
      name: "project_name",
      type: "input",
      message: "Whats your projects name?\n",
      default: path.basename(process.cwd())
    });
    return answer.project_name;
  }
}
async function cloneRepo(projectName) {
  const git = simpleGit();
  const repoUrl = "https://github.com/minaboktor2628/starter-app.git";
  const localPath = path.join(process.cwd(), projectName);
  const spinner = createSpinner(`Cloning repository...`).start();
  try {
    await git.clone(repoUrl, localPath);
    spinner.success({
      text: `Repository cloned successfully to ${localPath}`
    });
  } catch (error) {
    spinner.error({
      text: `Failed to clone the repository: ${error}`
    });
  }
}
async function main() {
  await init();
  const projectName = await getProjectNameAndLocation();
  await cloneRepo(projectName);
}
main().then(() => process.exit(0));
