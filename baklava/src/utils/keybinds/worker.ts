import { isMainThread, parentPort } from 'worker_threads';
import globkey from 'globkey';

if (!isMainThread) {
    let prev_keys = ['', '']
    let shouldBreak = false;
    while (true) {
        if (shouldBreak) break;
        let keys = globkey.getKeys();
        if (keys != prev_keys) {
            if (parentPort) parentPort.postMessage({ type: 'keys', keys: keys });
        }
        prev_keys = keys
    }
}