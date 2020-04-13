export default function* seqNoGenerator() {
  let seqNo = 1;
  let isContentRelated = false;
  while (true) {
    if (isContentRelated) {
      seqNo += 1;
    } else {
      seqNo += 2;
    }
    isContentRelated = yield seqNo;
  }
}
