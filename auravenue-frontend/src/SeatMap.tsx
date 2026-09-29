import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Seat {
  seat_id: number;
  row_label: string;
  seat_number: number;
  seat_type: string;
  price: string;
  current_status: 'AVAILABLE' | 'HELD' | 'BOOKED';
}

export const SeatMap: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Seats from Node.js Backend API
  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/1/seats');
      if (response.data.success) {
        setSeats(response.data.seats);
      }
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.current_status !== 'AVAILABLE') return;

    const isSelected = selectedSeats.some((s) => s.seat_id === seat.seat_id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seat_id !== seat.seat_id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + parseFloat(seat.price), 0);

  if (loading) return <h2 style={{ color: '#fff', textAlign: 'center' }}>Loading AuraVenue Seat Map...</h2>;

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '650px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#38bdf8' }}>AuraVenue — Interactive Seat Selection</h2>
      
      {/* Stage Screen Visual */}
      <div style={{ width: '80%', margin: '20px auto 40px auto', padding: '8px', background: 'linear-gradient(to bottom, #38bdf8, transparent)', textAlign: 'center', borderRadius: '8px 8px 0 0', fontWeight: 'bold', color: '#0f172a' }}>
        STAGE / MAIN SCREEN
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px', marginBottom: '30px' }}>
        {seats.map((seat) => {
          const isSelected = selectedSeats.some((s) => s.seat_id === seat.seat_id);
          let bgColor = '#334155'; // Available
          if (seat.current_status === 'BOOKED') bgColor = '#64748b';
          if (seat.current_status === 'HELD') bgColor = '#f59e0b';
          if (isSelected) bgColor = '#10b981';

          return (
            <button
              key={seat.seat_id}
              disabled={seat.current_status !== 'AVAILABLE'}
              onClick={() => handleSeatClick(seat)}
              style={{
                backgroundColor: bgColor,
                color: '#fff',
                border: 'none',
                padding: '12px 0',
                borderRadius: '8px',
                cursor: seat.current_status !== 'AVAILABLE' ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: '0.2s',
              }}
            >
              {seat.row_label}{seat.seat_number}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{ borderTop: '1px solid #334155', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0 }}>Selected: {selectedSeats.map((s) => `${s.row_label}${s.seat_number}`).join(', ') || 'None'}</p>
          <h3 style={{ margin: '5px 0 0 0', color: '#38bdf8' }}>Total: LKR {totalPrice.toLocaleString()}</h3>
        </div>
        <button
          disabled={selectedSeats.length === 0}
          style={{
            backgroundColor: selectedSeats.length > 0 ? '#38bdf8' : '#475569',
            color: '#0f172a',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Proceed to Reserve
        </button>
      </div>
    </div>
  );
};