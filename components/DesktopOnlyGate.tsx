import React, { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';

interface DesktopOnlyGateProps {
  children: React.ReactNode;
}

const shouldShowDesktopOnly = () => {
  if (typeof window === 'undefined') return false;
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const narrowScreen = window.innerWidth < 1024;
  return coarsePointer || narrowScreen;
};

export const DesktopOnlyGate: React.FC<DesktopOnlyGateProps> = ({ children }) => {
  const [blocked, setBlocked] = useState(shouldShowDesktopOnly);

  useEffect(() => {
    const update = () => setBlocked(shouldShowDesktopOnly());
    const pointerQuery = window.matchMedia?.('(pointer: coarse)');

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    pointerQuery?.addEventListener?.('change', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      pointerQuery?.removeEventListener?.('change', update);
    };
  }, []);

  if (!blocked) return <>{children}</>;

  return (
    <main className="fixed inset-0 flex h-dvh w-dvw items-center justify-center overflow-hidden bg-black px-6 text-white">
      <section className="max-w-md text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5">
          <Monitor size={30} />
        </div>
        <h1 className="text-3xl font-bold tracking-normal">Desktop browser required</h1>
        <p className="mt-4 text-base leading-7 text-zinc-400">
          ACEStudio is built for desktop workflows. Timeline editing,
  hover interactions, video tools, and advanced controls are best
  experienced on a larger screen.
        </p>
      </section>
    </main>
  );
};
