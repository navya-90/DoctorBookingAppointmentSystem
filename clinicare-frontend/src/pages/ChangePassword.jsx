import { useState } from 'react';
import { changePasswordApi } from '../api/auth';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const res = await changePasswordApi({ email, oldPassword, newPassword });
    if (res.success) {
      setMessage('Password changed successfully!');
    } else {
      setMessage(res.error || 'Error changing password.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Old Password" className="w-full p-2 border" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        <input type="password" placeholder="New Password" className="w-full p-2 border" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Update Password</button>
      </form>
      {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
    </div>
  );
};

export default ChangePassword;
