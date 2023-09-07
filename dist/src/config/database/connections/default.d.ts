import { DataSource } from 'typeorm';
declare const dataSource: DataSource;
export declare const getPool: () => Promise<Pool>;
export default dataSource;
