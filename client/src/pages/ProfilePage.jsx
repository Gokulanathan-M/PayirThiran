import { motion } from 'framer-motion';
import ProfileCard from '../components/profile/ProfileCard';
import LandList from '../components/profile/LandList';
import HistoryList from '../components/profile/HistoryList';

export default function ProfilePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <ProfileCard />
        <LandList />
      </div>
      <HistoryList />
    </motion.div>
  );
}
