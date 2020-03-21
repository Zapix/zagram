const JestEnvironmentJsdom = require('jest-environment-jsdom');
const { EventTarget } = require('event-target-shim');

class JsdomWithTextEncoderDecoderEnvironment extends JestEnvironmentJsdom {
  async setup() {
    await super.setup();
    this.global.TextDecoder = TextDecoder;
    this.global.TextEncoder = TextEncoder;
    this.global.EventTarget = EventTarget;
  }
}

module.exports = JsdomWithTextEncoderDecoderEnvironment;
