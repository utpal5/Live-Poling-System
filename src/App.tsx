import React from 'react';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { store } from './store/store';
import { RootState } from './store/store';
import RoleSelection from './components/RoleSelection';
import StudentNameEntry from './components/StudentNameEntry';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

const AppContent: React.FC = () => {
  const { role, studentName } = useSelector((state: RootState) => state.user);

  if (!role) {
    return <RoleSelection />;
  }

  if (role === 'student' && !studentName) {
    return <StudentNameEntry />;
  }

  if (role === 'teacher') {
    return <TeacherDashboard />;
  }

  if (role === 'student') {
    return <StudentDashboard />;
  }

  return <RoleSelection />;
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;