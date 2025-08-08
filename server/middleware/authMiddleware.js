const jwt = require('jsonwebtoken');
const User = require('../databases/User');
const JWT_SECRET = process.env.JWT_SECRET || 'buzNsUTtJVvLviJHQ/KGAsK1zdwk4U61bS0oWOvbfB4=';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
           
            token = req.headers.authorization.split(' ')[1];

            
            const decoded = jwt.verify(token, JWT_SECRET);

            
            req.user = await User.findById(decoded.user.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); 
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };