import wilsonScore from 'wilson-score';

export default function score(average, n) {
  const upvotes = n * (average / 5);
  return wilsonScore(upvotes, n);
}
