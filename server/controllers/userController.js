// const User = require('../databases/User');
// const Experience = require('../databases/experienceModel');

// // --- FIX #1: Correctly send the user's actual data from the database ---
// const getUserProfile = async (req, res) => {
//     try {
//         const user = req.user; 
        
//         if (user) {
//             const experiencesShared = await Experience.countDocuments({ username: user.username });

//             res.json({
//                 _id: user._id,
//                 username: user.username,
//                 email: user.email,
                
//                 // CHANGE: Use the bio from the user object in the database, NOT a hardcoded string.
//                 bio: user.bio, 
//                 // CHANGE: Use the goals from the user object in the database, NOT a hardcoded string.
//                 goals: user.goals, 
//                 experiencesShared: experiencesShared,
//             });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         console.error('Error in getUserProfile:', error);
//         res.status(500).json({ message: 'Server error while fetching profile' });
//     }
// };


// // --- FIX #2: Add robust error handling and logging to the update function ---
// const updateUserProfile = async (req, res) => {
//     // ADD: A try...catch block to handle any errors during the process.
//     try {
//         const user = await User.findById(req.user._id);

//         if (user) {
//             // ADD: A log to see what data is arriving from the frontend.
//             console.log('Received data to update:', req.body);
//             const oldUsername = user.username;
//             const newUsername = req.body.username || oldUsername;
//             const didUsernameChange = oldUsername !== newUsername;

//             user.username = req.body.username || user.username;
//             user.bio = req.body.bio || user.bio;
//             user.goals = req.body.goals || user.goals;
            
//             // This call can fail if validation fails (e.g., username not unique).
//             const updatedUser = await user.save(); 

//             // ADD: A log to confirm the user was saved.
//             console.log('User profile saved successfully for:', updatedUser.username);

//             // Respond with the final, saved data, including the updated experience count.
//             const experiencesShared = await Experience.countDocuments({ username: updatedUser.username });

//             res.json({
//                 _id: updatedUser._id,
//                 username: updatedUser.username,
//                 email: updatedUser.email,
//                 bio: updatedUser.bio,
//                 goals: updatedUser.goals,
//                 experiencesShared: experiencesShared, // Also send back the latest count
//             });
//         } else {
//             res.status(44).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         // ADD: This will catch any error from user.save() and send a meaningful response.
//         console.error('!!! ERROR updating user profile:', error);
//         res.status(500).json({ message: 'Error updating profile', error: error.message });
//     }
// };


// module.exports = {
//     getUserProfile,
//     updateUserProfile, 
// };
const User = require('../databases/User');
const Experience = require('../databases/experienceModel');

/**
 * @desc    Get user profile data
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    try {
        // req.user is attached by the 'protect' middleware
        const user = req.user; 
        
        if (user) {
            // Get the count of experiences for this user
            const experiencesShared = await Experience.countDocuments({ username: user.username });

            // Send back the user's data from the database
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
            
            // Update the user's details on the user object
            user.username = newUsername;
            user.bio = req.body.bio || user.bio;
            user.goals = req.body.goals || user.goals;
            
            // Save the updated user document
            const updatedUser = await user.save();
            console.log('User document saved successfully.');

            // If the username changed, we must also update all their associated experiences
            if (didUsernameChange) {
                console.log(`Username changed! Updating experiences from ${oldUsername} to ${newUsername}...`);
                
                // This command finds all experiences with the old username and sets them to the new one.
                await Experience.updateMany(
                    { username: oldUsername }, 
                    { $set: { username: newUsername } } 
                );

                console.log('Finished updating associated experiences.');
            }

            // Recalculate the count after potential changes
            const experiencesShared = await Experience.countDocuments({ username: updatedUser.username });
            console.log(`Final experience count for ${updatedUser.username} is ${experiencesShared}.`);

            // Respond with the final, fully updated user data
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
        
        // Handle specific error for duplicate username
        if (error.code === 11000) {
            return res.status(400).json({ message: 'That username is already taken.' });
        }

        // Handle all other errors
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};


module.exports = {
    getUserProfile,
    updateUserProfile, 
};