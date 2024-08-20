import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionViewer.css';

interface Question {
  questionId: number;
  question: string;
  image?: string;
  alternatives: {
    id: number;
    description: string;
  }[];
  rightAlternativeId: number;
  questionYear: string; // Adicionado para capturar o ano da questão
}

interface ExamData {
  examId: number;
  nome: string;
  ano: string;
  edital: string;
  descrição: string;
  processoSeletivo: number;
  questions: Question[];
}

const QuestionViewer: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const years = ['2014', '2018', '2020', '2021', '2022', '2023']; // Anos disponíveis
        let allQuestions: Question[] = [];

        for (const year of years) {
          const response = await fetch(`public/Exams/GHC/${year}.json`);
          if (!response.ok) {
            throw new Error(`Failed to load ${year} exam data`);
          }
          const examData: ExamData[] = await response.json();
          examData.forEach((exam) => {
            // Adiciona o ano da questão ao objeto da questão
            const questionsWithYear = exam.questions.map((q) => ({
              ...q,
              questionYear: year,
            }));
            allQuestions = allQuestions.concat(questionsWithYear);
          });
        }

        setQuestions(allQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert('You have reached the end of the questions.');
    }
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentIndex];

  const qindex: { [key: number]: string } = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
  };

  return (
    <div className="question-viewer">
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
        {currentQuestion.alternatives.map((alternative, index) => (
          <div
            key={alternative.id}
            style={{
              color:
                alternative.id === currentQuestion.rightAlternativeId
                  ? 'green'
                  : 'black',
            }}
          >
            {qindex[index + 1]}.{alternative.description}
          </div>
        ))}
      </div>
      <button className="button next-button" onClick={handleNext}>
        Next
      </button>
      <button
        className="button back-button"
        onClick={() => navigate('/settings')}
      >
        Back to Settings
      </button>
    </div>
  );
};

export default QuestionViewer;
