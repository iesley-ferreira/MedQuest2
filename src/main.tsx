import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './main.css';
import Game from './pages/Game';
import Ranking from './pages/Ranking';
import Results from './pages/Results';
import Settings from './pages/Settings';
import store from './store/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Settings />} />
          <Route path="/game" element={<Game />} />
          <Route path="/results" element={<Results />} />
          <Route path="/ranking" element={<Ranking />} />
          {/* <Route path="/question-viewer" element={<QuestionViewer />} /> */}
        </Routes>
      </Router>
    </Provider>
  </StrictMode>
);
