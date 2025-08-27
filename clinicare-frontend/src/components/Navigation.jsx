import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, LogOut, User } from "lucide-react";

const Navigation = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("clinicare_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("clinicare_user");
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between">
      <div onClick={() => navigate('/')} className="flex items-center space-x-2 cursor-pointer">
        <Heart className="text-blue-600" />
        <span className="text-lg font-bold text-blue-600">ClinicCare</span>
      </div>
      {user ? (
        <div className="flex items-center space-x-3">
          <User className="text-gray-700" />
          <span>{user.name}</span>
          <button onClick={handleLogout}>
            <LogOut className="text-red-500" />
          </button>
        </div>
      ) : (
        <div className="space-x-3">
          <button onClick={() => navigate('/login')} className="text-blue-600">Login</button>
          <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-3 py-1 rounded">Register</button>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
