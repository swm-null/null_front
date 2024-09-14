import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage, SignUpPage, Home } from 'pages';
import 'i18n';
import './index.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
