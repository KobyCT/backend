const jwt=require('jsonwebtoken');
const User=require('../models/user');
const Blacklist=require('../models/blacklist');

//Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token || token === 'null') {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user is banned
        const isBanned = await new Promise((resolve, reject) => {
            Blacklist.areBanned(decoded.uid, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        if (isBanned) {
            return res.status(403).json({ success: false, message: 'This user is banned!' });
        }

        // Find user by ID
        const user = await new Promise((resolve, reject) => {
            User.findById(decoded.uid, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
        
    } catch (err) {
        console.error(err.stack);
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};


//Grant access to specific roles
exports.authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:false,
                message:`User role ${req.user.role} is not authorized to access this route`});        
        }
        next();
    };
};
