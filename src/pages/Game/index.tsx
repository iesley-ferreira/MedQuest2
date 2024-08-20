import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import {
  Alternative,
  disableAlternatives,
  enableAlternatives,
  Question,
} from '../../features/questions/questionSlice';
import { incrementScore } from '../../features/user/userSlice';
import { shuffleArray } from '../../services/shuffleArray';
import { RootState } from '../../store/store';

const Game: React.FC = () => {
  const questions = useSelector(
    (state: RootState) => state.questions.filteredQuestions
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 300 segundos = 5 minutos
  const [shuffledAnswers, setShuffledAnswers] = useState<Alternative[]>([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex] as Question;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setSelectedAnswer(null);
      setButtonClicked(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (currentQuestion) {
      updateShuffledAnswers();
    }
  }, [currentQuestion]);

  const updateShuffledAnswers = () => {
    setShuffledAnswers(shuffleArray(currentQuestion.alternatives));
    setButtonClicked(false);
  };

  const handleClick = (answerId: number) => {
    setSelectedAnswer(answerId);
    if (answerId === currentQuestion.rightAlternativeId) {
      dispatch(incrementScore(1));
    }

    setButtonClicked(true);
    dispatch(disableAlternatives());
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      dispatch(enableAlternatives());
      setTimeLeft(300);
    } else {
      navigate('/results');
    }
  };

  return (
    <>
      <Header
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />
      <section className="question-container">
        <div className="content-question">
          <h2 className="question-year">
            Q{currentQuestion.questionId} / {currentQuestion.questionYear}
          </h2>
          <p>{currentQuestion.question}</p>
          {currentQuestion.image && (
            <img
              src={currentQuestion.image}
              data-testid="question-image"
              alt={`Imagem da questão ${currentQuestion.questionId}`}
              className="question-image"
            />
          )}
        </div>
        <div className="answers-container" data-testid="answer-options">
          {shuffledAnswers.map((alternative) => (
            <button
              key={alternative.id}
              type="button"
              data-testid={
                alternative.id === currentQuestion.rightAlternativeId
                  ? 'correct-answer'
                  : 'wrong-answer'
              }
              onClick={() => handleClick(alternative.id)}
              disabled={buttonClicked || timeLeft === 0}
              className={
                buttonClicked || timeLeft === 0
                  ? alternative.id === currentQuestion.rightAlternativeId
                    ? 'green button'
                    : 'red button'
                  : 'button'
              }
            >
              {alternative.description}
            </button>
          ))}
        </div>
        <button
          className="button next-button"
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null && timeLeft > 0}
        >
          {buttonClicked ? (
            <span className="btn-next-span">Next</span>
          ) : (
            <span className="btn-next-span">{timeLeft} segundos</span>
          )}
        </button>
      </section>
    </>
  );
};

export default Game;
