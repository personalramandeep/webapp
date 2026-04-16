import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAR_PATH = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.286 3.957c.3.922-.755 1.688-1.54 1.118l-3.366-2.447a1 1 0 00-1.176 0l-3.366 2.447c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.287-3.957z';

const AVATAR_GRADIENTS = [
  'from-blue-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-emerald-500 to-teal-500',
  'from-violet-500 to-purple-500',
  'from-orange-500 to-amber-500',
  'from-cyan-500 to-blue-500',
  'from-fuchsia-500 to-pink-500',
  'from-green-500 to-emerald-600',
];

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const getGradient = (name) => {
  if (!name) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`;
};

const StarRow = ({ rating, size = 'sm' }) => {
  const cls = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${cls} ${i < rating ? 'text-yellow-400' : 'text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
};

const TagPills = ({ tags }) => {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 bg-kreeda-orange/10 border border-kreeda-orange/20 rounded-full text-kreeda-orange text-[10px] font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const ReviewerAvatar = ({ name, src, size = 'sm' }) => {
  const cls = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Player'}
        className={`${cls} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${cls} rounded-full bg-gradient-to-br ${getGradient(name)} flex items-center justify-center flex-shrink-0 text-white font-bold`}
    >
      {getInitials(name)}
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <div className="bg-white/5 rounded-2xl p-3 border border-white/10 hover:border-white/20 transition-colors">
    <div className="flex items-start gap-2.5">
      <ReviewerAvatar name={review.reviewerName} src={review.reviewerPicture} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-white text-xs font-semibold truncate">{review.reviewerName || 'Anonymous'}</span>
            {review.reviewerHandle && (
              <span className="text-white/30 text-[11px] truncate hidden sm:inline">@{review.reviewerHandle}</span>
            )}
          </div>
          <span className="text-white/30 text-[11px] flex-shrink-0">{timeAgo(review.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <StarRow rating={review.rating} />
          <TagPills tags={review.tags} />
        </div>
        {review.body && <p className="text-white/60 text-xs leading-relaxed">{review.body}</p>}
      </div>
    </div>
  </div>
);

const FeaturedReview = ({ review }) => (
  <div className="bg-white/10 rounded-2xl p-4 border border-kreeda-orange/30">
    <div className="flex items-start gap-3">
      <ReviewerAvatar name={review.reviewerName} src={review.reviewerPicture} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-sm font-semibold">{review.reviewerName || 'Anonymous'}</span>
          {review.reviewerHandle && (
            <span className="text-white/40 text-xs">@{review.reviewerHandle}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <StarRow rating={review.rating} size="md" />
          <TagPills tags={review.tags} />
        </div>
        {review.body && <p className="text-white/75 text-sm leading-relaxed">{review.body}</p>}
      </div>
    </div>
  </div>
);

const TABS = [
  { key: 'recent', label: 'Most Recent' },
  { key: 'top', label: 'Top Rated' },
];

const CoachingReviewsCard = ({ reviews = [] }) => {
  const [sort, setSort] = useState('recent');
  const totalCount = reviews.length;

  const avgRating = totalCount > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalCount
    : 0;

  const sortedReviews = sort === 'top'
    ? [...reviews].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const featured = sort === 'recent' && sortedReviews.length > 0 ? sortedReviews[0] : null;
  const listReviews = featured ? sortedReviews.slice(1) : sortedReviews;

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-4 md:p-6 hover:border-kreeda-orange/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d={STAR_PATH} />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Coaching Reviews</h3>
            <p className="text-white/40 text-xs mt-0.5">
              {totalCount} total review{totalCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5 flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d={STAR_PATH} />
            </svg>
            <span className="text-yellow-300 font-bold text-sm">{avgRating.toFixed(1)}</span>
            <span className="text-white/40 text-xs">/ 5</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="text-center py-8">
          <svg className="w-10 h-10 text-white/20 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path d={STAR_PATH} />
          </svg>
          <p className="text-white/40 text-sm">No reviews yet.</p>
        </div>
      )}

      {/* Content */}
      {totalCount > 0 && (
        <>
          {featured && (
            <div className="mb-4 mt-3">
              <p className="text-white/45 text-[11px] font-medium uppercase tracking-wide mb-2">
                What players say
              </p>
              <FeaturedReview review={featured} />
            </div>
          )}

          <div className="flex gap-2 mb-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSort(tab.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  sort === tab.key
                    ? 'bg-kreeda-orange text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={sort}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              {listReviews.length === 0 ? (
                <p className="text-white/30 text-xs text-center py-4">No more reviews</p>
              ) : (
                listReviews.map((r) => <ReviewCard key={r.id} review={r} />)
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default CoachingReviewsCard;
