document.on("ready", function () {
  try {
    document.body.append(<Root />);
  } catch (e) {
    Window.this.modal(<info>{e}</info>);
  }
});

class Root extends Element {
  v = Reactor.signal(0);

  constructor(props, kids) {
    super(props, kids);
    // Reactor.effect(() => {
    //   const v = this.v.value;
    //   Window.this.modal(<info>root {v}</info>);
    // });
  }

  render() {
    return (
      <main>
        <p>{this.v}</p>
        <LabelNumberSlider maxd="100" state-value={this.v}/>
      </main>
    );
  }
}

class LabelNumberSlider extends Element {
  state = Reactor.signal(0);
  min = Reactor.signal(0);
  max = Reactor.signal(100);

  show = Reactor.signal(0);

  constructor(props, kids) {
    Window.this.modal(<info>LNS 新建</info>);
    super(props, kids);
    Reactor.effect(() => {
      const v = this.state.value;
      try {
        Window.this.modal(<info>label {JSON.stringify(props)}</info>);
      } catch (e) {
        Window.this.modal(<info>{e}</info>);
      }
      props["state-value"].value = v;
    });
  }

  render(props) {
    Window.this.modal(<info>LNS render</info>);
    return (
      <table>
        <tr>
          <td>
            {/* <lable for="number">Number: {this.show}</lable> */}
            <lable for="number">Number: {props["state-value"]}</lable>
          </td>
          <td>
            <input
              type="number"
              id="number"
              step="1"
              min={String(this.min)}
              max={String(props.max)}
              // state-value={this.value}
              state-value={this.state}
              // onchange={(e) => {this.show.value = e.target.value}}
              // onchange={(e) => {props["state-value"].value = e.target.value}}
            />
          </td>
          <td>
            <input
              type="hslider"
              min={String(this.min)}
              max={String(props.max)}
              // state-value={this.value}
              state-value={this.state}
              // onchange={(e) => {this.show.value = e.target.value}}
              // onchange={(e) => {props["state-value"].value = e.target.value}}
            />
          </td>
        </tr>
      </table>
    );
  }
}
