export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <header className="global-header">MediConnect</header>
      <main className="page-content">{children}</main>
    </div>
  );
}