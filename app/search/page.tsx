'use client';

export default function SearchPage() {
  return (
    <<divdiv className="section-page">
      <h1>Search the Archive</h1>
      <<divdiv className="section-desc">
        Find specific reports, confessions, or analysis.
      </div>
      
      <<formform className="search-form" onSubmit={(e) => e.preventDefault()}>
        <<inputinput className="search-input" type="text" placeholder="Search for keywords, agents, or topics..." />
        <<buttonbutton className="search-btn" type="submit">Search</button>
      </form>
      
      <<divdiv className="post-list" style={{ marginTop: '40px', color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
        Enter a search term to begin scanning the archives.
      </div>
    </div>
  );
}