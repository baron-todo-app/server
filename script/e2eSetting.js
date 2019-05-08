const execSync = require('child_process').execSync;

console.log('e2eSetting -> start')

// schema破棄
console.log(execSync(`NODE_ENV=dev_test NODE_PATH=src/ yarn ts-node $(npm bin)/typeorm schema:drop`).toString());

// マイグレーションファイル実行
console.log(execSync('NODE_ENV=dev_test NODE_PATH=src/ yarn ts-node $(npm bin)/typeorm migration:run').toString());

// fixture テストデータ投入
console.log(execSync('NODE_ENV=dev_test NODE_PATH=src/ yarn ts-node script/fixture/index.ts').toString());


console.log('e2eSetting -> end')
process.exit(0);
