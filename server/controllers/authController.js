import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password' });
    }

    // Mock registration - no database
    const token = generateToken(Date.now().toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: Date.now().toString(),
        username: username,
      },
      message: 'Registration successful (mock - no database)',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password' });
    }

    // Mock login - no database
    const token = generateToken(Date.now().toString());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: Date.now().toString(),
        username: username,
      },
      message: 'Login successful (mock - no database)',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
