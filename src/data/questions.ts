
export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "What is the capital city of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "easy"
  },
  {
    id: 4,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
    category: "Animals",
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy"
  },
  {
    id: 6,
    question: "In which year did World War II end?",
    options: ["1943", "1945", "1947", "1950"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium"
  },
  {
    id: 7,
    question: "Which country is home to the Great Barrier Reef?",
    options: ["Brazil", "Indonesia", "Australia", "Thailand"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "medium"
  },
  {
    id: 8,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "easy"
  },
  {
    id: 9,
    question: "What is the main component of the Sun?",
    options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium"
  },
  {
    id: 10,
    question: "Which famous scientist developed the theory of general relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "medium"
  }
];

export function getRandomQuestions(count: number): TriviaQuestion[] {
  // Shuffle algorithm (Fisher-Yates)
  const shuffled = [...triviaQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' questions
  return shuffled.slice(0, count);
}
