export default class Connection extends EventTarget {
  constructor() {
    super();
    this.send = jest.fn();
  }

  init() {
    this.dispatchEvent(new Event('wsOpen'));
  }

  close() {
    this.dispatchEvent(new Event('wsClose'));
  }

  error() {
    const error = new Error('some error');
    const event = new Event('wsError');
    event.error = error;
    this.dispatchEvent(event);
  }
}
