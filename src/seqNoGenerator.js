export default function* seqNoGenerator() {
  let seqNo = 1;
  let isContentRelated = false;
  while (true) {
    if (isContentRelated) {
      seqNo += 1;
    } else {
      seqNo += 2;
    }
    console.log(`Generated seqNo: ${seqNo}`);
    isContentRelated = yield seqNo;
  }
}
