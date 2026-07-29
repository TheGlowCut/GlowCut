import React, { useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  MdChat,
  MdPhotoCamera,
  MdSms,
  MdShare,
  MdInfo,
  MdCheckCircle,
  MdContentCopy,
} from 'react-icons/md';
import { UserContext } from '../../../context/UserContext';
import { getReferralStats } from '../../../services/rewardService';
import Loader from '../../../components/ui/Loader';

const SHARE_CHANNELS = [
  { label: 'WhatsApp', icon: MdChat },
  { label: 'Instagram', icon: MdPhotoCamera },
  { label: 'SMS', icon: MdSms },
  { label: 'More', icon: MdShare },
];

const INVITE_HISTORY = [
  {
    name: 'Alex Rivera',
    status: 'Completed Service',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6yrAMjJniSWJYsxA0Q2zuUmoW8b8V5wm7NIaue-4WlRE-IDneKkIIIYGRhd4PCadbNwhW5fZo6a1PvHNkm_fAKkcIWMctqWzX5684C-TiyBlJvwKSl7grs5IyqiY3T8Th7AvCc9gxvRTRHSNhgbJqJtDTVUCLfyTHfOxVzaxQNwVR9ec3lik3popeghlqmOk0oOlfyaRa2kfWRK517UP-pe4Md9RWjwHowjAT-tqKyigKunSRetkaE8tgIaG650GV6Rd9VaUZ_-Y',
  },
  {
    name: 'Jordan Smith',
    status: 'Joined GlowCut',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHg_4Xz8BiH-tFXYZr6Y_f-Sbx8CezbZtR-NEI1KORbw49h8qxuZl81WRs_kjnGrKuxMs5f35pUdSiMxTZgq4Tk0lXvQr8IqK2iipeYEWsi9PLbMCiFVjjHsdpfGYJzuZTClv-rb8NF3CPLrSI6Ehf2U7V-1yqi1b5vZ2t55XWCp16TtE-q_MaodfUUfUP1domNPhmeAES1v-A4py4M4HCNLIaxSCHSad4qAT7F94O5L7CWFhUIPa3GLUBe9buxdwGo9b_QmxZCEM',
  },
];

const GOAL_INVITES = 5;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function InviteAndEarn() {
  const userCtx = useContext(UserContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReferralStats(userCtx?.profile?.email || 'guest')
      .then(setStats)
      .finally(() => setLoading(false));
  }, [userCtx]);

  if (loading || !stats) {
    return <Loader variant="full" label="Loading Referral Data" />;
  }

  const progressPercent = Math.min(100, (stats.invitesJoined / GOAL_INVITES) * 100);
  const remaining = Math.max(0, GOAL_INVITES - stats.invitesJoined);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(stats.referralCode);
      toast.success('Referral code copied!');
    } catch {
      toast.error('Could not copy — copy it manually');
    }
  };

  const handleShare = (channel) => {
    toast.success(`Sharing via ${channel}...`);
  };

  return (
    <motion.main
      className="px-margin-mobile md:px-margin-desktop max-w-lg mx-auto py-xl relative"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.08 } },
      }}
    >
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] -left-1/4 w-[80%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] -right-1/4 w-[80%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div variants={fadeUp} className="flex justify-center mb-md">
        <div className="relative w-full aspect-square max-w-[240px]">
          <img
            alt="Glowing Cyberpunk Gift Box"
            className="w-full h-full object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq4A_arbBQxXgLhRYUV3hhH2EF1RHRYB1FbtKqq1nxLozMLIl_TtDSydfcepyUy_gXas4Dy8G8iGfkahaN_jC4KXoVBY8R2qyz8QjEkgOFsLtOxQEtqhm1jm5iwyPcWGdjcRrh60vOHD4smFLj0c-_1i6oJdh6NyZvjOUPyG3g6nVs69QGoBNzvqXU_YMiqRXbWpgl5caDIL_b3JwSLgmzIvsbc7Mv4AVLt-n7FPHfY0XyI4t3IqRZw4mhhQrEWh3aC-ALNpiHuuI"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="text-center mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">
          Spread the Glow,<br />
          <span className="text-primary">Get a Free Cut!</span>
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Invite your friends to the future of grooming and unlock exclusive rewards.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="glass-panel rounded-xl p-md mb-lg border border-primary/20"
      >
        <p className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-widest">
          Your Referral Code
        </p>
        <div className="flex items-center justify-between bg-surface/60 rounded-lg p-sm border border-white/5">
          <span className="font-headline-md text-headline-md text-primary tracking-wider">
            {stats.referralCode}
          </span>
          <button
            onClick={handleCopy}
            className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-lg active:scale-95 transition-transform shadow-warm-sm flex items-center gap-1"
          >
            <MdContentCopy /> Copy
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex justify-around items-center mb-xl gap-md"
      >
        {SHARE_CHANNELS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => handleShare(label)}
            className="flex flex-col items-center gap-xs"
          >
            <div className="w-14 h-14 rounded-full glass-panel flex items-center justify-center border border-white/10 hover:border-primary/50 transition-colors cursor-pointer group">
              <Icon className="text-primary text-[28px] group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
          </button>
        ))}
      </motion.div>

      <motion.section variants={fadeUp} className="mb-xl">
        <div className="flex justify-between items-end mb-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface">Referral Progress</h3>
          <span className="font-label-md text-label-md text-primary">
            {stats.invitesJoined}/{GOAL_INVITES} Friends Joined
          </span>
        </div>
        <div className="glass-panel rounded-full h-4 w-full p-[2px] mb-md overflow-hidden border border-white/5">
          <div
            className="h-full bg-primary rounded-full relative transition-all duration-700 shadow-warm-sm"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
          </div>
        </div>
        <div className="flex items-start gap-sm p-md glass-panel rounded-xl border border-primary/20">
          <MdInfo className="text-primary shrink-0 mt-0.5" />
          <p className="font-body-md text-body-md text-on-surface-variant">
            {remaining > 0 ? (
              <>
                Invite <span className="text-primary font-bold">{remaining} more friends</span>{' '}
                to unlock your 50% discount voucher!
              </>
            ) : (
              <span className="text-primary font-bold">
                You've unlocked your 50% discount voucher!
              </span>
            )}
          </p>
        </div>
      </motion.section>

      <motion.section variants={fadeUp}>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Invite History</h3>
        <div className="space-y-sm">
          {INVITE_HISTORY.map((invite) => (
            <div
              key={invite.name}
              className="flex items-center justify-between p-sm glass-panel rounded-xl border border-white/5"
            >
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 rounded-full border-2 border-primary/30 p-[2px]">
                  <img
                    className="w-full h-full rounded-full bg-surface-container object-cover"
                    alt={invite.name}
                    src={invite.image}
                  />
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">{invite.name}</p>
                  <p className="font-caption text-caption text-primary">{invite.status}</p>
                </div>
              </div>
              <MdCheckCircle className="text-primary text-xl" />
            </div>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}
