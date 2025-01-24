export class Row1 extends Element {
  render(props, kids) {
    return (
      <tr>
        <td class="col-end" colspan="3">
          {kids}
        </td>
      </tr>
    );
  }
}

export class Row2 extends Element {
  render(props, kids) {
    return (
      <tr>
        <td class="col-1">{kids.length > 0 ? kids[0] : ""}</td>
        <td class="col-end" colspan="2">
          {kids.length > 1 ? kids.splice(1) : ""}
        </td>
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

/**
 * LabelNumberSlider
 * @param {string} label
 * @param {number} min
 * @param {number} max
 * @param {number} "state-value"
 */
export class LabelNumberSlider extends Element {
  render(props, kids) {
    return (
      <table>
        <tr>
          <td class="col-1">
            <label>{props.label}</label>
          </td>
          <td class="col-2">
            <input
              type="number"
              min={props.min ? props.min : "0"}
              max={props.max ? props.max : "100"}
              step="1"
              state-value={props["state-value"]}
            />
          </td>
          <td class="col-end">
            <input
              type="hslider"
              min={props.min ? props.min : "0"}
              max={props.max ? props.max : "100"}
              step="1"
              state-value={props["state-value"]}
            />
          </td>
        </tr>
      </table>
    );
  }
}
