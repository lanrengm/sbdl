/**
 * 一个分组
 */
export class Foo extends Element {
  Ow = Reactor.signal(512);
  Oh = Reactor.signal(384);

  win = null;
  Wx = Reactor.signal(0);
  Wy = Reactor.signal(0);
  Ww = Reactor.signal(0);
  Wh = Reactor.signal(0);

  title = Reactor.signal("");
  content = Reactor.signal("");
  direction = Reactor.signal("horizontal");

  isShow = false;

  this({
    title = "福",
    content = "福",
    ww = 50,
    wh = 50,
    wx = 0,
    wy = 0,
    direction = "horizontal",
    isShow = false,
  }) {
    if (this.win) {
      // 组件刷新时执行
      this.isShow = isShow;
      // Window.this.modal(<info>{this.isShow} {typeof this.isShow}</info>);
      if (this.isShow) {
        this.showWin();
      } else {
        this.hiddenWin();
      }
    } else {
      // 初始化屏幕相关数据
      const [screenW, screenH] = Window.this.screenBox("frame", "dimension");
      this.Ow.value = screenW / 2;
      this.Oh.value = screenH / 2;
      // 初始化窗口相关数据
      this.Wx.value = wx;
      this.Wy.value = wy;
      this.Ww.value = ww;
      this.Wh.value = wh;
      this.direction.value = direction;
      this.title.value = title;
      this.content.value = content;
      this.isShow = isShow;
      this.createWin();
      // 初始化标题和内容
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
        const stateX = this.Wx.value;
        const stateY = this.Wy.value;

        const stateW = this.Ww.value;
        const stateH = this.Wh.value;

        const newX = stateX + this.Ow.value - stateW;
        const newY = stateY + this.Oh.value - stateH;
        const newW = stateW * 2;
        const newH = stateH * 2;

        if (this.win) {
          this.win.move(newX, newY, newW, newH);
        }
      });
      // 改宽高，变边距
      Reactor.effect(() => {
        const stateW = this.Ww.value;
        const stateH = this.Wh.value;
        // 宽变
      });
      Reactor.effect(() => {
        const v = this.direction.value;
        if (this.win) {
          this.win.document
            .$("#main")
            .classList.remove("horizontal", "vertical");
          this.win.document.$("#main").classList.add(v);
        }
      });
      Reactor.effect(() => {
        const winH = this.Wh.value;
        if (this.Wy.value + winH > this.Oh.value) {
          this.Wy.value = this.Oh.value - winH;
        }
      });
    }
  }

  /**
   * 初始化窗口，或者当窗口被意外关闭后重新创建窗口。
   */
  createWin() {
    if (!this.win) {
      this.win = new Window({
        url: "./dl.html",
        type: Window.POPUP_WINDOW,
        caption: this.title.value,
        width: this.Ww.value * 2,
        height: this.Wh.value * 2,
        x: this.Wx.value + this.Ow.value,
        y: this.Wy.value + this.Oh.value,
        // parent: Window.this,
        state: this.isShow ? Window.WINDOW_SHOWN : Window.WINDOW_HIDDEN,
      });
      this.win.document.$("#main").classList.add(this.direction.value);
      this.win.document.$("#main").innerText = this.content.value;
      this.win.on("closerequest", () => (this.win = null));
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

  /**
   * 校正位置，刷新视图
   */
  updateWin() {
    // 校正位置
    if (this.win) {
      const wState = Math.abs(this.Wx.value) + this.Ww.value > this.Ow.value;
      if (wState) {
        if (this.Wx.value < 0) {
          this.Wx.value = -(this.Ow.value - this.Ww.value);
        } else {
          this.Wx.value = this.Ow.value - this.Ww.value;
        }
      }
      const hState = Math.abs(this.Wy.value) + this.Wh.value > this.Oh.value;
      if (hState) {
        if (this.Wy.value < 0) {
          this.Wy.value = -(this.Oh.value - this.Wh.value);
        } else {
          this.Wy.value = this.Oh.value - this.Wh.value;
        }
      }
    }
    // 刷新视图
    if (this.win) {
      this.win.activate();
    }
  }

  render() {
    return (
      <div class="group">
        <details>
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
                <input
                  name="width"
                  type="number"
                  min="0"
                  max={String(this.Ow)}
                  step="1"
                  state-value={this.Ww}
                />
              </td>
              <td class="col-end">
                <input
                  type="hslider"
                  min="0"
                  max={String(this.Ow)}
                  step="1"
                  state-value={this.Ww}
                />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="height">高度</label>
              </td>
              <td class="col-2">
                <input
                  name="height"
                  type="number"
                  min="0"
                  max={String(this.Oh)}
                  step="1"
                  state-value={this.Wh}
                />
              </td>
              <td class="col-end">
                <input
                  type="hslider"
                  min="0"
                  max={String(this.Oh)}
                  step="1"
                  state-value={this.Wh}
                />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="top-margin">横坐标</label>
              </td>
              <td class="col-2">
                <input
                  name="top-margin"
                  type="number"
                  min={String(-(this.Ow - this.Ww))}
                  max={String(this.Ow - this.Ww)}
                  value="0"
                  step="1"
                  state-value={this.Wx}
                />
              </td>
              <td class="col-end">
                <input
                  type="hslider"
                  min={String(-(this.Ow - this.Ww))}
                  max={String(this.Ow - this.Ww)}
                  value="0"
                  step="1"
                  name="top-margin"
                  state-value={this.Wx}
                />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="right-margin">纵坐标</label>
              </td>
              <td class="col-2">
                <input
                  name="right-margin"
                  type="number"
                  min={String(-(this.Oh - this.Wh))}
                  max={String(this.Oh - this.Wh)}
                  value="0"
                  step="1"
                  state-value={this.Wy}
                />
              </td>
              <td class="col-end">
                <input
                  type="hslider"
                  min={String(-(this.Oh - this.Wh))}
                  max={String(this.Oh - this.Wh)}
                  value="0"
                  step="1"
                  name="top-margin"
                  state-value={this.Wy}
                />
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
              <button onclick={this.hiddenWin.bind(this)}>隐藏</button>
              <button onclick={this.showWin.bind(this)}>显示</button>
              <button onclick={this.updateWin.bind(this)}>刷新</button>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}
