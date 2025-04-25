
export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const triviaQuestions: TriviaQuestion[] = [
  // Geography Questions
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
    question: "Which country is home to the Great Barrier Reef?",
    options: ["Brazil", "Indonesia", "Australia", "Thailand"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "medium"
  },
  {
    id: 3,
    question: "Which is the largest desert in the world?",
    options: ["Gobi", "Sahara", "Antarctic", "Arabian"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "medium"
  },
  {
    id: 4,
    question: "Which mountain is the tallest in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Which river is the longest in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "medium"
  },
  {
    id: 6,
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "easy"
  },
  {
    id: 7,
    question: "Which ocean is the largest?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3,
    category: "Geography",
    difficulty: "easy"
  },
  {
    id: 8,
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "medium"
  },
  {
    id: 9,
    question: "Which European country is known as 'The Land of Fire and Ice'?",
    options: ["Norway", "Finland", "Iceland", "Sweden"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "medium"
  },
  {
    id: 10,
    question: "Which African country was formerly known as Abyssinia?",
    options: ["Ethiopia", "Somalia", "Sudan", "Kenya"],
    correctAnswer: 0,
    category: "Geography",
    difficulty: "hard"
  },

  // Science Questions
  {
    id: 11,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy"
  },
  {
    id: 12,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy"
  },
  {
    id: 13,
    question: "What is the main component of the Sun?",
    options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium"
  },
  {
    id: 14,
    question: "Which famous scientist developed the theory of general relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "medium"
  },
  {
    id: 15,
    question: "What is the hardest natural substance on Earth?",
    options: ["Platinum", "Diamond", "Titanium", "Quartz"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy"
  },
  {
    id: 16,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "easy"
  },
  {
    id: 17,
    question: "Which part of the human body contains the most bones?",
    options: ["Hands", "Feet", "Spine", "Skull"],
    correctAnswer: 0,
    category: "Science",
    difficulty: "medium"
  },
  {
    id: 18,
    question: "What is the closest star to Earth?",
    options: ["Proxima Centauri", "Alpha Centauri", "The Sun", "Sirius"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "easy"
  },
  {
    id: 19,
    question: "Which scientist discovered penicillin?",
    options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Robert Koch"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "medium"
  },
  {
    id: 20,
    question: "What is the speed of light?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "200,000 km/s"],
    correctAnswer: 0,
    category: "Science",
    difficulty: "medium"
  },

  // History Questions
  {
    id: 21,
    question: "In which year did World War II end?",
    options: ["1943", "1945", "1947", "1950"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium"
  },
  {
    id: 22,
    question: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
    correctAnswer: 2,
    category: "History",
    difficulty: "easy"
  },
  {
    id: 23,
    question: "The ancient city of Rome was built on how many hills?",
    options: ["Five", "Six", "Seven", "Eight"],
    correctAnswer: 2,
    category: "History",
    difficulty: "hard"
  },
  {
    id: 24,
    question: "Who was the first woman to win a Nobel Prize?",
    options: ["Marie Curie", "Rosalind Franklin", "Dorothy Crowfoot Hodgkin", "Irène Joliot-Curie"],
    correctAnswer: 0,
    category: "History",
    difficulty: "medium"
  },
  {
    id: 25,
    question: "In what year did the Berlin Wall fall?",
    options: ["1987", "1989", "1991", "1993"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium"
  },
  {
    id: 26,
    question: "Which pharaoh ruled Egypt for the longest period?",
    options: ["Tutankhamun", "Cleopatra", "Ramesses II", "Akhenaten"],
    correctAnswer: 2,
    category: "History",
    difficulty: "hard"
  },
  {
    id: 27,
    question: "Who painted the ceiling of the Sistine Chapel?",
    options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
    correctAnswer: 2,
    category: "History",
    difficulty: "medium"
  },
  {
    id: 28,
    question: "What year did the Titanic sink?",
    options: ["1910", "1912", "1915", "1918"],
    correctAnswer: 1,
    category: "History",
    difficulty: "easy"
  },
  {
    id: 29,
    question: "Who wrote 'The Art of War'?",
    options: ["Confucius", "Sun Tzu", "Laozi", "Mencius"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium"
  },
  {
    id: 30,
    question: "Which empire was ruled by Genghis Khan?",
    options: ["Ottoman Empire", "Byzantine Empire", "Mongol Empire", "Persian Empire"],
    correctAnswer: 2,
    category: "History",
    difficulty: "medium"
  },

  // Art Questions
  {
    id: 31,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "easy"
  },
  {
    id: 32,
    question: "Which artist cut off part of his own ear?",
    options: ["Claude Monet", "Vincent van Gogh", "Salvador Dalí", "Pablo Picasso"],
    correctAnswer: 1,
    category: "Art",
    difficulty: "easy"
  },
  {
    id: 33,
    question: "Which art movement is Salvador Dalí associated with?",
    options: ["Cubism", "Impressionism", "Surrealism", "Pop Art"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "medium"
  },
  {
    id: 34,
    question: "Who painted 'The Starry Night'?",
    options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Edvard Munch"],
    correctAnswer: 1,
    category: "Art",
    difficulty: "easy"
  },
  {
    id: 35,
    question: "What nationality was Pablo Picasso?",
    options: ["French", "Italian", "Spanish", "Portuguese"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "easy"
  },
  {
    id: 36,
    question: "Which of these is NOT one of the Teenage Mutant Ninja Turtles?",
    options: ["Leonardo", "Donatello", "Michelangelo", "Raphael"],
    correctAnswer: 3,
    category: "Art",
    difficulty: "medium"
  },
  {
    id: 37,
    question: "Who sculpted 'David'?",
    options: ["Donatello", "Leonardo da Vinci", "Michelangelo", "Raphael"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "medium"
  },
  {
    id: 38,
    question: "What art movement was characterized by its emphasis on light and color?",
    options: ["Impressionism", "Cubism", "Surrealism", "Baroque"],
    correctAnswer: 0,
    category: "Art",
    difficulty: "medium"
  },
  {
    id: 39,
    question: "Who painted 'The Persistence of Memory' with the famous melting clocks?",
    options: ["René Magritte", "Salvador Dalí", "Pablo Picasso", "Andy Warhol"],
    correctAnswer: 1,
    category: "Art",
    difficulty: "medium"
  },
  {
    id: 40,
    question: "Which painter is known for cutting off his ear?",
    options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Edvard Munch"],
    correctAnswer: 1,
    category: "Art",
    difficulty: "easy"
  },

  // Animals Questions
  {
    id: 41,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
    category: "Animals",
    difficulty: "easy"
  },
  {
    id: 42,
    question: "Which bird is known for its ability to mimic human speech?",
    options: ["Eagle", "Parrot", "Penguin", "Ostrich"],
    correctAnswer: 1,
    category: "Animals",
    difficulty: "easy"
  },
  {
    id: 43,
    question: "What is a group of lions called?",
    options: ["Herd", "Pack", "Pride", "Flock"],
    correctAnswer: 2,
    category: "Animals",
    difficulty: "easy"
  },
  {
    id: 44,
    question: "Which animal is the tallest in the world?",
    options: ["Elephant", "Giraffe", "Whale", "Gorilla"],
    correctAnswer: 1,
    category: "Animals",
    difficulty: "easy"
  },
  {
    id: 45,
    question: "How many legs does a spider have?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    category: "Animals",
    difficulty: "easy"
  },
  {
    id: 46,
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Leopard", "Jaguar"],
    correctAnswer: 1,
    category: "Animals",
    difficulty: "easy"
  },
  {
    id: 47,
    question: "What is the only mammal that can fly?",
    options: ["Flying Squirrel", "Sugar Glider", "Bat", "Hummingbird"],
    correctAnswer: 2,
    category: "Animals",
    difficulty: "medium"
  },
  {
    id: 48,
    question: "Which animal has the longest lifespan?",
    options: ["Elephant", "Giant Tortoise", "Bowhead Whale", "Greenland Shark"],
    correctAnswer: 3,
    category: "Animals",
    difficulty: "hard"
  },
  {
    id: 49,
    question: "What is the fastest land animal?",
    options: ["Cheetah", "Lion", "Gazelle", "Pronghorn Antelope"],
    correctAnswer: 0,
    category: "Animals",
    difficulty: "easy"
  },
  {
    id: 50,
    question: "Which of these animals does NOT hibernate?",
    options: ["Bears", "Squirrels", "Elephants", "Bats"],
    correctAnswer: 2,
    category: "Animals",
    difficulty: "medium"
  },

  // Literature Questions
  {
    id: 51,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "easy"
  },
  {
    id: 52,
    question: "Which famous novel begins with the line 'It was the best of times, it was the worst of times'?",
    options: ["Great Expectations", "A Tale of Two Cities", "Oliver Twist", "Pride and Prejudice"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "medium"
  },
  {
    id: 53,
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "F. Scott Fitzgerald"],
    correctAnswer: 0,
    category: "Literature",
    difficulty: "medium"
  },
  {
    id: 54,
    question: "Which of these characters was created by J.K. Rowling?",
    options: ["Gandalf", "Hermione Granger", "Katniss Everdeen", "Bilbo Baggins"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "easy"
  },
  {
    id: 55,
    question: "Who is the author of 'The Great Gatsby'?",
    options: ["Ernest Hemingway", "F. Scott Fitzgerald", "William Faulkner", "John Steinbeck"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "medium"
  },
  {
    id: 56,
    question: "In which city is the novel '1984' by George Orwell set?",
    options: ["Paris", "New York", "London", "Moscow"],
    correctAnswer: 2,
    category: "Literature",
    difficulty: "medium"
  },
  {
    id: 57,
    question: "Who wrote 'Moby-Dick'?",
    options: ["Herman Melville", "Mark Twain", "Charles Dickens", "Nathaniel Hawthorne"],
    correctAnswer: 0,
    category: "Literature",
    difficulty: "medium"
  },
  {
    id: 58,
    question: "Which play by Shakespeare features the character Macbeth?",
    options: ["Othello", "Hamlet", "King Lear", "Macbeth"],
    correctAnswer: 3,
    category: "Literature",
    difficulty: "easy"
  },
  {
    id: 59,
    question: "Who wrote 'Pride and Prejudice'?",
    options: ["Emily Brontë", "Charlotte Brontë", "Jane Austen", "Virginia Woolf"],
    correctAnswer: 2,
    category: "Literature",
    difficulty: "easy"
  },
  {
    id: 60,
    question: "What's the name of the wizard school in the Harry Potter series?",
    options: ["Durmstrang", "Beauxbatons", "Ilvermorny", "Hogwarts"],
    correctAnswer: 3,
    category: "Literature",
    difficulty: "easy"
  }
];

export function getRandomQuestions(count: number, categories: string[] = []): TriviaQuestion[] {
  let filteredQuestions = triviaQuestions;
  
  // Filter by selected categories if any are specified
  if (categories.length > 0) {
    filteredQuestions = triviaQuestions.filter(q => 
      categories.includes(q.category.toLowerCase())
    );
  }
  
  // Shuffle algorithm (Fisher-Yates)
  const shuffled = [...filteredQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' questions or all if there are fewer than requested
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
