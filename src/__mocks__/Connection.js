export default class Connection extends EventTarget {
  constructor() {
    super();
    this.send = jest.fn();
  }

  init() {
    this.dispatchEvent(new Event('wsOpen'));
  }
}
