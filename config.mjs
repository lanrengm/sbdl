// 热更新
import process from 'process';
import child_process from 'child_process';

import fs_extra from 'fs-extra';
import adm_zip from 'adm-zip';

const flag = process.argv[2];

if (flag === 'dev') {
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
} else if (flag === 'build') {
  // build 模式
  // bulid win x64
  const win = './dist/win-x64';
  await fs_extra.copy('./assets', `${win}/assets`);
  await fs_extra.copy('./src/', `${win}/`);
  await fs_extra.copy('./data', `${win}/data`);
  await fs_extra.copy('./bin/win/scapp.exe', `${win}/scapp.exe`);
  await fs_extra.copy('./utils/win/', `${win}/`);
  const distZip = new adm_zip();
  distZip.addLocalFolder(win);
  distZip.writeZip(`./dist/win-x64.zip`);
} else if (flag === 'try') {
  const exePath = '"./bin/win/scapp.exe" "./try/index.html"';
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
}