import * as sys from "@sys";
import { encode, decode } from "@sciter";

import { Foo } from "./cpts.jsx";

const dataPath = "data.json";

document.on("ready", async function () {
  // 设置控制台窗口初始位置
  const [screenW, screenH] = Window.this.screenBox("frame", "dimension");
  const [x, y] = Window.this.box("position", "client", "monitor");
  Window.this.move(screenW * 0.65, screenH * 0.05);
  Window.this.state = Window.WINDOW_SHOWN;
  try {
    document.body.append(<App />);
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

class App extends Element {
  isShow = Reactor.signal(true);

  handleShow() {
    this.isShow.send(true);
  }
  handleHide() {
    this.isShow.send(false);
  }

  render() {
    return (
      <div>
        <Bar
          handleShow={this.handleShow.bind(this)}
          handleHide={this.handleHide.bind(this)}
        />
        {/* <Foo
          title="横批"
          content="恭喜发财"
          direction="horizontal"
          ww={200}
          wh={50}
          wx={0}
          wy={-450}
          isShow={this.isShow.value}
          isOpen={true}
        />
        <Foo
          title="上联"
          content="福临宝地千秋盛"
          direction="vertical"
          ww={56}
          wh={202}
          wx={904}
          wy={0}
          isShow={this.isShow.value}
        />
        <Foo
          title="下联"
          content="财进家门万事兴"
          direction="vertical"
          ww={56}
          wh={202}
          wx={-904}
          wy={0}
          isShow={this.isShow.value}
        /> */}
        <Foo
          title="福到了"
          content="福"
          direction="horizontal"
          ww={250}
          wh={250}
          wx={0}
          wy={0}
          isShow={this.isShow.value}
          isOpen={true}
          fColor="gold"
          bColor="red"
          fontSize={306}
          frameType="transparent"
          frontTransform="rotate(45deg) translate(-5,10)"
          backTransform="rotate(135deg) scale(0.7)"
          fontFamily="Ma Shan Zheng"
        />
      </div>
    );
  }
}

class Bar extends Element {
  handleShow = null;
  handleHide = null;

  this({ handleShow = () => {}, handleHide = () => {} }) {
    this.handleShow = handleShow;
    this.handleHide = handleHide;
  }

  async saveConfig() {
    // const config = {
    //   topText: document.$('input#top-text').value,
    //   rightText: document.$('input#right-text').value,
    //   leftText: document.$('input#left-text').value,
    // };
    // const json = JSON.stringify(config, null, 2);
    // const file = await sys.fs.open(dataPath, "w+", 0o666);
    // await file.write(json);
    // await file.close();
    Window.this.modal(
      <alert caption="保存成功">配置文件已保存到 {dataPath}</alert>
    );
  }

  render() {
    return (
      <table class="group">
        <tr>
          <td class="col-1"></td>
          <td class="col-end right">
            <button onclick={this.handleHide}>隐藏全部</button>
            <button onclick={this.handleShow}>显示全部</button>
            <button onclick={this.saveConfig.bind(this)}>保存全部设置</button>
          </td>
        </tr>
      </table>
    );
  }
}
