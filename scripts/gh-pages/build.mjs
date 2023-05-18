/* @ts-check */
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentPath = path.resolve(__dirname, '../../content/posts');
const buildPath = path.resolve(__dirname, '../../build');

async function allPosts() {
  const content = await fs.readdir(contentPath);
  return content;
}

async function main() {
  const posts = await allPosts();

  log('Clean build path');
  try {
    await fs.access(buildPath);
    await fs.rm(buildPath, { recursive: true, force: true });
  } catch (error) {}

  await fs.mkdir(buildPath);

  log('Start build');
  const builds = posts.map((post) => {
    log(`Copy file ${post}`);
    return fs.copyFile(`${contentPath}/${post}`, `${buildPath}/${post}`);
  });
  await Promise.all(builds);
  log('Build done');
}

main();