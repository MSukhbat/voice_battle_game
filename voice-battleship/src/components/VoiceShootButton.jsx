import { useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const numberWords = {
  нэг: 1,
  нэгд: 1,
  хоёр: 2,
  гурван: 3,
  гурав: 3,
  дөрөв: 4,
  дөрвөн: 4,
  тав: 5,
  таван: 5,
  зургаа: 6,
  зургаан: 6,
  долоо: 7,
  долоон: 7,
  найм: 8,
  найман: 8,
  ес: 9,
  есөн: 9,
  арав: 10,
};

const letterWords = {
  аа: "A",
  эй: "A",
  б: "B",
  би: "B",
  си: "C",
  с: "C",
  ди: "D",
  дэ: "D",
  и: "E",
  ий: "E",
  эф: "F",
  жи: "G",
  ж: "G",
  эйч: "H",
  аш: "H",
  ай: "I",
  жэй: "J",
};

function parseCoordinate(transcript) {
  const text = transcript
    .toLowerCase()
    .replace(/[.,!?-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = text.split(" ");

  // A5, a 5, A-5 зэрэг
  const joined = text.replace(/\s/g, "").toUpperCase();
  const directMatch = joined.match(/([A-J])(10|[1-9])/);

  if (directMatch) {
    return directMatch[0];
  }

  // "а тав", "эй тав", "а таван" зэрэг
  for (let i = 0; i < words.length; i++) {
    let letter = letterWords[words[i]];
    let number = numberWords[words[i + 1]];

    if (!letter && /^[a-j]$/i.test(words[i])) {
      letter = words[i].toUpperCase();
    }

    if (!number && /^\d{1,2}$/.test(words[i + 1] || "")) {
      number = Number(words[i + 1]);
    }

    if (letter && number >= 1 && number <= 10) {
      return `${letter}${number}`;
    }
  }

  return null;
}

export default function VoiceShootButton({ onShoot, disabled = false }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const [coordinate, setCoordinate] = useState("");

  function startListening() {
    if (!SpeechRecognition) {
      setMessage("Энэ browser voice recognition дэмжихгүй байна.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Монгол хэлний танилтыг туршина.
    recognition.lang = "mn-MN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    recognition.onstart = () => {
      setListening(true);
      setMessage("Координатаа хэлээрэй. Жишээ: А тав");
      setCoordinate("");
    };

    recognition.onresult = (event) => {
      const alternatives = Array.from(event.results[0]);
      let result = null;

      for (const alternative of alternatives) {
        result = parseCoordinate(alternative.transcript);
        if (result) break;
      }

      if (!result) {
        setMessage(
          `Координат танигдсангүй: "${event.results[0][0].transcript}". Дахин оролдоорой.`,
        );
        return;
      }

      const col = result.charCodeAt(0) - 65;
      const row = Number(result.slice(1)) - 1;

      setCoordinate(result);
      setMessage(`${result} руу буудаж байна...`);

      // Existing game shooting handler-ийг ашиглана.
      onShoot(row, col, result);
      setMessage(`${result} координатыг илгээлээ.`);
    };

    recognition.onerror = (event) => {
      setMessage(
        event.error === "not-allowed"
          ? "Микрофоны зөвшөөрөл өгнө үү."
          : "Дуу танихад алдаа гарлаа. Дахин оролдоорой.",
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setMessage("Дахин оролдохын өмнө түр хүлээнэ үү.");
    }
  }

  return (
    <div className="voice-controls">
      <button
        type="button"
        className={`voice-button ${listening ? "is-listening" : ""}`}
        onClick={startListening}
        disabled={disabled || listening}
      >
        {listening ? "🎙️ Сонсож байна..." : "🎙️ SPEECH"}
      </button>

      {message && (
        <p className="voice-message" aria-live="polite">
          {message}
        </p>
      )}

      {coordinate && (
        <p className="voice-coordinate">
          Сүүлд таньсан: <strong>{coordinate}</strong>
        </p>
      )}
    </div>
  );
}
