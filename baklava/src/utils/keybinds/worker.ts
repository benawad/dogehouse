import { isMainThread, parentPort } from 'worker_threads';
import globkey from 'globkey';

if (!isMainThread) {
    while (globkey.isRunning()) {
        let keys = globkey.getKeys();
        if (parentPort) parentPort.postMessage({ type: 'keys', keys: keys });
    }
}
