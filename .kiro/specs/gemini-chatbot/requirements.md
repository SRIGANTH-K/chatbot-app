# Requirements Document

## Introduction

A beginner-friendly, minimal ChatGPT-style chatbot web application. Users interact with Google's Gemini API through a clean chat interface in the browser. The React frontend sends messages to a Node.js/Express backend, which securely communicates with the Gemini API. Conversation history is kept in memory for the current browser session only — no database, no authentication, no complex infrastructure.

## Glossary

- **Chat_Interface**: The React-based browser UI where the user types messages and reads responses.
- **Message_Input**: The text field in the Chat_Interface where the user types a new message.
- **Send_Button**: The clickable button in the Chat_Interface that submits the current message.
- **Message_List**: The scrollable area in the Chat_Interface that displays the conversation history.
- **User_Message**: A chat turn authored by the human user.
- **Bot_Message**: A chat turn authored by the Gemini API response.
- **Session_History**: The ordered list of User_Messages and Bot_Messages accumulated since the page was loaded or the last clear action.
- **Loading_Indicator**: A visual element displayed while the Backend is waiting for a Gemini API response.
- **Clear_Chat_Button**: The UI control that resets the Session_History and Message_List.
- **Backend**: The Node.js + Express server that proxies requests to the Gemini API.
- **Gemini_Client**: The module within the Backend that communicates with the Gemini API using the configured API key.
- **API_Key**: The Gemini API credential stored in a `.env` file on the Backend and never transmitted to the frontend.
- **Error_Banner**: A non-blocking message displayed in the Chat_Interface when a request fails.

---

## Requirements

### Requirement 1: Send and Receive Messages

**User Story:** As a user, I want to type a message and receive a response from Gemini, so that I can have a conversation with the AI.

#### Acceptance Criteria

1. WHEN the user submits a message via the Send_Button or the Enter key and the message contains at least one non-whitespace character and does not exceed 2000 characters, THE Chat_Interface SHALL append the User_Message to the Message_List and send the message to the Backend.
2. WHEN the Backend receives a message, THE Gemini_Client SHALL forward the message along with the most recent 50 entries of the Session_History to the Gemini API.
3. WHEN the Gemini API returns a successful response, THE Backend SHALL return the response text to the Chat_Interface.
4. WHEN the Chat_Interface receives a successful response, THE Chat_Interface SHALL append the Bot_Message to the Message_List.
5. WHILE the Backend is awaiting a Gemini API response, THE Chat_Interface SHALL display the Loading_Indicator and disable the Message_Input and Send_Button.
6. WHEN the Gemini API response is received, THE Chat_Interface SHALL hide the Loading_Indicator and re-enable the Message_Input and Send_Button.
7. IF the Backend does not receive a response from the Gemini API within 30 seconds, THEN THE Chat_Interface SHALL hide the Loading_Indicator, re-enable the Message_Input and Send_Button, and display an error message indicating the request timed out.

---

### Requirement 2: Enter-to-Send Support

**User Story:** As a user, I want to press Enter to send a message, so that I can interact without reaching for the mouse.

#### Acceptance Criteria

1. WHEN the user presses the Enter key with focus on the Message_Input and the input contains at least one non-whitespace character, THE Chat_Interface SHALL submit the message and clear the Message_Input.
2. WHEN the user presses Shift+Enter with focus on the Message_Input, THE Chat_Interface SHALL insert a newline character without submitting the message.
3. WHILE the Loading_Indicator is displayed, THE Chat_Interface SHALL ignore Enter key presses (without Shift) on the Message_Input while still allowing Shift+Enter to insert newlines.
4. WHEN the user presses the Enter key with focus on the Message_Input and the input contains only whitespace characters, THE Chat_Interface SHALL ignore the key press and not submit the message.

---

### Requirement 3: Session Conversation History

**User Story:** As a user, I want the chatbot to remember what was said earlier in the conversation, so that follow-up questions are answered in context.

#### Acceptance Criteria

1. THE Chat_Interface SHALL maintain an ordered Session_History of up to 100 message entries, where each entry records the sender role (user or model) and the message content, resetting to an empty Session_History when the page is loaded or when the user triggers a clear action.
2. WHEN the user submits a message, THE Chat_Interface SHALL include the complete Session_History array in the request payload sent to the Backend, sending an empty array if no prior messages exist in the current session.
3. WHEN the Backend receives a request, THE Backend SHALL pass the Session_History array, containing all prior message entries in chronological order, to the Gemini_Client so the Gemini API receives each prior exchange as context.
4. WHEN the page is reloaded, THE Chat_Interface SHALL initialise with an empty Session_History.
5. IF the Session_History has reached 100 entries, THEN THE Chat_Interface SHALL remove the oldest message entry before appending the new User_Message and Bot_Message pair.

---

### Requirement 4: Clear Chat

**User Story:** As a user, I want a clear-chat button to reset the conversation, so that I can start fresh without reloading the page.

#### Acceptance Criteria

1. THE Chat_Interface SHALL display a Clear_Chat_Button at all times.
2. WHEN the user activates the Clear_Chat_Button, THE Chat_Interface SHALL remove all messages from the Message_List and reset the Session_History to an empty state (zero messages and zero session history entries).
3. WHEN the user activates the Clear_Chat_Button, THE Chat_Interface SHALL return focus to the Message_Input.
4. WHILE the Loading_Indicator is displayed, THE Chat_Interface SHALL disable the Clear_Chat_Button.
5. IF the Message_List is already empty, THEN THE Chat_Interface SHALL disable the Clear_Chat_Button.

---

### Requirement 5: Error Handling

**User Story:** As a user, I want to see a clear error message when something goes wrong, so that I know the request failed and can try again.

#### Acceptance Criteria

1. IF the Gemini API returns an error response, THEN THE Backend SHALL return an HTTP error status and an error message containing the failure reason to the Chat_Interface.
2. IF the Backend is unreachable or returns an error status, THEN THE Chat_Interface SHALL display the Error_Banner with a human-readable description of the nature of the failure.
3. IF an error occurs, THEN THE Chat_Interface SHALL NOT append a Bot_Message to the Message_List.
4. WHEN the Backend returns a successful response after a prior error, THE Chat_Interface SHALL hide the Error_Banner.
5. IF the Backend encounters an unhandled exception, THEN THE Backend SHALL return an HTTP 500 status with a message indicating an internal server error without exposing exception details, and SHALL log the full error details to the server console.
6. IF an error occurs during a request, THEN THE Chat_Interface SHALL preserve the contents of the Message_Input so the user can retry without retyping their message.

---

### Requirement 6: Secure API Key Handling

**User Story:** As a developer, I want the Gemini API key stored only on the backend, so that it is never exposed to browser clients.

#### Acceptance Criteria

1. WHEN the Backend server starts, THE Backend SHALL load the API_Key from environment variables.
2. IF the API_Key environment variable is absent or empty at server startup, THEN THE Backend SHALL refuse to start.
3. IF the API_Key environment variable is absent or empty at server startup, THEN THE Backend SHALL log an error message that names the missing or empty environment variable.
4. THE Chat_Interface SHALL NOT include the API_Key in any outbound network request originating from the Chat_Interface.
5. THE Backend SHALL NOT include the API_Key in any HTTP response sent to the Chat_Interface.

---

### Requirement 7: Clean and Accessible Chat Interface

**User Story:** As a user, I want a clean, easy-to-use chat interface, so that I can focus on the conversation without distraction.

#### Acceptance Criteria

1. THE Chat_Interface SHALL display User_Messages left-aligned with a distinct background and Bot_Messages right-aligned with a different distinct background, so that the author of each turn is distinguishable without relying on color alone (e.g., via alignment or a visible sender label).
2. WHEN a new Bot_Message or User_Message is appended to the Message_List, THE Chat_Interface SHALL scroll the Message_List so that the latest message is fully visible within the viewport.
3. THE Message_Input SHALL render as a multi-line text area with an initial height sufficient to display at least 1 line of text, growing vertically with content up to a maximum of 5 visible lines, after which the text area SHALL scroll internally to show the cursor position.
4. THE Chat_Interface SHALL provide an accessible label on the Send_Button whose text or `aria-label` value describes the action (e.g., "Send message"), and an accessible label on the Clear_Chat_Button whose text or `aria-label` value describes the action (e.g., "Clear chat"), so that screen readers can identify each control.
5. WHEN the page first loads, THE Chat_Interface SHALL place keyboard focus on the Message_Input.
6. IF the Chat_Interface is awaiting a Bot_Message response, THEN THE Send_Button SHALL be disabled and THE Message_Input SHALL reject new submission attempts until the Bot_Message is received.
