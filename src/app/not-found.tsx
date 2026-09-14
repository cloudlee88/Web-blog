import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

export default function NotFound() {
  return (
    <div className="container flex max-w-md flex-col items-center py-24 text-center">
      <p className="font-heading text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try searching, or head back
        home.
      </p>
      <div className="mt-6 w-full">
        <SearchBar placeholder="Search tools…" />
      </div>
      <Link
        href="/"
        className="mt-4 inline-flex h-10 items-center rounded-md border border-input px-4 text-sm font-medium hover:bg-accent"
      >
        ← Back home
      </Link>
    </div>
  );
}
