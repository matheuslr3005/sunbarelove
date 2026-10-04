export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <h1 className={`wordmark ${className}`}>
      <span className="block">Sun,Bar</span>
      <span className="block pl-[0.6em]">&amp; Love</span>
    </h1>
  );
}
