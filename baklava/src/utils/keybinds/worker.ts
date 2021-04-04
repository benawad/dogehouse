import { isMainThread, parentPort } from 'worker_threads';
import globkey from 'globkey';

if (!isMainThread) {
    let prev_keys = ['', '']
    while (true) {
        let keys = globkey.get_keys();
        if (keys != prev_keys) {
            if (parentPort) {
                parentPort.postMessage({ type: 'keys', keys: keys });
            }
        }
        prev_keys = keys
    }
}