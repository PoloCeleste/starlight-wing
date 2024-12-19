interface User {
  id: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
}

interface DiaryEntry {
  id: number;
  selectedDate: string;
  createdAt: string;
  content: string;
}

interface DiaryModalProps {
  date: Date;
  existingEntries?: DiaryEntry[];
  onClose: () => void;
  onSave: (content: string) => void;
  onUpdate: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}
