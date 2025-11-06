import React, { useEffect, useState } from "react";

function FetchExample() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch data using Fetch API
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Fetch API Example</h2>
      <ul style={{ listStyle: "none" }}>
        {posts.slice(0, 5).map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FetchExample;
