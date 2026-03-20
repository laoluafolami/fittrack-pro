const { getPool, sql } = require('../config/database');

const getAllMembers = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM vw_ActiveMembers');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMember = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('MemberID', sql.Int, req.params.id)
      .query(`SELECT MemberID, FirstName, LastName, Email, Phone,
                     DateOfBirth, Gender, Address, ProfilePhoto, Role, CreatedAt
              FROM Members WHERE MemberID = @MemberID AND IsActive = 1`);
    if (!result.recordset[0]) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getExpiringMemberships = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM vw_ExpiringMemberships');
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllMembers, getMember, getExpiringMemberships };