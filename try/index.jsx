document.on("ready", function () {
  try {
    document.body.append(<Root />);
  } catch (e) {
    Window.this.modal(<info>{e}</info>);
  }
});

class Root extends Element {
  v = Reactor.signal(0);
  render() {
    return (
      <main>
        <p>{this.v}</p>
        <LabelNumberSlider v={this.v}/>
      </main>
    );
  }
}
class LabelNumberSlider extends Element {
  value = Reactor.signal(0);
  min = Reactor.signal(0);
  max = Reactor.signal(100);

  show = Reactor.signal(0);

  constructor(props) {
    Reactor.effect(() => {
      Window.this.modal(<info>{}</info>)
    });
  }

  render(props) {
    return (
      <table>
        <tr>
          <td>
            <lable for="number">Number: {this.show}</lable>
          </td>
          <td>
            <input
              type="number"
              id="number"
              step="1"
              min={String(this.min)}
              max={String(this.max)}
              state-value={this.value}
              onchange={(e) => {this.show.value = e.target.value}}
            />
          </td>
          <td>
            <input
              type="hslider"
              min={String(this.min)}
              max={String(this.max)}
              state-value={this.value}
              onchange={(e) => {this.show.value = e.target.value}}
            />
          </td>
        </tr>
      </table>
    );
  }
}
