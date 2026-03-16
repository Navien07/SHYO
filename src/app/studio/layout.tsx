/**
 * Dedicated layout for the embedded Sanity Studio.
 * Must provide its own <html> and <body> to avoid inheriting the locale app layout.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
