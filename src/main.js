
const dlPath = './dl/dl.html';

let tw = null;
let lw = null;
let rw = null;

document.on('click', 'button#show', function () {
  if (!tw) {
    tw = new Window({
      type: Window.POPUP_WINDOW,
      url: dlPath,
      width: 400,
      height: 100,
      parent: Window.this,
      alignment: 8,
    });
  } else {
    tw.state = Window.WINDOW_SHOWN;
  }
  if (!lw) {
    lw = new Window({
      type: Window.POPUP_WINDOW,
      url: dlPath,
      width: 100,
      height: 400,
      parent: Window.this,
      alignment: 6,
    });
  } else {
    lw.state = Window.WINDOW_SHOWN;
  }
  if (!rw) {
    rw = new Window({
      type: Window.POPUP_WINDOW,
      url: dlPath,
      width: 100,
      height: 400,
      parent: Window.this,
      alignment: 4,
    });
  } else {
    rw.state = Window.WINDOW_SHOWN;
  }
});
document.on('click', 'button#hidden', function () {
  // nw.close();
  if (tw) {
    tw.state = Window.WINDOW_HIDDEN;
  }
  if (lw) {
    lw.state = Window.WINDOW_HIDDEN;
  }
  if (rw) {
    rw.state = Window.WINDOW_HIDDEN;
  }
})