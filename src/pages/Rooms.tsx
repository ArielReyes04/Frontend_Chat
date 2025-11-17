import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/room.service';
import type { Room } from '../types/room';

export const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await roomService.getAll();
        setRooms(data);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar salas');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Cargando salas...</div>;
  if (error) return (
    <div style={{ padding: 16 }}>
      <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>
      <button onClick={() => location.reload()}>Reintentar</button>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <h2>Salas disponibles</h2>
      {rooms.length === 0 && <p>No hay salas.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rooms.map((r) => (
          <li key={r.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              {r.description ? <div style={{ color: '#555', fontSize: 14 }}>{r.description}</div> : null}
            </div>
            <button onClick={() => navigate(`/chat/${r.id}`)}>Entrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};