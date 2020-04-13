export default class Connection extends EventTarget {
  init() {
    this.dispatchEvent(new Event('wsOpen'));
  }
}
