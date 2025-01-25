import * as sys from "@sys";
import { ColorInput } from "sciter:color-selector.js";
import { Row1, Row2, Row3, LabelNumberSlider, LabelText } from "./layout.jsx";

/**
 * 一个单独的春联
 */
export class Foo extends Element {
  /** Oxy 表示屏幕中心坐标，Ow 表示屏幕宽度的一半 */
  Ow = Reactor.signal(512);
  /** Oxy 表示屏幕中心坐标，Oh 表示屏幕高度的一半 */
  Oh = Reactor.signal(384);

  win = null;
  /** Wxy 表示春联窗口中心的坐标，基于 Oxy 坐标进行计算 */
  Wx = Reactor.signal(0);
  /** Wxy 表示春联窗口中心的坐标，基于 Oxy 坐标进行计算 */
  Wy = Reactor.signal(0);
  /** Wxy 表示春联窗口中心的坐标，基于 Oxy 坐标进行计算 */
  Ww = Reactor.signal(0);
  /** Wxy 表示春联窗口中心的坐标，基于 Oxy 坐标进行计算 */
  Wh = Reactor.signal(0);

  /** Oxy 表示屏幕中心坐标， Ow 表示屏幕宽度的一半, Oh 表示屏幕高度的一半 */
  Owh = Reactor.signal({ w: 512, h: 384 });
  /** Wxy 表示春联窗口中心的坐标，基于 Oxy 坐标进行计算 */
  Wxywh = Reactor.signal({ x: 0, y: 0, w: 0, h: 0 });

  title = Reactor.signal("");
  content = Reactor.signal("");
  direction = Reactor.signal("horizontal");

  /** 显示窗口 */
  isShow = false;
  /** 窗口背景透明 */
  frameType = Reactor.signal("extended");
  /** 展开 */
  isOpen = false;

  fColor = Reactor.signal("#000000");
  bColor = Reactor.signal("#FFFFFF");
  fontSize = Reactor.signal(49);
  fontStyle = Reactor.signal("normal");
  fontFamily = Reactor.signal("Arial");

  frontTransform = Reactor.signal("");
  backTransform = Reactor.signal("");

  constructor(props, kids) {
    super(props, kids);
    // Window.this.modal(<info>Foo {this.title} 新建</info>);
  }

  this({
    title = "福",
    content = "福",
    ww = 50,
    wh = 50,
    wx = 0,
    wy = 0,
    direction = "horizontal",
    isShow = false,
    isOpen = false,
    frameType = "extended",
    fcolor = "gold",
    bcolor = "red",
    fontSize = 49,
    fontFamily = "Arial",
    frontTransform = "",
    backTransform = "",
  }) {
    if (this.win) {
      // 组件刷新时执行
      this.isShow = isShow;
      // Window.this.modal(<info>{String(this.isShow)} {typeof this.isShow}</info>);
      if (this.isShow.value) {
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
      this.frameType.value = frameType;
      this.isOpen = isOpen;
      this.fColor.value = fcolor;
      this.bColor.value = bcolor;
      this.fontSize.value = fontSize;
      this.fontFamily.value = fontFamily;
      this.frontTransform.value = frontTransform;
      this.backTransform.value = backTransform;
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
      // 响应窗口背景
      Reactor.effect(() => {
        const v = this.frameType.value;
        if (this.win) {
          this.win.frameType = v;
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
      // 响应颜色变化
      Reactor.effect(() => {
        const v = this.fColor.value;
        if (this.win) {
          this.win.document.$("#main").style.color = v;
        }
      });
      Reactor.effect(() => {
        const v = this.bColor.value;
        if (this.win) {
          this.win.document.$("#wrapper").style.backgroundColor = v;
        }
      });
      // 响应字体大小变化
      Reactor.effect(() => {
        const v = this.fontSize.value;
        if (this.win) {
          this.win.document.$("#main").style.fontSize = `${v}px`;
        }
      });
      // 响应字体变化
      Reactor.effect(() => {
        const v = this.fontFamily.value;
        if (this.win) {
          this.win.document.$("#main").style.fontFamily = v;
        }
      });
      // 前景变换
      Reactor.effect(() => {
        const v = this.frontTransform.value;
        if (this.win) {
          this.win.document.$("#main").style.transform = v;
        }
      });
      // 背景变换
      Reactor.effect(() => {
        const v = this.backTransform.value;
        if (this.win) {
          this.win.document.$("#wrapper").style.transform = v;
        }
      });
    }
  }

  fcEl = null;
  bcEl = null;

  handleC(e) {
    // const color = e.target.value;
    // const c = CSS.set`:root {
    //   background-color: ${this.fontColor};
    // }`;
    if (this.fcEl) {
      this.fcEl.style.backgroundColor = this.fColor.value;
    }
    if (this.bcEl) {
      this.bcEl.style.backgroundColor = this.bColor.value;
    }
  }

  /**
   * 初始化窗口，或者当窗口被意外关闭后重新创建窗口。
   */
  createWin() {
    if (!this.win) {
      this.win = new Window({
        url: "./couplet.html",
        type: Window.POPUP_WINDOW,
        caption: this.title.value,
        width: this.Ww.value * 2,
        height: this.Wh.value * 2,
        x: this.Wx.value + this.Ow.value,
        y: this.Wy.value + this.Oh.value,
        // parent: Window.this,
        state: this.isShow ? Window.WINDOW_SHOWN : Window.WINDOW_HIDDEN,
      });
      this.win.frameType = this.frameType.value;
      this.win.document.$("#main").classList.add(this.direction.value);
      this.win.document.$("#main").innerText = this.content.value;
      this.win.on("closerequest", () => (this.win = null));
      // 前景变换
      this.win.document.$("#main").style.transform = this.frontTransform.value;
      // 背景变换
      this.win.document.$("#wrapper").style.transform =
        this.backTransform.value;
      this.win.document.$("#main").style.fontFamily = this.fontFamily.value;
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

  async save() {
    const dir = `./data/`;
    const dataPath = `${dir}${this.title.value}.json`;
    // 验证目录是否存在，并创建新目录
    try {
      // sys.fs.statSync 获取不到目录返回 null
      // await sys.fs.stat 获取不到目录抛出错误
      const stat = sys.fs.statSync(dir);
      if (stat === null) {
        await sys.fs.mkdir(dir, 0o777);
      }
      // Window.this.modal(<info>{stat === null}</info>);
    } catch (e) {
      Window.this.modal(<alert caption="目录不存在">目录不存在{e}</alert>);
    }
    // 创建文件
    try {
      const config = {
        title: this.title.value,
        content: this.content.value,
        ww: this.Ww.value,
        wh: this.Wh.value,
        wx: this.Wx.value,
        wy: this.Wy.value,
        direction: this.direction.value,
        // isShow: this.isShow,
        isOpen: this.isOpen,
        frameType: this.frameType.value,
        fcolor: this.fColor.value,
        bcolor: this.bColor.value,
        fontSize: this.fontSize.value,
        fontFamily: this.fontFamily.value,
        frontTransform: this.frontTransform.value,
        backTransform: this.backTransform.value,
      };
      const json = JSON.stringify(config, null, 2);
      const file = await sys.fs.open(dataPath, "w+", 0o666);
      await file.write(json);
      await file.close();
      Window.this.modal(
        <alert caption="保存成功">配置文件已保存到 {dataPath}</alert>
      );
    } catch (e) {
      Window.this.modal(<alert caption="保存失败">配置保存失败{e}</alert>);
    }
  }

  render() {
    // Window.this.modal(<info>Foo render</info>);
    return (
      <div class="group">
        <details open={this.isOpen}>
          <summary>{this.title}</summary>
          <hr></hr>
          <LabelText label="分组标题" state-value={this.title} />
          <table>
            <Row2>
              <label for="top-text">内容</label>{" "}
              <input type="text" name="top-text" state-value={this.content} />
            </Row2>
            <Row2>
              <label for="direction">文字方向</label>
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
            </Row2>
          </table>
          <hr />
          <LabelNumberSlider label="宽度" min="0" max={String(this.Ow)} state-value={this.Ww} />
          <LabelNumberSlider label="高度" min="0" max={String(this.Oh)} state-value={this.Wh} />
          <LabelNumberSlider label="横坐标" min={String(-(this.Ow - this.Ww))} max={String(this.Ow - this.Ww)} state-value={this.Wx} />
          <LabelNumberSlider label="纵坐标" min={String(-(this.Oh - this.Wh))} max={String(this.Oh - this.Wh)} state-value={this.Wy} />
          <hr />
          <LabelNumberSlider label="字体大小" min="0" max={String(this.Ow * 2)} state-value={this.fontSize} />
          <LabelText label="字体" state-value={this.fontFamily} />
          <LabelText label="前景变换" state-value={this.frontTransform} />
          <LabelText label="背景变换" state-value={this.backTransform} />
          <table>
            <tr>
              <td class="col-1">
                <label for="frameType">窗口类型</label>
              </td>
              <td class="col-end" colspan="2">
                <input
                  type="radio"
                  name="frameType"
                  id="transparentFrame"
                  value="transparent"
                  checked={this.frameType.value === "transparent"}
                  onchange={() => (this.frameType.value = "transparent")}
                />
                <label for="transparentFrame">透明</label>
                <span>&nbsp;&nbsp;</span>
                <input
                  type="radio"
                  name="frameType"
                  id="extendedFrame"
                  value="extended"
                  checked={this.frameType.value === "extended"}
                  onchange={() => (this.frameType.value = "extended")}
                />
                <label for="extendedFrame">无边框</label>
                <span>&nbsp;&nbsp;</span>
                <input
                  type="radio"
                  name="frameType"
                  id="standardFrame"
                  value="standard"
                  checked={this.frameType.value === "standard"}
                  onchange={() => (this.frameType.value = "standard")}
                />
                <label for="standardFrame">标准窗口</label>
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="fgc">前景色</label>
              </td>
              <td class="col-2" var={this.fcEl}>
                <span>{this.fColor}</span>
              </td>
              <td class="col-end">
                <input
                  type="text"
                  name=""
                  id=""
                  state-value={this.fColor}
                  onchange={this.handleC.bind(this)}
                />
              </td>
            </tr>
            <tr>
              <td class="col-1">
                <label for="bgc">背景色</label>
              </td>
              <td class="col-2" var={this.bcEl}>
                <span>{this.bColor}</span>
              </td>
              <td class="col-end">
                <input
                  type="text"
                  name=""
                  id=""
                  state-value={this.bColor}
                  onchange={this.handleC.bind(this)}
                />
              </td>
            </tr>
            <tr>
              <td class="col-end right" colspan="3">
                <button onclick={this.save.bind(this)}>保存</button>
                <button onclick={this.updateWin.bind(this)}>刷新</button>
              </td>
            </tr>
          </table>
          <hr />
        </details>
        <table>
          <tr>
            <td class="col-1"></td>
            <td class="col-2"></td>
            <td class="col-end right">
              <button>关闭（不保存）</button>
              <button onclick={this.hiddenWin.bind(this)}>隐藏</button>
              <button onclick={this.showWin.bind(this)}>显示</button>
            </td>
          </tr>
        </table>
      </div>
    );
  }

  componentDidMount() {
    // Window.this.modal(<info>组件加载完成</info>);
    this.handleC();
  }
}
