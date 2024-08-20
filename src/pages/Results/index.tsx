import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  enableAlternatives,
  setFilteredQuestions,
} from '../../features/questions/questionSlice';
import { resetScore, setSubject } from '../../features/user/userSlice';
import { RootState } from '../../store/store';
import { Player } from '../Ranking';

const Results: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const score = useSelector((state: RootState) => state.user.score);
  const assertions = useSelector((state: RootState) => state.user.score);
  const quantity = useSelector(
    (state: RootState) => state.questions.filteredQuestions.length
  );
  const userName = useSelector((state: RootState) => state.user.name);

  useEffect(() => {
    const playersRank = JSON.parse(
      localStorage.getItem('players Ranking') || '[]'
    );
    const currentDate = new Date();
    const percentage = ((score / quantity) * 100).toFixed(2);

    const newRankEntry = {
      score,
      quantity,
      percentage: parseFloat(percentage), // Salvar a porcentagem de acertos
      userName,
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString().slice(0, 5), // Salvar apenas hora e minutos
    };

    if (
      !playersRank.some(
        (player: Player) =>
          player.score === score &&
          player.userName === userName &&
          player.date === newRankEntry.date &&
          player.time === newRankEntry.time
      )
    ) {
      const buildRank = [...playersRank, newRankEntry];
      localStorage.setItem('players Ranking', JSON.stringify(buildRank));
    }

    dispatch(enableAlternatives());
  }, [score, quantity, userName, dispatch]);

  const minimumAssertions = 3;

  return (
    <section className="feedback-card-container">
      <div className="feedback-card">
        <div className="feedback-user-info">
          <img
            data-testid="header-profile-picture"
            alt="studentsImage"
            src="/assets/images/feedback.png"
          />
          <p data-testid="header-player-name" className="score-name-text">
            {userName}
          </p>
        </div>

        <p data-testid="feedback-text" className="feedback-text">
          {assertions < minimumAssertions ? 'Could be better...' : 'Well Done!'}
        </p>

        <div className="score-text">
          Correct:
          <div className="score-text-container">
            <div
              data-testid="feedback-total-question"
              className="score-text-number"
            >
              {assertions}
            </div>
            /<div className="score-text-number-dark"> {quantity}</div>
          </div>
        </div>
        <div className="buttons-container">
          <button
            className="button play-button"
            data-testid="btn-play-again"
            onClick={() => {
              dispatch(resetScore());
              dispatch(setFilteredQuestions([]));
              dispatch(setSubject(''));
              navigate('/');
            }}
          >
            Play Again!
          </button>

          <button
            className="button settings-button"
            data-testid="btn-ranking"
            onClick={() => {
              navigate('/ranking');
            }}
          >
            Ranking
          </button>
        </div>
      </div>
    </section>
  );
};

export default Results;
