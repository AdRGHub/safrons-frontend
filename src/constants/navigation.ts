import { HomeIcon, MapIcon, BookmarkIcon, InformationCircleIcon, BookOpenIcon, TrophyIcon } from '@heroicons/react/24/outline';

export const PUBLIC_NAV_LINKS = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang', path: '/about' },
  { label: 'Glosarium', path: '/glossary' }
];

export const AUTHENTICATED_NAV_LINKS = [
  { label: 'Beranda', path: '/' },
  { label: 'Peta', path: '/dashboard' },
  { label: 'Peringkat', path: '/ranking' },
  { label: 'Tersimpan', path: '/records' },
  { label: 'Tentang', path: '/about' },
  { label: 'Glosarium', path: '/glossary' }
];

export const BOTTOM_NAV_LINKS = [
  { label: 'Beranda', path: '/', icon: HomeIcon },
  { label: 'Peta', path: '/dashboard', icon: MapIcon },
  { label: 'Peringkat', path: '/ranking', icon: TrophyIcon },
  { label: 'Tersimpan', path: '/records', icon: BookmarkIcon },
  { label: 'Tentang', path: '/about', icon: InformationCircleIcon },
  { label: 'Glosarium', path: '/glossary', icon: BookOpenIcon }
];
