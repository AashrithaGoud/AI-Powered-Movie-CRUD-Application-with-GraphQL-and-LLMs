Setup Instructions

1. Please install the latest version of Node.js from https://nodejs.org

2. Open the assignment folder in the terminal.

3. Professor, I have used the Gemma LLM from Ollama.
   Please run the following command to start the model:
   
   ollama run gemma

4. Navigate to the Flask backend:
   
   cd .\llm-backend

5. Install required Python packages:
   
   pip install flask flask_cors langchain langchain_community

6. Start the Flask LLM backend:
   
   python app.py

   → This runs the Python Flask app at: http://localhost:5000

7. Open a new terminal window.

8. Navigate to the Node.js backend:

   cd .\node-backend

9. Install dependencies:

   npm i

10. Start the Node.js Apollo server:

    npm start

    → This runs the backend at: http://localhost:4000

11. Open another new terminal window.

12. Navigate to the React UI app:

    cd .\llm-ui

13. Install dependencies:

    npm i

14. Start the React UI:

    npm start

    → This runs the UI at: http://localhost:3000
