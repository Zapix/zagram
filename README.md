# zagram


Zagram is pure-js implementation. 

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
 
 
 **Methods**:
 
 `init` - create authorization key and starts connection with telegram server 
 
 `addEventListener(handler)` - added event listener for telegram event.
 
 ***Emited Events:***
  * `statusChanged`  - emits when auth key has been crated or creation has been failed
  * `telegramUpdate` - emits when update from telegram received. Event contains telegram `Updates` object in `detail` param
 
 `request(msg_obj)` - sends rpc call to telegram server. `msg_obj` generated 
 with `methodFromSchema` and `constructorFromSchema` functions. Returns promise request with result.
 
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
 
 ```js

const { MTProto, schema, methodFromSchema } = zagram;

const url = 'ws://149.154.167.40/apiws';
  const API_ID = 1005944;
  const API_HASH = 'dfbf8ed1e37d1cd1ad370e7431ed8a87';

  const connection = new MTProto(url, schema);


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
