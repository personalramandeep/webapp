import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANDING_URL = process.env.REACT_APP_LANDING_URL || 'https://kreeda.tech';
const CARD_SIZE = 600;

function drawOverallCard(ctx, { score, grade, playerName, videoTitle }) {
  const w = CARD_SIZE, h = CARD_SIZE;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#1B3B36');
  grad.addColorStop(1, '#0F2926');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#F45831';
  ctx.font = 'bold 32px -apple-system, "Segoe UI", system-ui, sans-serif';
  ctx.fillText('kreeda', 40, 60);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '16px -apple-system, "Segoe UI", sans-serif';
  ctx.fillText('AI BADMINTON COACH', 40, 82);

  // Big score ring
  const cx = w / 2, cy = h / 2 + 20, r = 130;
  ctx.lineWidth = 18;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#F45831';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * score) / 100);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = 'bold 96px -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(score, cx, cy + 20);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '20px -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(`Grade: ${grade}`, cx, cy + 60);

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 22px -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(playerName, 40, h - 80);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(videoTitle || 'Singles Match', 40, h - 58);

  ctx.fillStyle = '#F45831';
  ctx.font = 'bold 14px -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('kreeda.tech', w - 40, h - 58);
  ctx.textAlign = 'left';
}

const PLATFORMS = [
  {
    name: 'WhatsApp',
    color: '#25D366',
    icon: 'W',
    getUrl: (text, url) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    name: 'Facebook',
    color: '#1877F2',
    icon: 'f',
    getUrl: (_text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Reddit',
    color: '#FF4500',
    icon: 'R',
    getUrl: (text, url) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
  {
    name: 'Instagram',
    color: '#E4405F',
    icon: '◉',
    getUrl: null,
  },
];

const ShareAnalyticsModal = ({ isOpen, onClose, analysis }) => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState('');

  const score = analysis?.score ?? 72;
  const grade = analysis?.grade ?? 'B';
  const playerName = analysis?.playerName ?? 'Ramandeep Singh';
  const videoTitle = analysis?.videoTitle ?? 'Singles Match';
  const shareText = `Check out my badminton AI score: ${score}/100 🏸 Tracked with @KreedaTech`;
  const shareUrl = `${LANDING_URL}?ref=${encodeURIComponent(playerName)}`;

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    drawOverallCard(ctx, { score, grade, playerName, videoTitle });
  }, [isOpen, score, grade, playerName, videoTitle]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const saveImage = () => {
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `kreeda-analysis-${score}.png`;
    a.click();
    setSaved(true);
    showToast('Image saved');
    setTimeout(() => setSaved(false), 2000);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      showToast('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed');
    }
  };

  const shareTo = async (platform) => {
    if (platform.name === 'Instagram') {
      // Instagram has no web share; copy image to clipboard
      try {
        const blob = await new Promise((r) => canvasRef.current.toBlob(r, 'image/png'));
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('Image copied — paste in Instagram');
      } catch {
        showToast('Copy failed; use Save Image instead');
      }
      return;
    }
    window.open(platform.getUrl(shareText, shareUrl), '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl w-full max-w-md p-6 pointer-events-auto relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Share Analysis</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  data-testid="share-modal-close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-4">{shareText}</p>

              <div className="bg-black/30 rounded-xl p-3 mb-4 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={CARD_SIZE}
                  height={CARD_SIZE}
                  className="w-full max-w-[280px] rounded-lg"
                  data-testid="share-card-canvas"
                />
              </div>

              <p className="text-gray-500 text-xs mb-2">Share to</p>
              <div className="flex gap-3 mb-4 justify-center">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => shareTo(p)}
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: p.color }}
                    title={p.name}
                    data-testid={`share-${p.name.toLowerCase()}`}
                  >
                    {p.icon}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#333] border border-white/5 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  data-testid="copy-link-button"
                >
                  {copied ? '✓ Copied' : '🔗 Copy Link'}
                </button>
                <button
                  onClick={saveImage}
                  className="flex-1 bg-kreeda-orange hover:bg-opacity-90 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  data-testid="save-image-button"
                >
                  {saved ? '✓ Saved' : '⬇ Save Image'}
                </button>
              </div>

              {toast && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-medium px-3 py-1.5 rounded-full">
                  {toast}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareAnalyticsModal;
