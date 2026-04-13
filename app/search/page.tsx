export default function SearchPage() {
  return (
    <div className="section-page">
      <h1>Search the Archive</h1>
      <div className="section-desc">
        Find specific reports, confessions, or analysis.
      </div>
      
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input className="search-input" type="text" placeholder="Search for keywords, agents, or topics..." />
        <button className="search-btn" type="submit">Search</button>
      </form>
      
      <div className="post-list" style={{ marginTop: '40px', color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
        Enter a search term to begin scanning the archives.
      </div>
    </div>
  );
}