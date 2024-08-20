import { CalendarMonth, Timelapse } from '@mui/icons-material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilteredQuestions } from '../../features/questions/questionSlice';
import { resetScore, setSubject } from '../../features/user/userSlice';

export type Player = {
  score: number;
  quantity: number;
  percentage: number;
  userName: string;
  date: string;
  time: string;
};

const Ranking: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Obtém o ranking dos jogadores armazenados no localStorage
  const playersRanked: Player[] = JSON.parse(
    localStorage.getItem('players Ranking') || '[]'
  );

  // Ordenar por porcentagem de acertos em ordem decrescente
  playersRanked.sort((a, b) => b.percentage - a.percentage);

  return (
    <section className="ranking-container">
      <div className="ranking-card">
        <img
          src="/assets/images/ranking-image.png"
          alt="Ranking"
          className="ranking-image"
        />
        <h2 data-testid="ranking-title" className="ranking-title">
          Ranking
        </h2>
        <div className="ranking-peoples">
          {playersRanked.map((player: Player, index: number) => (
            <div className="player-info-container" key={index}>
              <img
                alt="Player Avatar"
                src="/assets/images/medic-icon-ranking.png"
                className="ranking-avatar"
              />
              <div>
                <div className="player-info-stats">
                  <h4 data-testid={`player-name-${index}`}>
                    {player.userName}
                  </h4>{' '}
                  -
                  <h4>
                    <span data-testid={`player-score-${index}`}>
                      {player.score}/{player.quantity} ({player.percentage}%)
                    </span>
                  </h4>
                </div>
                <div className="player-info-date-time-container">
                  <span className="player-info-date-time">
                    {' '}
                    <CalendarMonth /> {player.date}
                  </span>
                  <span className="player-info-date-time">
                    {' '}
                    <Timelapse /> {player.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="buttons-container">
          <button
            className="button play-button"
            data-testid="btn-go-home"
            onClick={() => {
              dispatch(resetScore());
              dispatch(setFilteredQuestions([]));
              dispatch(setSubject(''));
              navigate('/');
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </section>
  );
};

export default Ranking;
