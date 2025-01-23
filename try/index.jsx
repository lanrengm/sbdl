document.on("ready", function () {
  try {
    document.body.append(<Root />);
  } catch (e) {
    Window.this.modal(<info>{e}</info>);
  }
});

class Root extends Element {
  isSHow = Reactor.signal(false);

  toggleIsShow() {
    this.isSHow.send(!this.isSHow.value);
  }

  render() {
    return (
      <main>
        {this.isSHow}
        <Bar toggleIsShow={this.toggleIsShow.bind(this)} />
        <Foo state={this.isSHow} />
      </main>
    );
  }
}

class Bar extends Element {

  render(props, kids) {
    return (
      <button onclick={props.toggleIsShow}>Bar Button</button>
    );
  }
}

class Foo extends Element {

  render(props, kids) {
    return (
      <div>Foo: {props.state}</div>
    );
  }
}
