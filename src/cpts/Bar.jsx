import * as sys from "@sys";
import { decode } from "@sciter";

import { Foo } from "./Foo.jsx";

export class Bar extends Element {
  isShow = Reactor.signal(true);

  selectFileEl = null;
  fileList = [];

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
      // 加载春联数据
      const file = await sys.fs.open(filePath, "r", 0o666);
      const data = JSON.parse(decode(await file.read(), "utf8"));
      await file.close();
      // Window.this.modal(
      //   <alert caption="加载成功">配置文件 {data} 已加载</alert>
      // );
      // 显示春联
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
            isShow={this.isShow.value}
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
              <td class="col-1">{this.isShow}</td>
              <td class="col-end right">
                <button onclick={() => this.isShow.send(false)}>隐藏全部</button>
                <button onclick={() => this.isShow.send(true)}>显示全部</button>
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
