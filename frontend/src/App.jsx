import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Directory from './pages/Directory';
import Profile from './pages/Profile';
import Explorer from './pages/Explorer';
import History from './pages/History';
import CommitteeBoard from './pages/CommitteeBoard';
import EminentFigures from './pages/EminentFigures';
import EventsAndNotices from './pages/EventsAndNotices';
import Help from './pages/Help';
import Admin from './pages/Admin';
import FindRelation from './pages/FindRelation';
import RecycleBin from './pages/RecycleBin';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer/*" element={<Explorer />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/member/:id" element={<Profile />} />
          <Route path="/board" element={<EventsAndNotices />} />
          <Route path="/help" element={<Help />} />
          <Route path="/history" element={<History />} />
          <Route path="/committee" element={<CommitteeBoard />} />
          <Route path="/eminent" element={<EminentFigures />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/relation" element={<FindRelation />} />
          <Route path="/recycle-bin" element={<RecycleBin />} />
          <Route path="/login" element={<div className="text-center py-20 text-xl text-stone-500">Login / Registration Coming Soon...</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
