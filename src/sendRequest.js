import * as R from 'ramda';

const defaultRequestOpts = {
  method: 'POST',
  mode: 'cors',
};

const setBody = R.set(R.lensProp('body'), R.__, defaultRequestOpts);

const sendRequest = R.curry(R.binary(
  R.unapply(R.pipe(
    R.of,
    R.ap([
      R.nth(0),
      R.pipe(R.nth(1), setBody),
    ]),
    R.apply(fetch),
  )),
));

export default sendRequest;
