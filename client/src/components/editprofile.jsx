import React,{useState} from 'react'
const EditProfileModel =({currentUser,onClose,onSave})=>{
    const [formData, setFormData] = useState({
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        goals: currentUser.goals || '',
    });

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value,
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3"></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Career Goals</label>
                            <textarea name="goals" value={formData.goals} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3"></textarea>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                        </div>
                    </div>   
                </form>
            </div>
        </div>

    )
}
export default EditProfileModel;
