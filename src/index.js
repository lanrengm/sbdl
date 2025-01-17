
const dlPath = 'dl.html';

class ChineseCouplet {
  TopWin = null;
  RightWin = null;
  LeftWin = null;

  constructor() {
    // this.createTop();
    // this.createRight();
    // this.createLeft();
    // this.hidden();
  }

  createTop() {
    if (!this.TopWin) {
      this.TopWin = new Window({
        type: Window.POPUP_WINDOW,
        caption: "横批",
        url: dlPath,
        width: 400,
        height: 100,
        // parent: Window.this,
        alignment: 8,
      });
      this.TopWin.document.$("#main").classList.add("horizontal");
      this.TopWin.on('closerequest', () => {
        Window.this.modal(<alert caption="警告">关闭横批</alert>);
        this.TopWin = null;
      });
    }
  }

  createRight() {
    if (!this.RightWin) {
      this.RightWin = new Window({
        type: Window.POPUP_WINDOW,
        caption: "上联",
        url: dlPath,
        width: 100,
        height: 400,
        // parent: Window.this,
        alignment: 6,
      });
      this.RightWin.document.$("#main").classList.add("vertical");
      this.RightWin.on('closerequest', () => {
        Window.this.modal(<alert caption="警告">关闭上联</alert>);
        this.RightWin = null;
      });
    }
  }

  createLeft() {
    if (!this.LeftWin) {
      this.LeftWin = new Window({
        type: Window.POPUP_WINDOW,
        caption: "下联",
        url: dlPath,
        width: 100,
        height: 400,
        // parent: Window.this,
        alignment: 4,
      });
      this.LeftWin.document.$("#main").classList.add("vertical");
      this.LeftWin.on('closerequest', () => {
        Window.this.modal(<alert caption="警告">关闭下联</alert>);
        this.LeftWin = null;
      });
    }
  }

  show() {
    if (this.TopWin) {
      this.TopWin.state = Window.WINDOW_SHOWN;
    } else {
      this.createTop();
    }
    if (this.RightWin) {
      this.RightWin.state = Window.WINDOW_SHOWN;
    } else {
      this.createRight();
    }
    if (this.LeftWin) {
      this.LeftWin.state = Window.WINDOW_SHOWN;
    } else {
      this.createLeft();
    }
  }

  hidden() {
    if (this.TopWin) {
      this.TopWin.state = Window.WINDOW_HIDDEN;
    }
    if (this.RightWin) {
      this.RightWin.state = Window.WINDOW_HIDDEN;
    }
    if (this.LeftWin) {
      this.LeftWin.state = Window.WINDOW_HIDDEN;
    }
  }
}

const chineseCouplet = new ChineseCouplet();
document.on('click', 'button#show', function () {
  chineseCouplet.show();
  chineseCouplet.TopWin.document.$("#main").innerText = document.$('input#top-text').value;
  chineseCouplet.RightWin.document.$("#main").innerText = document.$('input#right-text').value;
  chineseCouplet.LeftWin.document.$("#main").innerText = document.$('input#left-text').value;
});
document.on('click', 'button#hidden', function () {
  chineseCouplet.hidden();
})
document.on('change', 'input#top-text', function (evt) {
  // Window.this.modal(<info>{evt.target.value}</info>);;
  if (chineseCouplet.TopWin) {
    const el = chineseCouplet.TopWin.document.$('#main');
    el.innerText = evt.target.value;
  }
});
document.on('change', 'input#right-text', function (evt) {
  // Window.this.modal(<info>{evt.target.value}</info>);;
  if (chineseCouplet.RightWin) {
    const el = chineseCouplet.RightWin.document.$('#main');
    el.innerText = evt.target.value;
  }
});
document.on('change', 'input#left-text', function (evt) {
  // Window.this.modal(<info>{evt.target.value}</info>);;
  if (chineseCouplet.LeftWin) {
    const el = chineseCouplet.LeftWin.document.$('#main');
    el.innerText = evt.target.value;
  }
});
document.on('click', 'button#save', async function () {
  const config = {
    topText: chineseCouplet.TopWin.document.$('#main').innerText,
    rightText: chineseCouplet.RightWin.document.$('#main').innerText,
    leftText: chineseCouplet.LeftWin.document.$('#main').innerText,
  };
  const json = JSON.stringify(config);
  const file = await sys.fs.open('config.json', "w+");
  await file.write(json);
  file.close();
});