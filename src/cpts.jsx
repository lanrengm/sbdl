/**
 * 一个分组
 */
export class Group extends Element {
  screenW = Reactor.signal(1024);
  screenH = Reactor.signal(768);
  win = null;
  winY = Reactor.signal(0);
  winW = Reactor.signal(0);
  winH = Reactor.signal(0);

  title = Reactor.signal("");
  text = Reactor.signal("");


  this({ title = '新窗口' }) {
    const [screenW, screenH] = Window.this.screenBox("frame", "dimension");
    this.screenW.value = screenW;
    this.screenH.value = screenH;
    this.win = new Window({
      type: Window.POPUP_WINDOW,
      caption: "横批",
      url: './dl.html',
      width: 400,
      height: 100,
      // parent: Window.this,
      alignment: 8,
    });
    this.win.document.$("#main").classList.add("horizontal");
    this.win.document.$("#main").innerText = this.topText;
    this.win.on("closerequest", () => {
      Window.this.modal(<alert caption="警告">关闭横批</alert>);
      this.win = null;
    });
    const [winX, winY, winW, winH] = this.win.box("xywh", "client", "monitor");
    this.winY.value = winY;
    this.winW.value = winW;
    this.winH.value = winH;
    
    this.title.value = title;

    Reactor.effect(() => {
      const stateY = this.winY.value;
      const stateW = this.winW.value;
      const stateH = this.winH.value;

      const newX = (this.screenW.value - stateW) / 2;

      this.win.move(newX, stateY, stateW, stateH);
      // Window.this.modal(<info>xx</info>);
    });
  }

  render() {
    return (
      <div class="group">
        <details open>
          <summary>分组</summary>
          <hr></hr>
          <table>
            <tr>
              <td class="col-1">
                <label for="top-text">内容</label>{" "}
              </td>
              <td class="" colspan="2">
                <input type="text" name="top-text" id="top-text" />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="top-margin">上边距</label>
              </td>
              <td class="col-2">
                <input type="number" min="0" max={String(this.screenH)} value="0" step="1" state-value={this.winY} />
              </td>
              <td class="col-3">
                <input type="hslider" min="0" max={String(this.screenH)} value="0" step="1" name="top-margin" state-value={this.winY} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="">宽度</label>
              </td>
              <td class="col-2">
                <input type="number" min="0" max={String(this.screenW)} step="1" state-value={this.winW} />
              </td>
              <td class="col-3">
                <input type="hslider" min="0" max={String(this.screenW)} step="1" state-value={this.winW} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="">高度</label>
              </td>
              <td class="col-2">
                <input type="number" min="0" max={String(this.screenH)} step="1" state-value={this.winH} />
              </td>
              <td class="col-3">
                <input type="hslider" min="0" max={String(this.screenH)} step="1" state-value={this.winH} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="fgc">前景色</label>
              </td>
              <td class="" colspan="2">
                <input type="color" name="fgc" />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="bgc">背景色</label>
              </td>
              <td class="" colspan="2">
                <input type="color" name="bgc" />
              </td>
            </tr>
          </table>
        </details>
        <table>
          <tr>
            <td class="col-1"></td>
            <td class="col-2"></td>
            <td class="col-3 right">
              <button onclick={() => (this.win.state = Window.WINDOW_SHOWN)}>显示</button>
              <button onclick={() => (this.win.state = Window.WINDOW_HIDDEN)}>隐藏</button>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}
