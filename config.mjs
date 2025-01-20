// 热更新
import process from 'process';
import child_process from 'child_process';

import fse from 'fs-extra';
const dev = process.argv[2] === 'dev';

if (dev) {
  // dev 模式
  // const exePath = '"./bin/win/scapp.exe" "./index.html"';
  const exePath = '"./bin/win/scapp.exe" "./src/index.html"';
  child_process.exec(exePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`::: config.mjs error ::: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`::: config.mjs stderr ::: ${stderr}`)
      return;
    }
    console.log(`::: config.mjs stdout ::: ${stdout}`);
  });
} else {
  // build 模式
  await fse.copy('./assets', './dist/assets');
  await fse.copy('./src/', './dist/');
  await fse.copy('./data', './dist/data');
  await fse.copy('./bin/win/scapp.exe', './dist/scapp.exe');
}