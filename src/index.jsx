import * as sys from "@sys";
import { encode, decode } from "@sciter";

import { Foo } from "./cpts.jsx";

const dlPath = 'dl.html';
const dataPath = 'data.json';

class ChineseCouplet {
  topText = "";
  rightText = "";
  leftText = "";

  topWin = null;
  rightWin = null;
  leftWin = null;

  initTopWin() {
    if (!this.topWin) {
      this.topWin = new Window({
        type: Window.POPUP_WINDOW,
        caption: "横批",
        url: dlPath,
        width: 400,
        height: 100,
        // parent: Window.this,
        alignment: 8,
      });
      this.topWin.document.$("#main").classList.add("horizontal");
      this.topWin.document.$("#main").innerText = this.topText;
      this.topWin.on('closerequest', () => {
        Window.this.modal(<alert caption="警告">关闭横批</alert>);
        this.topWin = null;
      });
    }
  }

  initRightWin() {
    if (!this.rightWin) {
      this.rightWin = new Window({
        type: Window.POPUP_WINDOW,
        caption: "上联",
        url: dlPath,
        width: 100,
        height: 400,
        // parent: Window.this,
        alignment: 6,
      });
      this.rightWin.document.$("#main").classList.add("vertical");
      this.rightWin.document.$("#main").innerText = this.rightText;
      this.rightWin.on('closerequest', () => {
        Window.this.modal(<alert caption="警告">关闭上联</alert>);
        this.rightWin = null;
      });
    }
  }

  initLeftWin() {
    if (!this.leftWin) {
      this.leftWin = new Window({
        type: Window.POPUP_WINDOW,
        caption: "下联",
        url: dlPath,
        width: 100,
        height: 400,
        // parent: Window.this,
        alignment: 4,
      });
      this.leftWin.document.$("#main").classList.add("vertical");
      this.leftWin.document.$("#main").innerText = this.leftText;
      this.leftWin.on('closerequest', () => {
        Window.this.modal(<alert caption="警告">关闭下联</alert>);
        this.leftWin = null;
      });
    }
  }

  init(data = { topText: "", rightText: "", leftText: "" }) {
    // this.topText = data.topText;
    this.rightText = data.rightText;
    this.leftText = data.leftText;
    // this.initTopWin();
    this.initRightWin();
    this.initLeftWin();
  }

  show() {
    // if (this.topWin) {
    //   this.topWin.state = Window.WINDOW_SHOWN;
    //   this.topWin.document.$("#main").innerText = this.topText;
    // } else {
    //   this.initTopWin();
    // }
    if (this.rightWin) {
      this.rightWin.state = Window.WINDOW_SHOWN;
      this.rightWin.document.$("#main").innerText = this.rightText;
    } else {
      this.initRightWin();
    }
    if (this.leftWin) {
      this.leftWin.state = Window.WINDOW_SHOWN;
      this.leftWin.document.$("#main").innerText = this.leftText;
    } else {
      this.initLeftWin();
    }
  }

  hidden() {
    if (this.topWin) {
      this.topWin.state = Window.WINDOW_HIDDEN;
    }
    if (this.rightWin) {
      this.rightWin.state = Window.WINDOW_HIDDEN;
    }
    if (this.leftWin) {
      this.leftWin.state = Window.WINDOW_HIDDEN;
    }
  }
}

document.on('change', 'input#top-text', function (evt) {
  // Window.this.modal(<info>{evt.target.value}</info>);;
  if (chineseCouplet.topWin) {
    const el = chineseCouplet.topWin.document.$('#main');
    el.innerText = evt.target.value;
  }
});
document.on('change', 'input#right-text', function (evt) {
  // Window.this.modal(<info>{evt.target.value}</info>);;
  if (chineseCouplet.rightWin) {
    const el = chineseCouplet.rightWin.document.$('#main');
    el.innerText = evt.target.value;
  }
});
document.on('change', 'input#left-text', function (evt) {
  // Window.this.modal(<info>{evt.target.value}</info>);;
  if (chineseCouplet.leftWin) {
    const el = chineseCouplet.leftWin.document.$('#main');
    el.innerText = evt.target.value;
  }
});
document.on('click', 'button#save', async function () {
  const config = {
    topText: document.$('input#top-text').value,
    rightText: document.$('input#right-text').value,
    leftText: document.$('input#left-text').value,
  };
  const json = JSON.stringify(config, null, 2);
  const file = await sys.fs.open(dataPath, "w+", 0o666);
  await file.write(json);
  await file.close();
  document.$('#result').innerText = `保存数据成功!`;
});



function MainGroup({ chineseCouplet: chineseCouplet }) {
  return (
    <details open class="group">
      <summary>整体设置</summary>
      <hr></hr>
      <table >
        <tr>
          <td class="col-1"></td>
          <td class="col-2"></td>
        </tr>
        <tr>
          <td class="col-1">上联</td>
          <td class="col-2">
            <button onclick={() => chineseCouplet.rightWin.state = Window.WINDOW_SHOWN}>显示</button>
            <button onclick={() => chineseCouplet.rightWin.state = Window.WINDOW_HIDDEN}>隐藏</button>
          </td>
        </tr>
        <tr>
          <td class="col-1">下联</td>
          <td class="col-2">
            <button onclick={() => chineseCouplet.leftWin.state = Window.WINDOW_SHOWN}>显示</button>
            <button onclick={() => chineseCouplet.leftWin.state = Window.WINDOW_HIDDEN}>隐藏</button>
          </td>
        </tr>
        <tr>
          <td class="col-1"></td>
          <td class="col-2">
            <button onclick={chineseCouplet.show.bind(chineseCouplet)}>显示全部</button>
            <button onclick={chineseCouplet.hidden.bind(chineseCouplet)}>隐藏全部</button>
          </td>
        </tr >
      </table>
    </details>
  );
}

function TopGroup({ chineseCouplet: chineseCouplet }) {
  const state = {
    numberEl: null,
    sliderEl: null,
    _value: 0,
    get value() {
      return this._value;
    },
    set value(newValue) {
      try {
        document.$('#result').innerText = `new Value: ${newValue}`;
        if (newValue !== this._value) {
          this._value = newValue;
          const [x, y] = chineseCouplet.topWin.box("position", "client", "monitor")
          chineseCouplet.topWin.move(x, newValue);
        }
        if (newValue !== this.numberEl.value) {
          this.numberEl.value = newValue;
        }
        if (newValue !== this.sliderEl.value) {
          this.sliderEl.value = newValue;
        }
      } catch (e) {
        Window.this.modal(<alert caption="报错">{e}</alert>);
      }

    }
  }
  let title = "横批设置";
  return (
    <div class="group">
      <details open>
        <summary>{title}</summary>
        <hr></hr>
        <table>
          <tr>
            <td class="col-1"><label for="top-text">内容</label></td>
            <td class="col-2">
              <input type="text" name="top-text" id="top-text" />
            </td>
          </tr>
          <tr>
            <td class="col-1"><label for="top-margin">上边距</label></td>
            <td class="col-2">
              <input type="hslider" min="0" max="1000" value="0" step="1"
                var={state.sliderEl} name="top-margin"
                onchange={(evt) => state.value = evt.target.value}
              />
            </td>
          </tr>
          <tr>
            <td class="col-1" ></td>
            <td class="col-2">
              <input type="number" min="0" max="1000" value="0" step="1"
                var={state.numberEl}
                onchange={(evt) => state.value = evt.target.value}
              />
            </td>
          </tr>
          <tr>
            <td class="col-1"><label for="">宽度</label></td>
            <td class="col-2">
              <input type="hslider" min="0" max="1000" value="0" step="1" />
            </td>
          </tr>
          <tr>
            <td class="col-1"></td>
            <td class="col-2">
              <input type="number" min="0" max="1000" value="0" step="1"
              // var={}
              // onchange={}
              />
            </td>
          </tr>
          <tr>
            <td class="col-1"><label for="">高度</label></td>
            <td class="col-2">
              <input type="hslider" min="0" max="1000" value="0" step="1" />
            </td>
          </tr>
          <tr>
            <td class="col-1"></td>
            <td class="col-2">
              <input type="number" min="0" max="1000" value="0" step="1"
              // var={}
              // onchange={}
              />
            </td>
          </tr>
          <tr>
            <td class="col-1"><label for="fgc">前景色</label></td>
            <td class="col-2">
              <input type="color" value="black" name="fgc" id="" />
            </td>
          </tr>
          <tr>
            <td class="col-1"><label for="bgc">背景色</label></td>
            <td class="col-2"><input type="color" value="red" name="bgc" /></td>
          </tr>
        </table>
      </details>
      <table>
        <tr>
          <td class="col-1"></td>
          <td class="col-2">
            <button onclick={() => chineseCouplet.topWin.state = Window.WINDOW_SHOWN}>显示</button>
            <button onclick={() => chineseCouplet.topWin.state = Window.WINDOW_HIDDEN}>隐藏</button>
          </td>
        </tr>
      </table>
    </div>
  );
}

function RightGroup({ chineseCouplet: chineseCouplet }) {
  return (
    <details open class="group">
      <summary>上联设置</summary>
      <hr></hr>
      <table>
        <tr>
          <td class="col-1"><label for="right-text">上联</label></td>
          <td class="col-2">
            <input type="text" name="right-text" id="right-text" />
          </td>
        </tr>
      </table>
    </details>
  );
}

document.on('ready', async function () {
  const chineseCouplet = new ChineseCouplet();
  try {
    document.$('#root').append(<Foo title="横批" content="恭喜发财" />);
  } catch (e) {
    Window.this.modal(<alert caption="报错">{e}</alert>);
  }
  document.$('#root').append(<MainGroup chineseCouplet={chineseCouplet} />);
  document.$('#root').append(<TopGroup chineseCouplet={chineseCouplet} />);
  document.$('#root').append(<RightGroup chineseCouplet={chineseCouplet} />);
  try {
    const file = await sys.fs.open(dataPath, "r", 0o666);
    const data = JSON.parse(decode(await file.read(), "utf8"));
    await file.close();
    document.$('input#top-text').value = data.topText;
    document.$('input#right-text').value = data.rightText;
    document.$('input#left-text').value = data.leftText;

    document.$('#result').appendChild(document.createTextNode('数据加载成功!'));
  } catch (e) {
    Window.this.modal(<alert caption="警告">第一次启动，没有配置文件</alert>);
  }
  chineseCouplet.init({
    topText: document.$('input#top-text').value,
    rightText: document.$('input#right-text').value,
    leftText: document.$('input#left-text').value,
  });
  chineseCouplet.show();
});
