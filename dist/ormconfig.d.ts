import { DataSourceOptions } from 'typeorm';
type TypeOrmDataSourceOptions = DataSourceOptions & {
    seeds: string[];
    factories: string[];
};
declare const defaultDataSourceOptions: TypeOrmDataSourceOptions;
export default defaultDataSourceOptions;
