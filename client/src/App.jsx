import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { fetchUsers, fetchTeams, fetchTasks } from './api/api';

export default function App() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser && users.length > 0) {
    setCurrentUser(users[0]); 
  }

  useEffect(() => {
    fetchUsers().then(setUsers);
    fetchTeams().then(setTeams);
    fetchTasks().then(setTasks);
  }, []);

  return (
    <>
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        users={users}
      />

      <main className="p-6">
        <Home
          activeView={activeView}
          users={users}
          teams={teams}
          tasks={tasks}
          setUsers={setUsers}
          setTeams={setTeams}
          setTasks={setTasks}
        />
      </main>
    </>
  );
}
