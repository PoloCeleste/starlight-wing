interface User {
  id: string | null;
  username: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

interface UserProfile extends Pick<User, "username" | "email"> {
  joinDate: string;
  posts: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  image?: string;
  imageFile?: File;
  createdAt: string;
  updatedAt: string;
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

interface GeoLocation {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: GeoLocation | null;
  isLoading: boolean;
  error: string;
}
