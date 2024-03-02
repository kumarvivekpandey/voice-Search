import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts",
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleVoiceSearch();
  }, [transcript]);

  const handleSearch = (term) => {
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(term.toLowerCase()),
    );
    setSearchResults(filteredPosts);
  };

  const handleVoiceSearch = () => {
    const term = transcript.toLowerCase();
    handleSearch(term);
    resetTranscript();
  };

  const startVoiceRecognition = () => {
    resetTranscript();
    SpeechRecognition.startListening();
  };

  const stopVoiceRecognition = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <button onClick={startVoiceRecognition}>Start Voice Search</button>
      <button onClick={stopVoiceRecognition}>Stop Voice Search</button>
      <ul>
        {searchResults.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
