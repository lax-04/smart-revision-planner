'use client';
import { useState } from 'react';

export default function Home() {
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [plan, setPlan] = useState<string[]>([]);

  const generatePlan = () => {
    if (!examDate || !syllabus || !startTime || !endTime) {
      alert('Please fill in all fields including time range');
      return;
    }

    const today = new Date();
    const targetDate = new Date(examDate);
    const daysRemaining = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysRemaining <= 0) {
      setPlan(['❌ The exam date must be in the future.']);
      return;
    }

    // Parse syllabus
    const topics = syllabus
      .split(/\r?\n|,/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const totalMinutes =
      timeToMinutes(endTime) - timeToMinutes(startTime);

    if (totalMinutes <= 0) {
      alert('End time must be after start time');
      return;
    }

    const dailyPlans: string[] = [];
    let topicIndex = 0;

    for (let i = 0; i < daysRemaining && topicIndex < topics.length; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // How many topics per day?
      const remainingTopics = topics.length - topicIndex;
      const idealTopicsPerDay = Math.ceil(remainingTopics / (daysRemaining - i));
      const minutesPerTopic = Math.floor(totalMinutes / idealTopicsPerDay);

      let currentMinutes = timeToMinutes(startTime);
      const dayPlan: string[] = [];

      for (let j = 0; j < idealTopicsPerDay && topicIndex < topics.length; j++) {
        const start = minutesToTime(currentMinutes);
        const end = minutesToTime(currentMinutes + minutesPerTopic);
        dayPlan.push(`🕒 ${start} - ${end}: ${topics[topicIndex++]}`);
        currentMinutes += minutesPerTopic;
      }

      dailyPlans.push(`📅 ${date.toDateString()}:\n${dayPlan.join('\n')}`);
    }

    if (topicIndex < topics.length) {
      dailyPlans.push(`⚠️ Not enough days to cover all topics. ${topics.length - topicIndex} topics left.`);
    }

    setPlan(dailyPlans);
  };

  const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number): string => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <main style={{ padding: 20, color: 'white' }}>
      <h1>📚 Smart Revision Planner</h1>

      <input
        type="text"
        placeholder="Enter subject (optional)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <br /><br />

      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
      />
      <br /><br />

      <textarea
        rows={6}
        cols={50}
        placeholder="Enter syllabus topics (comma-separated or one per line)"
        value={syllabus}
        onChange={(e) => setSyllabus(e.target.value)}
      />
      <br /><br />

      <label>Preferred Start Time: </label>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <br /><br />

      <label>Preferred End Time: </label>
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <br /><br />

      <button onClick={generatePlan}>Generate Plan</button>

      <h2>📝 Your Study Plan</h2>
      <ul>
        {plan.map((entry, index) => (
          <li key={index} style={{ whiteSpace: 'pre-line', marginBottom: 10 }}>
            {entry}
          </li>
        ))}
      </ul>
    </main>
  );
}
