import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import './settings.css';

const Settings: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <section className="login-container">
      <div className="logo">
        <img src="/public/images/logo1.png" alt="logo" />
      </div>
      <div className="title">
        Med
        <span>Quest</span>
      </div>
      <div className="settings-container">
        {!user.subject ? <FirstStep /> : <SecondStep />}
      </div>
    </section>
  );
};

export default Settings;
