/**
 * 一个分组
 */
export class Foo extends Element {
  screenW = Reactor.signal(1024);
  screenH = Reactor.signal(768);

  win = null;
  winY = Reactor.signal(0);
  winW = Reactor.signal(0);
  winH = Reactor.signal(0);

  title = Reactor.signal("");
  content = Reactor.signal("");


  this({ title = '福', content = '恭喜发财' }) {
    // 初始化屏幕相关数据
    const [screenW, screenH] = Window.this.screenBox("frame", "dimension");
    this.screenW.value = screenW;
    this.screenH.value = screenH;
    // 初始化窗口相关数据
    this.createWin();
    Reactor.effect(() => {
      const v= this.title.value;
      if (this.win) {
        this.win.caption = v;
      }
    });
    Reactor.effect(() => {
      const v = this.content.value;
      if (this.win) {
        this.win.document.$("#main").innerText = v;
      }
    });
    const [winX, winY, winW, winH] = this.win.box("xywh", "client", "monitor");
    this.winY.value = winY;
    this.winW.value = winW;
    this.winH.value = winH;
    this.win.on("closerequest", () => {
      // Window.this.modal(<alert caption="警告">关闭{this.title}</alert>);
      this.win = null;
    });
    // 初始化标题和内容
    this.title.value = title;
    this.content.value = content;

    // 响应窗口变化
    Reactor.effect(() => {
      const stateY = this.winY.value;
      const stateW = this.winW.value;
      const stateH = this.winH.value;
      const newX = (this.screenW.value - stateW) / 2;
      if (this.win) {
        this.win.move(newX, stateY, stateW, stateH);
      }
    });
  }

  /**
   * 初始化窗口，或者当窗口被意外关闭后重新创建窗口。
   */
  createWin() {
    if (!this.win) {
      this.win = new Window({
        type: Window.POPUP_WINDOW,
        caption: this.title.value,
        url: './dl.html',
        width: 400,
        height: 100,
        // parent: Window.this,
        alignment: 8,
      });
      this.win.document.$("#main").classList.add("horizontal");
      this.win.document.$("#main").innerText = this.content.value;
    }
  }

  showWin() {
    if (this.win) {
      this.win.state = Window.WINDOW_SHOWN;
    } else {
      this.createWin();
    }
  }

  hiddenWin() {
    if (this.win) {
      this.win.state = Window.WINDOW_HIDDEN;
    }
  }

  render() {
    return (
      <div class="group">
        <details open>
          <summary>{this.title}</summary>
          <hr></hr>
          <table>
            <tr>
              <td class="col-1">
                <label for="title-text">分组标题</label>{" "}
              </td>
              <td class="" colspan="2">
                <input type="text" name="title-text" state-value={this.title} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="top-text">内容</label>{" "}
              </td>
              <td class="" colspan="2">
                <input type="text" name="top-text" state-value={this.content} />
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
              <button onclick={this.showWin.bind(this)}>显示</button>
              <button onclick={this.hiddenWin.bind(this)}>隐藏</button>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}
