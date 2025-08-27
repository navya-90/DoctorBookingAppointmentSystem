import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await loginUser({ email, password });
    localStorage.setItem("token", res.token);
    localStorage.setItem("clinicare_user", JSON.stringify(res));

    if (res.role === 'ADMIN') navigate('/admin-dashboard');
    else if (res.role === 'DOCTOR') navigate('/doctor-dashboard');
    else navigate('/patient-dashboard');
  } catch (err) {
    alert("Invalid credentials or server error");
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="w-full border p-2 mb-4" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="w-full border p-2 mb-4" 
        />
        {/* <select value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2 mb-4">
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select> */}
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        <div className="text-sm text-center mt-4">
            <a href="/change-password" className="text-blue-600 hover:underline">
              Change Password?
            </a>
          </div>
      </div>
    </div>
  );
}

export default LoginPage;
