import { SUPPORTED_GAME_BUILD } from "@warlink/protocol";

export function App() {
  return (
    <main className="shell">
      <section className="panel" aria-labelledby="warlink-title">
        <p className="eyebrow">Development scaffold</p>
        <h1 id="warlink-title">WarLink</h1>
        <p className="summary">
          The workspace is ready for small, testable PRD slices. Host and join
          behavior has not been implemented yet.
        </p>

        <dl className="status-list">
          <div>
            <dt>Warcraft build</dt>
            <dd>{SUPPORTED_GAME_BUILD}</dd>
          </div>
          <div>
            <dt>Control plane</dt>
            <dd>Not configured</dd>
          </div>
          <div>
            <dt>Local agent</dt>
            <dd>Not connected</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
