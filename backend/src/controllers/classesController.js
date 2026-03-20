const { getPool, sql } = require('../config/database');

const getTodaysClasses = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM vw_TodaysClasses');
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT c.*, cat.CategoryName, cat.ColorCode,
             i.FirstName + ' ' + i.LastName AS InstructorName
      FROM Classes c
      JOIN ClassCategories cat ON c.CategoryID = cat.CategoryID
      JOIN Instructors i ON c.InstructorID = i.InstructorID
      WHERE c.ScheduledDate >= CAST(GETDATE() AS DATE) AND c.IsActive = 1
      ORDER BY c.ScheduledDate, c.StartTime
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const bookClass = async (req, res) => {
  try {
    const { classId } = req.body;
    const memberId = req.user.id;
    const pool = getPool();
    const result = await pool.request()
      .input('MemberID', sql.Int, memberId)
      .input('ClassID',  sql.Int, classId)
      .execute('sp_BookClass');
    res.json({ success: true, data: result.recordset[0], message: 'Class booked successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('BookingID', sql.Int, req.params.bookingId)
      .input('MemberID',  sql.Int, req.user.id)
      .execute('sp_CancelBooking');
    res.json({ success: true, message: result.recordset[0].Message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('MemberID', sql.Int, req.user.id)
      .query(`
        SELECT b.BookingID, b.Status, b.AttendanceStatus, b.BookingDate,
               c.ClassName, c.ScheduledDate, c.StartTime, c.EndTime,
               cat.CategoryName, cat.ColorCode,
               i.FirstName + ' ' + i.LastName AS InstructorName
        FROM Bookings b
        JOIN Classes c   ON b.ClassID = c.ClassID
        JOIN ClassCategories cat ON c.CategoryID = cat.CategoryID
        JOIN Instructors i ON c.InstructorID = i.InstructorID
        WHERE b.MemberID = @MemberID
        ORDER BY c.ScheduledDate DESC
      `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTodaysClasses, getAllClasses, bookClass, cancelBooking, getMyBookings };