#!/usr/bin/env node
import welcome from "cli-welcome";
// @ts-ignore
import pkg from "./../package.json";
import inquirer from "inquirer";
import path from "path";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import simpleGit from "simple-git";
import figlet from "figlet";
import gradient from "gradient-string";

const sleep = (ms = 100) => new Promise((r) => setTimeout(r, ms));
let isArgIncludeDot = false;

async function init() {
  welcome({
    title: "Next.js starter app",
    tagLine: `by ${pkg.author}`,
    description: pkg.description,
    version: pkg.version,
    bgColor: "#204216",
    color: "#000000",
    bold: true,
  });
  figlet("Mina ' s   Boilerplate", (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
  await sleep();
}
async function getProjectNameAndLocation() {
  const spinner = createSpinner(`Checking input...`).start();
  await sleep(2000);

  // Check if the last argument is "."
  const lastArg = process.argv[process.argv.length - 1];
  const isLastArgDot = lastArg === ".";

  if (isLastArgDot) {
    isArgIncludeDot = true;
    const currentDir = process.cwd();
    const dirName = path.basename(currentDir);
    spinner.success({
      text: `Using current directory's name as project name: ${chalk.bold.bgGreen(dirName)}`,
    });
    return dirName;
  } else {
    spinner.stop();
    spinner.clear();
    const answer = await inquirer.prompt({
      name: "project_name",
      type: "input",
      message: "Whats your projects name?\n",
      default: path.basename(process.cwd()),
    });
    return answer.project_name;
  }
}

async function cloneRepo(projectName: string) {
  const git = simpleGit();

  const repoUrl = "https://github.com/minaboktor2628/starter-app.git"; // Replace with your repository URL
  const localPath = path.join(process.cwd(), projectName);

  const spinner = createSpinner(`Cloning repository...`).start();
  try {
    await git.clone(repoUrl, localPath);
    spinner.success({
      text: `Repository cloned successfully to ${localPath}`,
    });
  } catch (error) {
    spinner.error({
      text: `Failed to clone the repository: ${error}`,
    });
  }
}

async function main() {
  await init();

  const projectName = await getProjectNameAndLocation();
  await cloneRepo(projectName);
}

main().then(() => process.exit(0));
