"use client";

// Simple test to verify the API endpoint
export default function APITest() {
  const testAPI = async () => {
    try {
      // First test GET
      console.log("Testing GET /api/stories/generate...");
      const getResponse = await fetch("/api/stories/generate");
      const getData = await getResponse.json();
      console.log("GET response:", getData);

      // Then test POST with minimal data
      console.log("Testing POST /api/stories/generate...");
      const testStory = {
        title: "Test Story",
        description: "A simple test story",
        plot: "This is a test plot",
        type: "text",
        categories: ["test"],
        characters: [],
      };

      const postResponse = await fetch("/api/stories/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testStory),
      });

      console.log("POST response status:", postResponse.status);
      console.log("POST response ok:", postResponse.ok);

      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log("POST response data:", postData);
      } else {
        const errorData = await postResponse.text();
        console.log("POST error response:", errorData);
      }
    } catch (error) {
      console.error("API test error:", error);
    }
  };

  return (
    <div className="p-4">
      <h1>API Test</h1>
      <button
        onClick={testAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test API
      </button>
      <p>Check browser console for results</p>
    </div>
  );
}
