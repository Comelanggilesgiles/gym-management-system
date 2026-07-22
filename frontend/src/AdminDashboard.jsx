import React, { useEffect, useState } from 'react';

const API_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : 'http://localhost:5000';

export default function AdminDashboard({ auth, onLogout }) {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [error, setError] = useState('');
  const [userError, setUserError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'users' | 'registrations'
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const result = await response.json();
        if (!response.ok) {
          setError(result.message || 'Unable to load dashboard.');
          return;
        }
        setData(result);
      } catch (err) {
        setError('Unable to connect to backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [auth.token]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!data) return;
      setLoadingUsers(true);
      setUserError('');
      try {
        const response = await fetch(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const result = await response.json();
        if (!response.ok) {
          setUserError(result.message || 'Unable to load users.');
          return;
        }
        setUsers(result.users || []);
      } catch (err) {
        setUserError('Unable to connect to backend.');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [auth.token, data]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!data) return;
      setLoadingRegistrations(true);
      setRegistrationError('');
      try {
        const response = await fetch(`${API_URL}/api/member-registrations`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const result = await response.json();
        if (!response.ok) {
          setRegistrationError(result.message || 'Unable to load registrations.');
          return;
        }
        setRegistrations(result.registrations || []);
      } catch (err) {
        setRegistrationError('Unable to connect to backend.');
      } finally {
        setLoadingRegistrations(false);
      }
    };

    fetchRegistrations();
  }, [auth.token, data]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(true);
    setUserError('');
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await response.json();
      if (!response.ok) {
        setUserError(result.message || 'Unable to update user.');
        return;
      }
      setUsers((prev) => prev.map((user) => (user._id === userId ? result.user : user)));
    } catch (err) {
      setUserError('Unable to update user.');
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name || '', email: user.email, role: user.role });
  };

  const handleSaveEdit = async () => {
    setUpdating(true);
    setUserError('');
    try {
      const response = await fetch(`${API_URL}/api/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(editForm),
      });
      const result = await response.json();
      if (!response.ok) {
        setUserError(result.message || 'Unable to update user.');
        return;
      }
      setUsers((prev) => prev.map((user) => (user._id === editingUserId ? result.user : user)));
      setEditingUserId(null);
    } catch (err) {
      setUserError('Unable to update user.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setUpdating(true);
    setUserError('');
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const result = await response.json();
      if (!response.ok) {
        setUserError(result.message || 'Unable to delete user.');
        return;
      }
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      setUserError('Unable to delete user.');
    } finally {
      setUpdating(false);
    }
  };


  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <header className='flex flex-col gap-4 border-b border-slate-800 bg-[#091F5B]/95 px-6 py-5 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-slate-300'>Olympic Fitness Gym</p>
          <h1 className='mt-2 text-3xl font-semibold'>Welcome, {auth.name || auth.email}</h1>
          <p className='mt-1 text-sm text-slate-300'>You are signed in as Admin.</p>
        </div>
        <button
          type='button'
          onClick={onLogout}
          className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20'
        >
          Logout
        </button>
      </header>

      <main className='mx-auto max-w-7xl space-y-6 px-6 py-8'>
        {loading ? (
          <div className='rounded-3xl bg-slate-900/80 p-8 text-center text-xl text-slate-200'>Loading dashboard...</div>
        ) : error ? (
          <div className='rounded-3xl bg-rose-900/80 p-8 text-center text-xl text-rose-200'>{error}</div>
        ) : (
          <div className='space-y-6'>
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
              {Object.entries(data.stats).map(([label, value]) => (
                <div key={label} className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
                  <p className='text-sm uppercase tracking-[0.28em] text-slate-400'>{label.replace(/([A-Z])/g, ' $1')}</p>
                  <p className='mt-4 text-3xl font-semibold text-white'>{value}</p>
                </div>
              ))}
            </div>

            <section className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
              <h2 className='text-2xl font-semibold text-white'>Admin Actions</h2>
              <div className='mt-4 space-y-3'>
                {data.actions.map((item) => (
                  <div key={item} className='rounded-3xl bg-slate-950/80 px-5 py-4 text-slate-200'>{item}</div>
                ))}
              </div>
            </section>

            {/* Tabs */}
            <div className='flex gap-2 border-b border-slate-800'>
              <button
                onClick={() => setActiveTab('registrations')}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
                  activeTab === 'registrations'
                    ? 'border-[#091F5B] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Member Registrations ({registrations.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
                  activeTab === 'users'
                    ? 'border-[#091F5B] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Users ({users.length})
              </button>
            </div>

            {/* Member Registrations Tab */}
            {activeTab === 'registrations' && (
              <section className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6'>
                  <div>
                    <h2 className='text-2xl font-semibold text-white'>Member Registrations</h2>
                    <p className='mt-2 text-sm text-slate-400'>View all member registration details.</p>
                  </div>
                </div>

                {loadingRegistrations ? (
                  <div className='rounded-3xl bg-slate-950/80 p-6 text-center text-slate-300'>Loading registrations...</div>
                ) : registrationError ? (
                  <div className='rounded-3xl bg-rose-900/80 p-6 text-center text-rose-200'>{registrationError}</div>
                ) : registrations.length === 0 ? (
                  <div className='rounded-3xl bg-slate-950/80 p-6 text-center text-slate-300'>No member registrations yet.</div>
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='w-full border-separate border-spacing-y-3 text-left text-sm'>
                      <thead>
                        <tr className='text-xs uppercase tracking-[0.3em] text-slate-400'>
                          <th className='px-4 py-3'>Name</th>
                          <th className='px-4 py-3'>Age</th>
                          <th className='px-4 py-3'>Phone</th>
                          <th className='px-4 py-3'>Civil Status</th>
                          <th className='px-4 py-3'>Emergency Contact</th>
                          <th className='px-4 py-3'>Address</th>
                          <th className='px-4 py-3'>Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg._id} className='border border-slate-800 bg-slate-950/90'>
                            <td className='px-4 py-4 text-slate-100 font-medium'>
                              {reg.firstName} {reg.lastName} {reg.middleInitial && `${reg.middleInitial}.`}
                            </td>
                            <td className='px-4 py-4 text-slate-300'>{reg.age}</td>
                            <td className='px-4 py-4 text-slate-300'>{reg.cellPhone}</td>
                            <td className='px-4 py-4 text-slate-300'>{reg.civilStatus}</td>
                            <td className='px-4 py-4 text-slate-300'>
                              <div className='text-xs'>
                                <p className='font-medium'>{reg.emergencyContactName}</p>
                                <p className='text-slate-400'>{reg.emergencyContactPhone}</p>
                              </div>
                            </td>
                            <td className='px-4 py-4 text-slate-300 text-xs'>{reg.address}</td>
                            <td className='px-4 py-4 text-slate-300 text-xs'>
                              {new Date(reg.acceptedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <section className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6'>
                  <div>
                    <h2 className='text-2xl font-semibold text-white'>Users</h2>
                    <p className='mt-2 text-sm text-slate-400'>View and adjust registered users.</p>
                  </div>
                  {updating && <p className='text-sm text-emerald-300'>Updating user role...</p>}
                </div>

                {loadingUsers ? (
                  <div className='rounded-3xl bg-slate-950/80 p-6 text-center text-slate-300'>Loading users...</div>
                ) : userError ? (
                  <div className='rounded-3xl bg-rose-900/80 p-6 text-center text-rose-200'>{userError}</div>
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='w-full border-separate border-spacing-y-3 text-left'>
                      <thead>
                        <tr className='text-sm uppercase tracking-[0.3em] text-slate-400'>
                          <th className='px-4 py-3'>Name</th>
                          <th className='px-4 py-3'>Email</th>
                          <th className='px-4 py-3'>Role</th>
                          <th className='px-4 py-3'>Created</th>
                          <th className='px-4 py-3'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id} className='border border-slate-800 bg-slate-950/90'>
                            <td className='px-4 py-4'>
                              {editingUserId === user._id ? (
                                <input
                                  type='text'
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className='w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-white'
                                />
                              ) : (
                                <span className='text-slate-100'>{user.name || '—'}</span>
                              )}
                            </td>
                            <td className='px-4 py-4'>
                              {editingUserId === user._id ? (
                                <input
                                  type='email'
                                  value={editForm.email}
                                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                  className='w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-white'
                                />
                              ) : (
                                <span className='text-slate-300'>{user.email}</span>
                              )}
                            </td>
                            <td className='px-4 py-4'>
                              {editingUserId === user._id ? (
                                <select
                                  value={editForm.role}
                                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                  className='rounded border border-slate-700 bg-slate-900 px-2 py-1 text-white'
                                >
                                  <option value='client'>client</option>
                                  <option value='admin'>admin</option>
                                </select>
                              ) : (
                                <span className='text-slate-200'>{user.role}</span>
                              )}
                            </td>
                            <td className='px-4 py-4 text-slate-300'>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className='px-4 py-4'>
                              {editingUserId === user._id ? (
                                <div className='flex gap-2'>
                                  <button
                                    onClick={handleSaveEdit}
                                    className='rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700'
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingUserId(null)}
                                    className='rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700'
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className='flex gap-2'>
                                  <button
                                    onClick={() => handleEdit(user)}
                                    className='rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user._id)}
                                    className='rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700'
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
