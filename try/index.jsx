document.on("ready", function () {
  try {
    document.body.append(<Root />);
  } catch (e) {
    Window.this.modal(<info>{e}</info>);
  }
});

class Root extends Element {
  list = Reactor.signal([1, 2, 3, 4]);

  render() {
    // const listItems = [];
    const listItems = this.list.value.map((item, index) => (
      <p key={index}>{item}</p>
    ));
    try {
    } catch (e) {
      Window.this.modal(<info>{e}</info>);
    }

    return (
      <div>
        <button onclick={() => this.list.value.push(1)}>add</button>
        <div>{listItems}</div>
      </div>
    );
  }
}

// class Bar extends Element {
//   list;
//   count = Reactor.signal(0);

//   this({
//     list,
//   }) {
//     this.list = list;
//   }

//   render() {
//     return (
//       <button onclick={() => {this.list.push(this.count.value); this.count.value++;}}>Bar Button</button>
//     );
//   }
// }

// class Foo extends Element {
//   list;

//   this({list}) {
//     this.list = list;
//   }

//   render() {
//     const listItems = this.list.map((item, index) => <p key={index}>{item}</p> );

//     return (
//       <div>Foo P
//         <p>{listItems}</p>
//       </div>
//     );
//   }
// }
