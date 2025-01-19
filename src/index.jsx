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
      <div id="root">
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
        {/* <Foo
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
          fontFamily="楷体"
        /> */}
      </div>
    );
  }
}

class Bar extends Element {
  handleShow = null;
  handleHide = null;

  selectFileEl = null;
  fileList = [];

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

  async getConfigList() {
    const dir = "./data/";
    try {
      const fileList = sys.fs.readdirSync(dir);
      this.fileList.splice(0);
      fileList.forEach((file) => this.fileList.push(file.name));
    } catch (e) {
      Window.this.modal(<error>Bar.getConfigList: {e}</error>);
    }
  }

  async showConfig() {
    const fileName = this.selectFileEl.value;
    if (!fileName) {
      Window.this.modal(<error>请先挑选春联</error>);
      return;
    }
    const filePath = `./data/${fileName}`;
    // Window.this.modal(<info>{filePath}</info>);
    try {
      const file = await sys.fs.open(filePath, "r", 0o666);
      const data = JSON.parse(decode(await file.read(), "utf8"));
      await file.close();
      // Window.this.modal(
      //   <alert caption="加载成功">配置文件 {data} 已加载</alert>
      // );
    } catch (e) {
      Window.this.modal(<error>Bar.showConfig: {e}</error>);
    }
    try {
      Window.this.document
      .$("#root")
      .append(
        <Foo
          title={data.title}
          content={data.content}
          ww={data.ww}
          wh={data.wh}
          wx={data.wx}
          wy={data.wy}
          direction={data.direction}
          isShow={data.isShow}
          isOpen={data.isOpen}
          frameType={data.frameType}
          fColor={data.fColor}
          bColor={data.bColor}
          fontSize={data.fontSize}
          frontTransform={data.frontTransform}
          backTransform={data.backTransform}
          fontFamily={data.fontFamily}
        />
      );
    } catch (e) {
      Window.this.modal(<error>Bar.showConfig: {e}</error>);
    }
  }

  render() {
    return (
      <div class="group">
        <details open>
          <summary>张贴春联</summary>
          <hr />
          <table>
            <tr>
              <td class="col-1"></td>
              <td class="col-end right">
                <button onclick={this.handleHide}>隐藏全部</button>
                <button onclick={this.handleShow}>显示全部</button>
                <button onclick={this.saveConfig.bind(this)}>
                  保存全部设置
                </button>
              </td>
            </tr>
          </table>
        </details>
        <details open>
          <summary>库存春联</summary>
          <hr />
          <table>
            <tr>
              <td class="col-1">挑选春联</td>
              <td class="col-end">
                <select var={this.selectFileEl}></select>
              </td>
            </tr>
            <tr>
              <td class="col-end right" colspan="3">
                <button onclick={this.showConfig.bind(this)}>贴出来</button>
              </td>
            </tr>
          </table>
        </details>
      </div>
    );
  }

  async componentDidMount() {
    await this.getConfigList();
    try {
      this.selectFileEl.innerHTML = "";
      for (const file of this.fileList) {
        const opt = <option value={file}>{file}</option>;
        this.selectFileEl.append(opt);
      }
    } catch (e) {
      Window.this.modal(<error>Bar.componentDidMount:{e}</error>);
    }
  }
}
