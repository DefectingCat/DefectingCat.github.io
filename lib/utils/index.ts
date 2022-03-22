export const sortByDate = (
  { date: a }: { date: string },
  { date: b }: { date: string }
) => {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  } else {
    return 0;
  }
};
