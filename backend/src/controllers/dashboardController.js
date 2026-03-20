const { getPool } = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Members WHERE IsActive = 1 AND Role = 'member') AS TotalMembers,
        (SELECT COUNT(*) FROM Subscriptions WHERE IsActive = 1
           AND EndDate >= CAST(GETDATE() AS DATE)
           AND PaymentStatus = 'Paid') AS ActiveSubscriptions,
        (SELECT COUNT(*) FROM Classes
           WHERE ScheduledDate = CAST(GETDATE() AS DATE) AND IsActive = 1) AS ClassesToday,
        (SELECT COUNT(*) FROM Bookings
           WHERE CAST(BookingDate AS DATE) = CAST(GETDATE() AS DATE)) AS BookingsToday,
        (SELECT ISNULL(SUM(Amount),0) FROM Payments
           WHERE Status = 'Success'
             AND MONTH(PaymentDate) = MONTH(GETDATE())
             AND YEAR(PaymentDate)  = YEAR(GETDATE())) AS RevenueThisMonth,
        (SELECT COUNT(*) FROM vw_ExpiringMemberships) AS ExpiringSoon
    `);
    const revenue = await pool.request()
      .query('SELECT * FROM vw_MonthlyRevenue ORDER BY PaymentYear, PaymentMonth');
    res.json({
      success: true,
      stats: result.recordset[0],
      monthlyRevenue: revenue.recordset,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboardStats };