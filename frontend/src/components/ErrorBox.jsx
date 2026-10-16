export default function ErrorBox({ error }) {
  if (!error) return null;
  return (
    <div className="error" role="alert">
      <strong>{error.message}</strong>
      {error.errors?.length > 0 && (
        <ul>{error.errors.map((e, i) => <li key={i}>{e.field}: {e.message}</li>)}</ul>
      )}
    </div>
  );
}
