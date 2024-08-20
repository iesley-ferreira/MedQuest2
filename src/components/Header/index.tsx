import { KeyboardReturn } from '@mui/icons-material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilteredQuestions } from '../../features/questions/questionSlice';
import { resetScore, setSubject } from '../../features/user/userSlice';
import { AppDispatch, RootState } from '../../store/store';

const Header: React.FC<{
  currentQuestionIndex: number;
  totalQuestions: number;
}> = ({ currentQuestionIndex, totalQuestions }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleClickHome = () => {
    dispatch(setSubject(''));
    dispatch(resetScore());
    dispatch(setFilteredQuestions([]));
    navigate('/');
  };
  return (
    <header className="header">
      <h3 data-testid="header-player-name" className="header-name">
        {user.name}
      </h3>
      <div className="question-progress">
        <span>
          Questão {currentQuestionIndex + 1} / {totalQuestions}
        </span>
      </div>
      <button
        onClick={handleClickHome}
        type="button"
        className="material-symbols-outlined"
      >
        <KeyboardReturn />
      </button>
    </header>
  );
};

export default Header;
