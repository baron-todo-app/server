const base = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'mysql',
  database: 'task',
  logging: ['query', 'error'],
  entities: ['src/entities/**.entity{.ts,.js}'],
  migrations: ['migrations/**/*.ts'],
  synchronize: false, // entityと同期するので マイグレーションと相性悪いので無し
  cli: {
    migrationsDir: 'migrations',
  },
};

// 開発モード
const dev = { ...base };

// 開発モードでのテスト
const dev_test = { ...base, database: 'task_test' };

let ormconfig = dev;
if (process.env.NODE_ENV === 'dev_test') {
  ormconfig = dev_test;
}

module.exports = ormconfig;
