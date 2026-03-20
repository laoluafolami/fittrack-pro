const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/database');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const pool = getPool();
    const result = await pool.request()
      .input('FirstName',    sql.NVarChar, firstName)
      .input('LastName',     sql.NVarChar, lastName)
      .input('Email',        sql.NVarChar, email)
      .input('Phone',        sql.NVarChar, phone || null)
      .input('DateOfBirth',  sql.Date,     dateOfBirth || null)
      .input('Gender',       sql.NVarChar, gender || null)
      .input('PasswordHash', sql.NVarChar, passwordHash)
      .execute('sp_RegisterMember');
    const memberID = result.recordset[0].NewMemberID;
    const token = jwt.sign(
      { id: memberID, email, role: 'member' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(201).json({ success: true, token, memberID, message: 'Registration successful!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = getPool();
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .query('SELECT * FROM Members WHERE Email = @Email AND IsActive = 1');
    const member = result.recordset[0];
    if (!member) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, member.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: member.MemberID, email: member.Email, role: member.Role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      success: true,
      token,
      user: {
        id: member.MemberID,
        name: `${member.FirstName} ${member.LastName}`,
        email: member.Email,
        role: member.Role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login };