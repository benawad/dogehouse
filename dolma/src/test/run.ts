import * as encodingTests from './tests/encoding';
import dolma from '../';

interface CompletedTest {
  started: Date,
  finished: Date,
  type: string,
  passed?: boolean
}

const neutralPrefix = "\u001b[36m[ DOLMA ]\u001b[0m";
const successPrefix = "\u001b[32m[ SUCCESS ]\u001b[0m";
const failurePrefix = "\u001b[31m[ FAILURE ]\u001b[0m"

const testName = (name: string) => { return `\u001b[37;1m(${name})\u001b[0m` }

let failedTests: CompletedTest[] = [];
let successfulTests: CompletedTest[] = [];

let tests = {
  encoding: encodingTests.default
}

function testFinished(test: any, started: Date, successful?: boolean) {
  const finished = new Date();

  if (successful) {
    successfulTests.push({ started, finished, type: test.type, passed: true });

    const time = ((finished.getTime() - started.getTime()) / 1000) % 60;
    console.log(successPrefix, testName(test.name), "Test passed in", `${time}s!`);
  } else {
    failedTests.push({ started, finished, type: test.type, passed: false });

    const time = ((finished.getTime() - started.getTime()) / 1000) % 60;
    console.log(failurePrefix, testName(test.name), "Test failed in", `${time}s!`);
  }
}
async function main() {
  console.log(neutralPrefix, "Running tests on dolma...\n");

  tests.encoding.map(async test => {
    const started = new Date();
    const encodedValue = new dolma([]).encode(test.input);
    if (JSON.stringify(encodedValue) == JSON.stringify(test.expectedOutput)) testFinished(test, started, true);
    else testFinished(test, started, false);
  });

  console.log(`\n${neutralPrefix} Testing completed! \u001b[37;1m(${successfulTests.length} passed) (${failedTests.length} failed)`)
}

main();