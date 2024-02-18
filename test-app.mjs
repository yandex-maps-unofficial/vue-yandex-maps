import { spawn } from 'child_process';
import { launch } from 'puppeteer';
import { parseArgs } from 'util';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const browser = await launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  headless: true,
  ignoreHTTPSErrors: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();

const { positionals: [, , type] } = parseArgs({
  args: process.argv,
  allowPositionals: true,
});

const envs = {
  vue2: {
    command: ['yarn', 'workspace', 'example-vue2', 'serve'],
    url: 'http://localhost:8080',
    htmlValidSelector: 'html',
  },
  vue3: {
    command: ['yarn', 'workspace', 'example-vue3', 'dev'],
    url: 'http://localhost:5173/#objects/ManyPoints',
    htmlValidSelector: 'html',
  },
  nuxt2: {
    command: ['yarn', 'workspace', 'example-nuxt2', 'dev'],
    url: 'http://localhost:3000',
    htmlValidSelector: '__nuxt',
  },
  nuxt3: {
    command: ['yarn', 'workspace', 'example-nuxt3', 'dev'],
    url: 'http://localhost:3000/#objects/ManyPoints',
    htmlValidSelector: '__nuxt',
  },
};

if (!(type in envs)) throw new Error(`Incorrect ${type} type`);

const env = envs[type];

let spawnedProcess = spawn(env.command[0], env.command.slice(1, env.command.length));

spawnedProcess.once('spawn', async () => {
  let retries = 0;
  const maxRetries = 50;
  const retryFreq = 0.25;

  do {
    try {
      retries++;

      const request = await fetch(env.url);
      const response = await request.text();

      if (!response.includes(env.htmlValidSelector)) throw new Error(`Map wrapper is undefined. ${ type } didn't launch correctly from ${maxRetries} per ${retryFreq} second(s).`);
      else break;
    } catch (e) {
      if (retries >= maxRetries) {
        spawnedProcess.kill();
        throw e;
      }
      else await sleep(retryFreq * 1000);
    }
  } while (true);

  await page.goto(env.url, {
    waitUntil: 'networkidle2',
  });

  try {
    await page.waitForSelector('ymaps .cluster', { timeout: 1000 * 10 });
  } catch (e) {
    spawnedProcess.kill();
    throw new Error('Test failed: selector "ymaps .cluster" was not found.');
  }

  spawnedProcess.kill();
  process.exit();
});

