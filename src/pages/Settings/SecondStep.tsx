import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Question,
  setFilteredQuestions,
} from '../../features/questions/questionSlice';
import { shuffleArray } from '../../services/shuffleArray';
import { AppDispatch, RootState } from '../../store/store';

const SecondStep: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedQuestionCount, setSelectedQuestionCount] =
    useState<string>('');
  const [availableQuestions, setAvailableQuestions] = useState<number[]>([]);

  type Subject = 'CONHECIMENTOS_ESPECÍFICOS' | 'POLÍTICAS_PÚBLICAS_DE_SAÚDE';

  interface QuestionsData {
    [year: number]: {
      [subject in Subject]?: number;
    };
  }

  const questionsData: QuestionsData = {
    2014: { CONHECIMENTOS_ESPECÍFICOS: 10 },
    2018: { CONHECIMENTOS_ESPECÍFICOS: 15 },
    2020: { POLÍTICAS_PÚBLICAS_DE_SAÚDE: 6, CONHECIMENTOS_ESPECÍFICOS: 25 },
    2021: { POLÍTICAS_PÚBLICAS_DE_SAÚDE: 6, CONHECIMENTOS_ESPECÍFICOS: 25 },
    2022: { POLÍTICAS_PÚBLICAS_DE_SAÚDE: 5, CONHECIMENTOS_ESPECÍFICOS: 35 },
    2023: { POLÍTICAS_PÚBLICAS_DE_SAÚDE: 5, CONHECIMENTOS_ESPECÍFICOS: 35 },
  };

  useEffect(() => {
    if (selectedYear && selectedYear !== 'todos') {
      const questionsForYear = questionsData[Number(selectedYear)];
      if (questionsForYear && user.subject) {
        const subjectKey = user.subject
          .replace(/\s/g, '_')
          .toUpperCase() as Subject;
        const count = questionsForYear[subjectKey];
        if (count) {
          const questionArray = Array.from(
            { length: count },
            (_, i) => i + 1
          ).filter((num) => num % 5 === 0 || num === count);
          setAvailableQuestions(questionArray);
        } else {
          setAvailableQuestions([]);
        }
      }
    } else if (selectedYear === 'todos') {
      const subjectKey = user.subject
        ?.replace(/\s/g, '_')
        .toUpperCase() as Subject;
      const totalQuestions = Object.values(questionsData).reduce(
        (sum, yearData) => sum + (yearData[subjectKey] || 0),
        0
      );
      const questionArray = Array.from(
        { length: totalQuestions },
        (_, i) => i + 1
      ).filter((num) => num % 5 === 0 || num === totalQuestions);
      setAvailableQuestions(questionArray);
    } else {
      setAvailableQuestions([]);
    }
  }, [selectedYear, user.subject]);

  const handleStart = async () => {
    try {
      const selectedExams =
        selectedYear === 'todos' ? Object.keys(questionsData) : [selectedYear];
      let filteredQuestions: Question[] = [];
      for (const year of selectedExams) {
        const response = await fetch(`/src/Exams/GHC/${year}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${year} exam data`);
        }
        const exam = await response.json();

        const questions = exam[0].questions.filter(
          (q: Question) => q.scope === user.subject
        );
        filteredQuestions = filteredQuestions.concat(questions);
      }

      // Limita o número de questões ao selecionado
      filteredQuestions = shuffleArray(filteredQuestions).slice(
        0,
        Number(selectedQuestionCount)
      );

      console.log(filteredQuestions);

      dispatch(setFilteredQuestions(filteredQuestions));
      navigate('/game');
    } catch (error) {
      console.error('Failed to load questions:', error);
    }
  };

  return (
    <div className="second-step-container">
      <div className="second-step-form">
        <div className="select-container">
          <FormControl fullWidth margin="normal">
            <InputLabel id="year-select-label">Ano</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as string)}
            >
              <MenuItem value="">
                <em>Selecione o ano</em>
              </MenuItem>
              <MenuItem value="2014">2014</MenuItem>
              <MenuItem value="2018">2018</MenuItem>
              <MenuItem value="2020">2020</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="todos">Todos</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="select-container">
          <FormControl fullWidth margin="normal">
            <InputLabel id="questions-select-label">Qtd</InputLabel>
            <Select
              labelId="questions-select-label"
              id="questions-select"
              value={selectedQuestionCount}
              onChange={(e) =>
                setSelectedQuestionCount(e.target.value as string)
              }
              disabled={availableQuestions.length === 0}
            >
              <MenuItem value="">
                <em>Número de questões</em>
              </MenuItem>
              {availableQuestions.map((num: number) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <button
        className="button play-button"
        onClick={handleStart}
        disabled={!selectedYear || !selectedQuestionCount}
      >
        START
      </button>
    </div>
  );
};

export default SecondStep;
