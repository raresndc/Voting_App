import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setup2FA, confirm2FA } from '../api/auth';
import QRCode from 'react-qr-code';
import { Button } from '../components/ui/button';
import { useUser } from '../context/UserContext';

export default function TwoFASetup() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [secret, setSecret] = useState('');
  const [uri, setUri] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.username) {
      navigate('/login');
      return;
    }
    setup2FA({ username: user.username })
      .then(res => {
        console.log('🎉 setup2FA response:', res.data);
        setSecret(res.data.secret);
        // response returns qrCodeUrl, not uri
        setUri(res.data.qrCodeUrl);
      })
      .catch(err => {
        console.error('❌ setup2FA error:', err);
        setError('Failed to generate 2FA setup.');
      });
  }, [user]);

  const handleConfirm = async () => {
    try {
      // Call confirm2FA endpoint which returns updated user and sets cookie
      const res = await confirm2FA({ username: user.username, code });
      // Update context with new user info (2FA enabled)
      setUser(res.data);
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.error || 'Invalid code');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication Setup</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {uri ? (
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <QRCode value={uri} />
          </div>
          <p className="mb-2 text-gray-700">Scan the QR code with your authenticator app.</p>
          <p className="mb-4 text-sm text-gray-500">Or enter this secret manually: <span className="font-mono bg-gray-100 p-1 rounded">{secret}</span></p>
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      ) : (
        <p>Generating setup details...</p>
      )}
    </div>
  );
}