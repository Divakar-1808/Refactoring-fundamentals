import Dashboard from '../components/Dashboard';
import TaskList from '../components/TaskList';
import TeamList from '../components/TeamList';
import UserList from '../components/UserList';

export default function Home(props) {
  const { activeView } = props;

  if (activeView === 'dashboard') return <Dashboard {...props} />;
  if (activeView === 'tasks') return <TaskList {...props} />;
  if (activeView === 'teams') return <TeamList {...props} />;
  if (activeView === 'users') return <UserList {...props} />;

  return null;
}
