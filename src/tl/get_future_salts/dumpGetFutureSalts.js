import * as R from 'ramda';
import { GET_FUTURE_SALTS } from '../../constants';
import { dumpInt } from '../int';
import { buildDumpFunc } from '../../utils';


const dumpType = R.pipe(R.always(GET_FUTURE_SALTS), dumpInt);
const dumpNum = R.pipe(R.prop('num'), dumpInt);


/**
 * @returns {ArrayBuffer}
 */
export default buildDumpFunc([dumpType, dumpNum]);
