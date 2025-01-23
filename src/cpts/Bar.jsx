import * as sys from "@sys";
import { decode } from "@sciter";

import { Foo } from "./Foo.jsx";

export class Bar extends Element {
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

  async showConfig(mountCouplet) {
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
      mountCouplet(data);
    } catch (e) {
      Window.this.modal(<error>Bar.showConfig: {e}</error>);
    }
  }

  render(props, kids) {
    return (
      <div class="group">
        <details open>
          <summary>张贴春联</summary>
          <hr />
          <table>
            <tr>
              <td class="col-1"></td>
              <td class="col-end right">
                <button onclick={() => props.toggleShowCouplet(false)}>全部隐藏</button>
                <button onclick={() => props.toggleShowCouplet(true)}>全部显示</button>
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
                <button onclick={() => this.showConfig(props.mountCouplet)}>贴出来</button>
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
