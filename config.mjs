// 热更新
import { exec } from 'child_process';

const exePath = '"./dist/win/scapp.exe" "./src/index.html"';
exec(exePath, (error, stdout, stderr) => {
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