class Mutex {
    constructor() {
        this.lock = false;
    }

    async sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async acquire() {
        while (true) {
            if (this.lock === false) {
                break;
            }
            // custom sleep (setTimeout)
            await this.sleep(100);
        }

        this.lock = true;
    }

    release() {
        this.lock = false;
    }
}
exports.modules = Mutex;