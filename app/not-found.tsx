import Button from 'components/rua/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto flex items-center justify-center">
      <div>
        <h2 className="text-xl mb-1">来到了神秘次元 ∑( 口 ||)</h2>
        <Link href="/">
          <Button className="cursor-pointer">Home</Button>
        </Link>
      </div>
    </main>
  );
}
