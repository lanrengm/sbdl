import * as sys from "@sys";

import { Bar } from "./cpts/Bar.jsx";

document.on("ready", async function () {
  try {
    // 设置系统托盘图标
    const data = await sys.fs.readFile("./assets/foo_512.png");
    Window.this.trayIcon({
      image: Graphics.Image.fromBytes(data),
      text: "赛博对联\nhi\nhi",
    });
    Window.this.on("trayiconclick", (evt) => {
      // Window.this.modal(<info>trayiconclick {evt}</info>);
      if (Window.this.state === Window.WINDOW_MINIMIZED) {
        Window.this.state = Window.WINDOW_SHOWN;
      } else if(Window.this.state === Window.WINDOW_SHOWN) {
        Window.this.state = Window.WINDOW_HIDDEN;
      } else {
        Window.this.state = Window.WINDOW_SHOWN;
      }
    });

    // 设置控制台窗口初始位置
    const [screenW, screenH] = Window.this.screenBox("frame", "dimension");
    Window.this.move(screenW * 0.65, screenH * 0.05);
    Window.this.state = Window.WINDOW_SHOWN;
    // 加载春联数据
    document.body.append(<App />);
  } catch (e) {
    Window.this.modal(<errir> index.js:document.on.ready: {e}</errir>);
  }
});

class App extends Element {
  render() {
    return (
      <div id="root">
        <Bar />
      </div>
    );
  }
}
