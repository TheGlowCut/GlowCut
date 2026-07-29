import apiClient from './apiClient';

// NOTE: The provided backend does not expose any /rewards endpoints yet
// (no rewards routes/controllers/models exist in the Qitmeer backend).
// This service stays mocked until that API is built; everything else in
// the app (auth, salons, bookings) is wired to the live backend.
const MOCK_MODE = true;
const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_REWARDS = [
  { id: 'rwd-1', title: 'Free Beard Trim', pointsCost: 500, icon: 'content_cut' },
  { id: 'rwd-2', title: '20% Off Hair Color', pointsCost: 800, icon: 'palette' },
  { id: 'rwd-3', title: 'Free Scalp Treatment', pointsCost: 1200, icon: 'spa' },
  { id: 'rwd-4', title: 'GlowCut Gold (1 Month)', pointsCost: 2000, icon: 'workspace_premium' },
];

const MOCK_REWARD_HISTORY = [
  { id: 'hist-1', label: 'Haircut at Modern Cuts PECHS', points: 150, date: '2024-10-12', type: 'earned' },
  { id: 'hist-2', label: 'Redeemed: Free Beard Trim', points: -500, date: '2024-10-05', type: 'redeemed' },
  { id: 'hist-3', label: 'Referral Bonus: Friend Joined', points: 300, date: '2024-09-28', type: 'earned' },
];

export async function getAvailableRewards() {
  if (MOCK_MODE) {
    await simulateDelay(500);
    return MOCK_REWARDS;
  }
  const { data } = await apiClient.get('/rewards');
  return data;
}

export async function getRewardHistory(userId) {
  if (MOCK_MODE) {
    await simulateDelay(500);
    return MOCK_REWARD_HISTORY;
  }
  const { data } = await apiClient.get(`/users/${userId}/reward-history`);
  return data;
}

export async function redeemReward(rewardId) {
  if (MOCK_MODE) {
    await simulateDelay(900);
    return { success: true, rewardId };
  }
  const { data } = await apiClient.post(`/rewards/${rewardId}/redeem`);
  return data;
}

export async function getReferralStats(userId) {
  if (MOCK_MODE) {
    await simulateDelay(500);
    return { invitesSent: 8, invitesJoined: 3, pointsEarned: 900, referralCode: 'AYESHA300' };
  }
  const { data } = await apiClient.get(`/users/${userId}/referrals`);
  return data;
}
