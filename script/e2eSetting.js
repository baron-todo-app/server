const execSync = require('child_process').execSync;

console.log('e2eSetting -> start')

// schema破棄
execSync(`NODE_ENV=dev_test NODE_PATH=src/ yarn ts-node $(npm bin)/typeorm schema:drop`);

// マイグレーションファイル実行
execSync('NODE_ENV=dev_test NODE_PATH=src/ yarn ts-node $(npm bin)/typeorm migration:run');

// fixture テストデータ投入
execSync('NODE_ENV=dev_test NODE_PATH=src/ yarn ts-node script/fixture/index.ts');


console.log('e2eSetting -> end')
process.exit(0);
