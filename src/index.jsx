import * as sys from "@sys";
import { encode, decode } from "@sciter";

import { Foo } from "./cpts.jsx";

const dataPath = "data.json";

document.on("click", "button#save", async function () {
  // const config = {
  //   topText: document.$('input#top-text').value,
  //   rightText: document.$('input#right-text').value,
  //   leftText: document.$('input#left-text').value,
  // };
  // const json = JSON.stringify(config, null, 2);
  // const file = await sys.fs.open(dataPath, "w+", 0o666);
  // await file.write(json);
  // await file.close();
  Window.this.modal(<alert caption="保存成功">配置文件已保存到 {dataPath}</alert>);
});

document.on("ready", async function () {
  try {
    document.$("#root").append(<Foo title="横批" content="恭喜发财" direction="horizontal" ww={200} wh={50} wx={0} wy={-490} />);
    document.$("#root").append(<Foo title="上联" content="福临宝地千秋盛" direction="vertical" ww={56} wh={202} wx={904} wy={0} />);
    document.$("#root").append(<Foo title="下联" content="财进家门万事兴" direction="vertical" ww={56} wh={202} wx={-904} wy={0} />);
    document.$("#root").append(<Foo title="福到了" content="福" direction="horizontal" ww={100} wh={100} wx={0} wy={0} />);
  } catch (e) {
    Window.this.modal(<alert caption="报错">{e}</alert>);
  }

  // 加载文件
  try {
    const file = await sys.fs.open(dataPath, "r", 0o666);
    const data = JSON.parse(decode(await file.read(), "utf8"));
    await file.close();
  } catch (e) {
    Window.this.modal(<alert caption="警告">第一次启动，没有配置文件</alert>);
  }
});
