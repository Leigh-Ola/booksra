"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = void 0;
const typeorm_1 = require("typeorm");
const ormconfig_1 = require("../../../../ormconfig");
const lodash_1 = require("lodash");
const worker_threads_1 = require("worker_threads");
const until_promise_1 = require("until-promise");
const dataSourceConfig = ormconfig_1.default;
if (!worker_threads_1.isMainThread) {
    (0, lodash_1.set)(dataSourceConfig, 'extra.max', 1);
}
const dataSource = new typeorm_1.DataSource(dataSourceConfig);
let pool = undefined;
const getPool = async () => {
    const poolRef = await (0, until_promise_1.default)(() => {
        const poolRef = pool;
        if (!poolRef) {
            throw new Error('Oops.. Pool is not yet available');
        }
        return poolRef;
    }, (resp) => !!resp, {
        wait: 300,
    });
    return poolRef;
};
exports.getPool = getPool;
dataSource
    .initialize()
    .then(() => {
    pool = (0, lodash_1.get)(dataSource.driver, 'master');
})
    .catch((err) => {
    console.error('Error during Default Data Source initialization', err);
});
exports.default = dataSource;
//# sourceMappingURL=default.js.map