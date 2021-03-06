# zagram


Zagram is pure-js implementation of mtproto client library. 

Node version to build: `v12.13.0`


## Build Bundle

 1. `npm intall`
 2. `npm run build`
 3. pls check `dist/` directory for `zagram.min.js` and `zagram.min
 
 
## npm commands
 
  * `npm run test` - run tests for mtproto with jest
  * `npm run testw` - run tests in watch mode 
  * `npm run lint` - check code with eslint 
  * `npm run lintw` - eslint in watch mode
  * `npm run lint-fix` - fix lint errors
  * `npm run build` - build bundle
 
 
 ## Basic usage
 
 ### MTProto
 
 `MTProto(url: string, schema: Object)` - is a base class to keep connection with telegram server
 
 **Arguments**: 
 
  * url - url of telegram server 
  * schema - object with layer that should be used 
 
 
 **Public Methods**:
 
 `init()` - create authorization key and starts connection with telegram server 
 
 `addEventListener(handler: Function)` - added event listener for telegram event.
 
 ***Emited Events:***
  * `statusChanged`  - emits when auth key has been crated or creation has been failed
  * `telegramUpdate` - emits when update from telegram received. Event contains telegram `Updates` object in `detail` param

 `request(msg_obj: Object) -> Promise` - sends rpc call to telegram server. `msg_obj` generated 
 with `methodFromSchema` and `constructorFromSchema` functions. Returns promise with result;
 
 
 `upload(file: File, progressCb: Function) -> { promise: Promise, cancel: Functon }` - upload file to telegram server
 allow to track progress with `progressCb` function, returns promise and cancel function to stop uploading
 
 `download(location, options: {size: Number, progressCb: Functon}) -> { promise: Promise, cancel: Function } ` - downloads
 file from telegram server by file location, allow to track downloading progress if `progressCb` passed. 
 returns promise of downloaded file, and returns cancel function to cancel downloading;
 
 
 ### schema
 
 `schema` - current schema of 108 layer
 
 ### methodFromSchema
 
 `methodFromSchema(schema, methodName, params)` - returns rpc call object
 
 **Arguments**
 
 * `schema` - telegram schema object that will be used to generate request
 * `methodName` - method name that will be invoked on server 
 * `params` - object with params for `methodName`
 
 ### method
 
 `method(methodName, parmas)` - same as `methodFromSchema` but with predefined `schema`
 
 
 ### constructorFromSchema
 
 `constructorFromSchema(schema, constructorName, params)` - returns object build for telegram
 
 **Arguments**
 
 * `schema` - telegram schema object that will be used to generate request
 * `constructorName` - method name that will be invoked on server 
 * `params` - object with params for `methodName`
 
 ### construct
 
 `construct(constructorName, params)` - same as `constructorFromSchema` but with predefined schema
 
 ### isMessageOf
 
 `isMessageOf(type, obj)` - checks that `obj` has type `type`
 
 **Arguments**
 
 * `type` - string 
 * `obj` - object 
 
 ### isMethodOf
 
 `isMethodOf(methodName, obj)` - checks that `obj` is built as method with `methodName`
 
 **Arguments**
 
 * `methodName` - string
 * `obj` - object 
 
 
 ### isObjectOf
 
 `isObjectOf(constructorName, obj)` - checks that `obj` is built with constructor `constructorName`
 
 * `constructorName` - string
 * `obj` - object 
 
 ### tlLoads
 
 `tlLoads(schema, buffer)` - loads object from `buffer` by rules that describe in `schema`
 
 **Arguments**
 
 * `schema` - schema that will be used 
 * `buffer` - `ArayBuffer` to parse data 
 
 ### tlDumps
 
 
 `tlDumps(schema, obj)` - dumps object to `ArrayBuffer` by schema rules.
 
 **Arguments**
 
 * `schema` - schema that will be used 
 * `obj` - object to dump
 
 
 ## Example
 
 **Connect to telegram server:**
 
 ```js

const { MTProto, schema, pems, methodFromSchema } = zagram;

const url = 'ws://149.154.167.40/apiws';
  const API_ID = 1005944;
  const API_HASH = 'dfbf8ed1e37d1cd1ad370e7431ed8a87';

  const connection = new MTProto({url: url, protocols: ['binary']}, schema, pems);


  connection.addEventListener('statusChanged', (e) => {
    if (e.status === 'AUTH_KEY_CREATED') {
      const obj = methodFromSchema(
              schema,
              'invokeWithLayer',
              {
                layer: 108,
                query: methodFromSchema(
                        schema,
                        'initConnection',
                        {
                          api_id: API_ID,
                          device_model: navigator.userAgent,
                          system_version: navigator.platform,
                          app_version: '0.0.1',
                          system_lang_code: navigator.language,
                          lang_pack: '',
                          lang_code: 'ru-ru',
                          query: methodFromSchema(schema, 'help.getConfig'),
                        },
                ),
              },
      );
      connection.request(obj).then(console.log);
    }
  });

  connection.init();
```


**Connect to mtpylon server**

```js
const { MTProto, methodFromSchema } = zagram;

const WS_URL = 'ws://localhost:8081/ws';
const PUB_KEYS_URL = 'http://localhost:8081/pub-keys';
const SCHEMA_URL = 'http://localhost:8081/schema';


function initConnection(schema, pems) {
  return new Promise((resolve, reject) => {
    const connection = new MTProto(WS_URL, schema, pems);

    connection.addEventListener('statusChanged', (e) => {
       if (e.status === 'AUTH_KEY_CREATED') {
         resolve([connection, schema]);
       } else {
         reject(e.status);
       }
     });

     connection.init();
  });  
 
}

Promise
  .all([
    fetch(SCHEMA_URL).then(r => r.json()),
    fetch(PUB_KEYS_URL).then(r => r.json()),
  ])
  .then(([schema, pems]) => initConnection(schema, pems))
  .then(([connection, schema]) => {
    const rpc = methodFromSchema(schema, 'echo', {'content': 'hello world'});
    return connection.request(rpc);
  })
  .then(console.log);  
```

Application example: https://github.com/Zapix/echo-server