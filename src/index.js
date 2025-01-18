import * as sys from "@sys";
import { encode, decode } from "@sciter";

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

  show(data = { topText: "", rightText: "", leftText: "" }) {
    this.topText = data.topText;
    this.rightText = data.rightText;
    this.leftText = data.leftText;
    if (this.topWin) {
      this.topWin.state = Window.WINDOW_SHOWN;
      this.topWin.document.$("#main").innerText = this.topText;
    } else {
      this.initTopWin();
    }
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

const chineseCouplet = new ChineseCouplet();


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

document.on('change', 'input#top-margin', function (evt) {
  document.$('#result').innerText = `顶部距离: ${evt.target.value}`;
  const [x, y] = chineseCouplet.topWin.box("position", "client", "monitor")
  chineseCouplet.topWin.move(x, evt.target.value);
});

function MainGroup(chineseCouplet) {
  function show() {
    chineseCouplet.show({
      topText: document.$('input#top-text').value,
      rightText: document.$('input#right-text').value,
      leftText: document.$('input#left-text').value,
    });
  }
  return (
    <>
      <summary>整体设置</summary>
      <hr></hr>
      <table >
        <tr>
          <td class="col-1">横批</td>
          <td class="col-2">
            <button onclick={() => chineseCouplet.topWin.state = Window.WINDOW_SHOWN}>显示</button>
            <button onclick={() => chineseCouplet.topWin.state = Window.WINDOW_HIDDEN}>隐藏</button>
          </td>
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
            <button onclick={show}>显示全部</button>
            <button onclick={chineseCouplet.hidden.bind(chineseCouplet)}>隐藏全部</button>
          </td>
        </tr >
      </table>
    </>
  );
}


document.on('ready', async function () {
  const file = await sys.fs.open(dataPath, "r", 0o666);
  const data = JSON.parse(decode(await file.read(), "utf8"));
  await file.close();
  document.$('input#top-text').value = data.topText;
  document.$('input#right-text').value = data.rightText;
  document.$('input#left-text').value = data.leftText;
  chineseCouplet.show({
    topText: data.topText,
    rightText: data.rightText,
    leftText: data.leftText,
  });
  document.$('#result').appendChild(document.createTextNode('数据加载成功!'));
  document.$('#main-group').content(MainGroup(chineseCouplet));
});
