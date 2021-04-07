import { isMainThread, parentPort } from 'worker_threads';
import globkey from 'globkey';

if (!isMainThread) {
    globkey.start();
    while (true) {
        try {
            let keys = globkey.getKeys();
            if (parentPort) parentPort.postMessage({ type: 'keys', keys: keys });
        } catch (error) {
            console.log(error);
            break;
        }
    }
}
