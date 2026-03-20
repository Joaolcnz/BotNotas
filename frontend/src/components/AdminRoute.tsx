import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import apiClient from '@/api/apiClient';

export function AdminRoute() {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = sessionStorage.getItem('admin_token');
      if (!token) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      try {
        await apiClient.post('/admin/validate-token', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(true);
      } catch (error) {
        sessionStorage.removeItem('admin_token');
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin-auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
