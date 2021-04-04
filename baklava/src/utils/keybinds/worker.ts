import { isMainThread, parentPort } from 'worker_threads';
import globkey from 'globkey';

if (!isMainThread) {
    let prev_keys = ['', '']
    let shouldBreak = false;
    parentPort?.on('message', (msg) => {
        if (msg.type === 'exit') {
            shouldBreak = true;
            parentPort?.postMessage({ type: 'exit' });
        }
    })
    while (true) {
        if (shouldBreak) break;
        let keys = globkey.get_keys();
        if (keys != prev_keys) {
            if (parentPort) parentPort.postMessage({ type: 'keys', keys: keys });
        }
        prev_keys = keys
    }
}