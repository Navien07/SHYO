import { Nav } from './Nav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <Nav />
    </header>
  );
}
