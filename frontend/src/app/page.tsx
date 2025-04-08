import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-10">
      <h1>
        PUTagent <br /> wsparcie studenckie
      </h1>
      <h2>heading2</h2>
      <h3>heading3</h3>
      <div className="space-x-10 **:underline">
        <Link href="/chat">Chat</Link>
        <Link href="/docs">Docs</Link>
      </div>
    </div>
  );
}
