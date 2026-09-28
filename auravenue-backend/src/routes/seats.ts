import { Router, Request, Response } from 'express';
import { query } from '../config/db';

const router = Router();

// GET /api/events/:eventId/seats
// Event එකට අදාළ Seats Layout එක සහ ඒවයේ සැබෑ තත්ත්වය (Status) DB එකෙන් ලබා ගැනීම
router.get('/events/:eventId/seats', async (req: Request, res: Response): Promise<any> => {
  const { eventId } = req.params;

  try {
    // SQL Query එක: Seats ටික ගෙනෙන අතරම, Reservations Table එකත් එක්ක Left Join කරලා 
    // Seat එක BOOKED ද නැත්නම් 10-Minute Hold Window එකක් ඇතුළේ HELD ද කියලා පරීක්ෂා කරයි.
    const seatQuery = `
      SELECT 
        s.id AS seat_id,
        s.row_label,
        s.seat_number,
        s.seat_type,
        s.price,
        COALESCE(r.status, 'AVAILABLE') AS current_status,
        r.held_until
      FROM seats s
      JOIN events e ON e.hall_id = s.hall_id
      LEFT JOIN reservations r ON r.seat_id = s.id 
                             AND r.event_id = e.id 
                             AND (r.status = 'BOOKED' OR (r.status = 'HELD' AND r.held_until > NOW()))
      WHERE e.id = $1
      ORDER BY s.row_label ASC, s.seat_number ASC;
    `;

    const { rows } = await query(seatQuery, [eventId]);

    return res.status(200).json({
      success: true,
      event_id: parseInt(eventId),
      total_seats: rows.length,
      seats: rows,
    });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;