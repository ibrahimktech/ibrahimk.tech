import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted">That page doesn&apos;t exist, or it hasn&apos;t been published yet.</p>
      <p className="mt-6">
        <Link href="/" className="link">
          Go home
        </Link>
      </p>
    </div>
  );
}
