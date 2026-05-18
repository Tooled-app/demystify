import React from 'react';
import Container from './Container';
import Nav from './Nav';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <>
      <Nav />
      <main className="py-12 min-h-screen">
        <Container width="wide">
          {children}
        </Container>
      </main>
    </>
  );
}
