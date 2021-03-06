import * as R from 'ramda';

import { MSGS_ALL_INFO } from '../../constants';
import { dumpInt } from '../int';
import { dumpVector } from '../vector';
import { dumpBytes } from '../bytes';
import { buildDumpFunc } from '../../utils';

const dumpConstructor = R.pipe(R.always(MSGS_ALL_INFO), dumpInt);
const dumpMsgIds = R.pipe(R.prop('msgIds'), dumpVector);
const dumpInfo = R.pipe(R.prop('info'), dumpBytes);

export default buildDumpFunc([dumpConstructor, dumpMsgIds, dumpInfo]);
