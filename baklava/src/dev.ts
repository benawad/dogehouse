import { exec, ChildProcess } from 'child_process';

let compiler: ChildProcess;
let app: ChildProcess;

let env = process.env;
env.hotReload = 'true';

/**
 * Get a formatted timestamp for logging
 * @returns {string} A formatted timestamp (HH:MM:SS)
 */
function timestamp() {
  return new Date().toISOString().split('T')[1].split(".")[0];
}

/**
 * Start the hot reloader.
 * Creates a connection with the typescript compiler and listens for changes.
 * Once changes are compiled, the electron app is relaunched.
 */
function start() {
  console.log(`${timestamp()} - Starting hot reload`);
  compiler = exec('npm run watch');
  compiler.stdout?.on('data', data => {
    if (data.includes('Watching')) {
      if (app) console.log(`${timestamp()} - Detected changes`);
      app = exec('npm run start', {
        env
      });
      console.log(`${timestamp()} - Launching app`);
    }
  });
}

start();
