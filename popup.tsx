import { useState, useEffect } from "react";
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from(Array(a.length + 1), () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1],
          matrix[i][j - 1],
          matrix[i - 1][j]
        ) + 1;
      }
    }
  }

  return matrix[a.length][b.length];
}

function trimAndNormalizeURL(url) {
  try {
    // Create a new URL object to perform normalization
    const normalizedURL = new URL(url);

    // Return the normalized URL's href after trimming whitespace
    return normalizedURL.href.trim();
  } catch (error) {
    // If there's an error while creating the URL object (invalid URL), return the original URL after trimming whitespace
    return url.trim();
  }
}



const allowed_urls = ["https://example.com", "https://test.com", "https://sample.com"];

function isUrlAllowed(url) {
  let lowestDistance = Number.MAX_VALUE;
  let lowestElement = "";

  for (let element of allowed_urls) {
    const distance = levenshteinDistance(url, element);
    if (distance < lowestDistance) {
      lowestDistance = distance;
      lowestElement = element;
    }
  }

  if (lowestDistance === 0) {
    return "ALLOWED";
  } else {
    const link = `${lowestElement}`;
    return `NOT ALLOWED, you are probably looking for ${link}`;
  }
}

function string_len(str) {
  return str.length;
}

function string_difference(str1, str2) {
  let missingString = '';

  // Find characters present in str1 but not in str2
  for (let i = 0; i < str1.length; i++) {
    if (str2.indexOf(str1[i]) === -1) {
      missingString += str1[i];
    }
  }

  // Find characters present in str2 but not in str1
  for (let i = 0; i < str2.length; i++) {
    if (str1.indexOf(str2[i]) === -1) {
      missingString += str2[i];
    }
  }

  return missingString;
}


function IndexPopup() {
  const [data, setData] = useState("");
  const [isURLAvailable, setIsURLAvailable] = useState(false);
  const [currentURL, setCurrentURL] = useState("");

  // Replace this array with the URLs you want to check against
  const allowedURLs = [
    "https://www.plasmo.com",
    "https://example.com",
    "https://www.google.com",
  ];

  useEffect(() => {
    // Function to get the current tab's URL using the Chrome extension API
    const getCurrentTabURL = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          const currentURL = tabs[0].url;
          setCurrentURL(currentURL);
          // Check if the current URL is present in the allowedURLs array
          const isURLValid = allowedURLs.includes(currentURL);
          setIsURLAvailable(isURLValid);
        }
      });
    };

    // Call the function to get the current tab's URL
    getCurrentTabURL();
  }, []);

  console.log(currentURL)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}    >

      <p>{isUrlAllowed(currentURL)}</p>
      <p>{currentURL}</p>
      <p>{levenshteinDistance("https://www.example.com", currentURL)}</p>
      <p>{string_len(trimAndNormalizeURL(currentURL))}</p>
      <p>{string_len("https://example.com")}</p>
      <p>{string_difference("https://example.com", currentURL)}</p>
      <p>Is current URl == example.com? {trimAndNormalizeURL(currentURL) === "https://example.com" ? "YES" : "NO"}</p>
    </div>
  );
}

export default IndexPopup;
