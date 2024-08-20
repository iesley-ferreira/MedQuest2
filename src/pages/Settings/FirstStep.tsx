import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../../features/questions/questionSlice';
import { setName, setSubject } from '../../features/user/userSlice';
import { AppDispatch, RootState } from '../../store/store';

const FirstStep: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const [username, setUsername] = React.useState('');

  useEffect(() => {
    if (user.name) {
      setUsername(user.name);
    }
  }, [user.name]);

  const handleSubjectClick = (selectedSubject: string) => {
    dispatch(setName(username));
    dispatch(setSubject(selectedSubject));
    dispatch(fetchQuestions(selectedSubject));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <form className="login-form" onSubmit={handleFormSubmit}>
        <input
          className="login-input"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          placeholder="Nome"
          data-testid="input-player-name"
          autoComplete="nome"
        />
      </form>
      <button
        className="button play-button"
        onClick={() => handleSubjectClick('POLÍTICAS PÚBLICAS DE SAÚDE')}
      >
        POLÍTICAS PÚBLICAS DE SAÚDE
      </button>
      <button
        className="button play-button"
        onClick={() => handleSubjectClick('CONHECIMENTOS ESPECÍFICOS')}
      >
        CONHECIMENTOS ESPECÍFICOS
      </button>
    </>
  );
};

export default FirstStep;
