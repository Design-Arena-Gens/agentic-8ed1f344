'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = async (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult);
          setIsListening(false);
          setIsProcessing(true);

          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: speechResult }),
            });

            const data = await res.json();
            setResponse(data.response);
            speak(data.response);
          } catch (error) {
            console.error('Error:', error);
            setResponse('Sorry, I encountered an error. Please try again.');
          } finally {
            setIsProcessing(false);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setIsProcessing(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setResponse('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-sajed-gold mb-4">SAJED</h1>
          <p className="text-2xl text-gray-300 mb-2">Fine Dining Experience</p>
          <p className="text-lg text-gray-400">New York City</p>
        </div>

        <div className="bg-sajed-dark/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-sajed-gold/20">
          <h2 className="text-3xl font-semibold text-center mb-8 text-sajed-gold">
            AI Voice Assistant
          </h2>

          <div className="flex flex-col items-center gap-8">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing || isSpeaking}
              className={`relative w-32 h-32 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : isProcessing || isSpeaking
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-sajed-gold hover:bg-yellow-500 hover:scale-110'
              } shadow-lg`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {isListening ? (
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : isProcessing ? (
                  <svg className="w-16 h-16 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>

            <p className="text-center text-gray-300 text-lg">
              {isListening
                ? 'Listening... Speak now'
                : isProcessing
                ? 'Processing your request...'
                : isSpeaking
                ? 'Speaking...'
                : 'Click the microphone to start'}
            </p>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              >
                Stop Speaking
              </button>
            )}

            {transcript && (
              <div className="w-full mt-6 p-6 bg-black/30 rounded-2xl border border-sajed-gold/30">
                <p className="text-sm text-sajed-gold mb-2 font-semibold">You said:</p>
                <p className="text-white text-lg">{transcript}</p>
              </div>
            )}

            {response && (
              <div className="w-full p-6 bg-black/30 rounded-2xl border border-sajed-gold/30">
                <p className="text-sm text-sajed-gold mb-2 font-semibold">Assistant:</p>
                <p className="text-white text-lg">{response}</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm">
              Try asking about: Reservations • Menu • Hours • Specials • Location
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 Sajed Restaurant. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
