// [TODO]
export default function imageProcess({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `/${src}`;
}
