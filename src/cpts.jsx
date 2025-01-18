/**
 * 一个分组
 */
export class Top extends Element {
  screenW = Reactor.signal(1024);
  screenH = Reactor.signal(768);

  win = null;
  winX = Reactor.signal(0);
  winY = Reactor.signal(0);
  winW = Reactor.signal(0);
  winH = Reactor.signal(0);

  // 窗口到屏幕的边距
  marginTop = Reactor.signal(0);
  marginRight = Reactor.signal(0);
  marginBottom = Reactor.signal(0);
  marginLeft = Reactor.signal(0);

  title = Reactor.signal("");
  content = Reactor.signal("");
  direction = Reactor.signal("horizontal");

  this({ title = "福", content = "恭喜发财" }) {
    // 初始化屏幕相关数据
    const [screenW, screenH] = Window.this.screenBox("frame", "dimension");
    this.screenW.value = screenW;
    this.screenH.value = screenH;
    // 初始化窗口相关数据
    this.createWin();
    const [winX, winY, winW, winH] = this.win.box("xywh", "client", "monitor");
    this.winX.value = winX;
    this.winY.value = winY;
    this.winW.value = winW;
    this.winH.value = winH;
    this.win.on("closerequest", () => (this.win = null));
    // 初始化标题和内容
    this.title.value = title;
    this.content.value = content;
    Reactor.effect(() => {
      const v = this.title.value;
      if (this.win) this.win.caption = v;
    });
    Reactor.effect(() => {
      const v = this.content.value;
      if (this.win) this.win.document.$("#main").innerText = v;
    });

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
    // 改宽高，变边距
    Reactor.effect(() => {
      const stateW = this.winW.value;
      const stateH = this.winH.value;
      // 宽变
      
    });
    Reactor.effect(() => {
      const v = this.direction.value;
      if (this.win) {
        this.win.document.$("#main").classList.remove("horizontal", "vertical");
        this.win.document.$("#main").classList.add(v);
      }
    });
    Reactor.effect(() => {
      const winH = this.winH.value;
      if (this.winY.value + winH > this.screenH.value) {
        this.winY.value = this.screenH.value - winH;
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
        url: "./dl.html",
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
              <td class="col-end">
                <input type="text" name="title-text" state-value={this.title} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="top-text">内容</label>{" "}
              </td>
              <td class="col-end">
                <input type="text" name="top-text" state-value={this.content} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="direction">文字方向</label>
              </td>
              <td class="col-end">
                <input
                  type="radio"
                  name="direction"
                  id="horizontal"
                  value="horizontal"
                  checked={this.direction.value === "horizontal"}
                  onchange={() => (this.direction.value = "horizontal")}
                />
                <label for="horizontal">水平方向</label>
                <span>&nbsp;&nbsp;</span>
                <input
                  type="radio"
                  name="direction"
                  id="vertical"
                  value="vertical"
                  checked={this.direction.value === "vertical"}
                  onchange={() => (this.direction.value = "vertical")}
                />
                <label for="vertical">垂直方向</label>
              </td>
            </tr>
          </table>
          <hr />
          <table>
            <tr>
              <td class="col-1">
                <label for="width">宽度</label>
              </td>
              <td class="col-2">
                <input name="width" type="number" min="0" max={String(this.screenW)} step="1" state-value={this.winW} />
              </td>
              <td class="col-end">
                <input type="hslider" min="0" max={String(this.screenW)} step="1" state-value={this.winW} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="height">高度</label>
              </td>
              <td class="col-2">
                <input name="height" type="number" min="0" max={String(this.screenH)} step="1" state-value={this.winH} />
              </td>
              <td class="col-end">
                <input type="hslider" min="0" max={String(this.screenH)} step="1" state-value={this.winH} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="top-margin">上边距</label>
              </td>
              <td class="col-2">
                <input name="top-margin" type="number" min="0" max={String(this.screenH - this.winH)} value="0" step="1" state-value={this.marginTop} />
              </td>
              <td class="col-end">
                <input type="hslider" min="0" max={String(this.screenH - this.winH)} value="0" step="1" name="top-margin" state-value={this.marginTop} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="right-margin">右边距</label>
              </td>
              <td class="col-2">
                <input name="right-margin" type="number" min="0" max={String(this.screenW - this.winW)} value="0" step="1" state-value={this.marginRight} />
              </td>
              <td class="col-end">
                <input type="hslider" min="0" max={String(this.screenW - this.winW)} value="0" step="1" name="top-margin" state-value={this.marginRight} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="top-margin">下边距</label>
              </td>
              <td class="col-2">
                <input name="top-margin" type="number" min="0" max={String(this.screenH - this.winH)} value="0" step="1" state-value={this.marginBottom} />
              </td>
              <td class="col-end">
                <input type="hslider" min="0" max={String(this.screenH - this.winH)} value="0" step="1" name="top-margin" state-value={this.marginBottom} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="top-margin">左边距</label>
              </td>
              <td class="col-2">
                <input name="top-margin" type="number" min="0" max={String(this.screenW - this.winW)} value="0" step="1" state-value={this.marginLeft} />
              </td>
              <td class="col-end">
                <input type="hslider" min="0" max={String(this.screenW - this.winW)} value="0" step="1" name="top-margin" state-value={this.marginLeft} />
              </td>
            </tr>
          </table>
          <hr />
          <table>
            <tr>
              <td class="col-1">
                <label for="fgc">前景色</label>
              </td>
              <td class="col-end">
                <input type="color" name="fgc" value="#000000" />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="bgc">背景色</label>
              </td>
              <td class="col-end">
                <input type="color" name="bgc" value="#FFFFFF" />
              </td>
            </tr>
          </table>
        </details>
        <table>
          <tr>
            <td class="col-1"></td>
            <td class="col-2"></td>
            <td class="col-end right">
              <button onclick={this.showWin.bind(this)}>显示</button>
              <button onclick={this.hiddenWin.bind(this)}>隐藏</button>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export class Right extends Element {
  screenW = Reactor.signal(1024);
  screenH = Reactor.signal(768);

  win = null;
  winX = Reactor.signal(0);
  winY = Reactor.signal(0);
  winW = Reactor.signal(0);
  winH = Reactor.signal(0);
  winDX = Reactor.signal(0); // 右间距

  title = Reactor.signal("");
  content = Reactor.signal("");

  this({ title = "福", content = "恭喜发财" }) {
    try {
      // 初始化屏幕相关数据
      const [screenW, screenH] = Window.this.screenBox("frame", "dimension");
      this.screenW.value = screenW;
      this.screenH.value = screenH;
      // 初始化窗口相关数据
      this.createWin();
      const [winX, winY, winW, winH] = this.win.box("xywh", "client", "monitor");
      this.winX.value = winX;
      this.winY.value = winY;
      this.winW.value = winW;
      this.winH.value = winH;
      this.winDX.value = this.screenW.value - (winX + winW);
      this.win.on("closerequest", () => (this.win = null));
      // 初始化标题和内容
      this.title.value = title;
      this.content.value = content;
      Reactor.effect(() => {
        const v = this.title.value;
        if (this.win) this.win.caption = v;
      });
      Reactor.effect(() => {
        const v = this.content.value;
        if (this.win) this.win.document.$("#main").innerText = v;
      });

      // 响应窗口变化
      Reactor.effect(() => {
        const stateX = this.winX.value;
        const stateY = this.winY.value;
        const stateW = this.winW.value;
        const stateH = this.winH.value;

        const stateDX = this.winDX.value;
        const newX = this.screenW.value - stateDX - stateW;
        if (this.win) {
          this.win.move(newX, stateY, stateW, stateH);
        }
      });
    } catch (e) {
      Window.this.modal(<info>{e}</info>);
    }
  }

  /**
   * 初始化窗口，或者当窗口被意外关闭后重新创建窗口。
   */
  createWin() {
    if (!this.win) {
      this.win = new Window({
        type: Window.POPUP_WINDOW,
        caption: this.title.value,
        url: "./dl.html",
        width: 100,
        height: 600,
        // parent: Window.this,
        alignment: 6,
      });
      // this.win.document.$("#main").classList.add("horizontal");
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
                <label for="top-margin">右边距</label>
              </td>
              <td class="col-2">
                <input type="number" min="0" max={String(this.screenW - this.winW)} value="0" step="1" state-value={this.winDX} />
              </td>
              <td class="col-end">
                <input type="hslider" min="0" max={String(this.screenW - this.winW)} value="0" step="1" name="top-margin" state-value={this.winDX} />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="">宽度</label>
              </td>
              <td class="col-2">
                <input type="number" min="0" max={String(this.screenW)} step="1" state-value={this.winW} />
              </td>
              <td class="col-end">
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
              <td class="col-end">
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
            <td class="col-end right">
              <button onclick={this.showWin.bind(this)}>显示</button>
              <button onclick={this.hiddenWin.bind(this)}>隐藏</button>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}
