export class Row1 extends Element {
  render(props, kids) {
    return(
      <tr>
        <td class="col-end right">{kids}</td>
      </tr>
    );
  }
}

export class Row2 extends Element {
  render(props, kids) {
    return (
      <tr>
        <td class="col-1">{kids.length > 0 ? kids[0] : ""}</td>
        <td class="col-end">{kids.length > 1 ? kids.splice(1) : ""}</td>
      </tr>
    );
  }
}

export class Row3 extends Element {
  render(props, kids) {
    return (
      <tr>
        <td class="col-1">{kids.length > 0 ? kids[0] : ""}</td>
        <td class="col-2">{kids.length > 1 ? kids[1] : ""}</td>
        <td class="col-end">{kids.length > 2 ? kids.splice(2) : ""}</td>
      </tr>
    );
  }
}
