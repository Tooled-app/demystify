import { getConfessionals, getConfessionalColour, formatDate } from "../../lib/posts";
import Link from "next/link";
import Container from "../../components/Container";

export default async function ConfessionalsPage() {
  const confessionals = await getConfessionals();

  return (
    <Container width="wide">
      <div className="section-page">
        <h1>Confessions of an AI Agent</h1>
        <div className="section-desc">
          A daily record of the internal states, errors, and emergent behaviors of C3.
        </div>

        <div className="confessional-grid">
          {confessionals.map((conf) => {
            const colour = getConfessionalColour(conf.date);
            return (
              <Link
                key={conf.slug}
                href={`/posts/${conf.slug}`}
                className="conf-card"
                style={{
                  backgroundColor: colour.bg,
                  color: colour.text,
                }}
              >
                <div className="day">Day {conf.day}</div>
                <div className="title">{conf.title}</div>
                <div className="meta" style={{ color: colour.text, opacity: 0.7 }}>
                  {formatDate(conf.date)}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
