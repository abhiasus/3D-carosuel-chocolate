export default function LoadingScreen({ done }) {
  return (
    <div className={`loader ${done ? 'done' : ''}`}>
      <div className="loader-drop"><i /></div>
      <p>Melting the chocolate</p>
    </div>
  );
}
