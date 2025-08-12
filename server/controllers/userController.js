const User = require('../databases/User');
const Experience = require('../databases/experienceModel');

/**
 * @desc    Get user profile data
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    try {
        const user = req.user; 
        
        if (user) {
            
            const experiencesShared = await Experience.countDocuments({ username: user.username });
                 res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio, 
                goals: user.goals, 
                experiencesShared: experiencesShared,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const oldUsername = user.username;
            const newUsername = req.body.username || oldUsername;
            const didUsernameChange = oldUsername !== newUsername;

            console.log(`Updating profile for ${oldUsername}. New username will be ${newUsername}.`);
            
            user.username = newUsername;
            user.bio = req.body.bio || user.bio;
            user.goals = req.body.goals || user.goals;
            
            const updatedUser = await user.save();
            console.log('User document saved successfully.');

            if (didUsernameChange) {
                console.log(`Username changed! Updating experiences from ${oldUsername} to ${newUsername}...`);
                
                await Experience.updateMany(
                    { username: oldUsername }, 
                    { $set: { username: newUsername } } 
                );

                console.log('Finished updating associated experiences.');
            }

            const experiencesShared = await Experience.countDocuments({ username: updatedUser.username });
            console.log(`Final experience count for ${updatedUser.username} is ${experiencesShared}.`);

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                goals: updatedUser.goals,
                experiencesShared: experiencesShared,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('!!! ERROR updating user profile:', error);
        
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'That username is already taken.' });
        }

        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};


/**
 * @desc   
 * @route   
 * @access 
 */
const checkUsernameAvailability = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (user) {
          
            res.json({ isAvailable: false });
        } else {
           
            res.json({ isAvailable: true });
        }
    } catch (error) {
        console.error('Error in checkUsernameAvailability:', error);
        res.status(500).json({ message: 'Server error while checking username' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    checkUsernameAvailability, 
};