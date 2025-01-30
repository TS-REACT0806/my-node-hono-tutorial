import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Ollama } from "ollama";
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";

const app = new Hono();

app.onError(errorHandlerMiddleware);

/* Routes */
// routes.forEach((route) => {
//   app.route("/", route);
// });

/* Chat Interface */
app.get("/chat/view", (c) => {
  return c.html(
    `<html>
      <head>
        <title>Chat with AI</title>
        <style>
          .chat-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
          }
          .messages {
            border: 1px solid #ccc;
            height: 400px;
            overflow-y: auto;
            margin-bottom: 20px;
            padding: 10px;
          }
          .input-form {
            display: flex;
            gap: 10px;
          }
          .input-form input {
            flex: 1;
            padding: 8px;
          }
          .input-form button {
            padding: 8px 16px;
          }
        </style>
      </head>
      <body>
        <div class="chat-container">
          <div id="messages" class="messages"></div>
          <form id="chatForm" class="input-form">
            <input type="text" id="prompt" placeholder="Type your message..." />
            <button type="submit">Send</button>
          </form>
        </div>

        <script>
          const form = document.getElementById('chatForm');
          const messagesDiv = document.getElementById('messages');
          const promptInput = document.getElementById('prompt');

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const prompt = promptInput.value.trim();
            if (!prompt) return;

            // Add user message
            messagesDiv.innerHTML += '<p><strong>You:</strong> ' + prompt + '</p>';
            promptInput.value = '';
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // Add AI message container
            const aiMessageId = 'ai-' + Date.now();
            messagesDiv.innerHTML += '<p><strong>AI:</strong> <span id="' + aiMessageId + '"></span></p>';
            
            try {
              const response = await fetch('/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
              });

              const reader = response.body.getReader();
              const decoder = new TextDecoder();
              const aiMessage = document.getElementById(aiMessageId);

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\\n');
                
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const content = JSON.parse(line.slice(6));
                    aiMessage.textContent += content;
                  }
                }
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
              }
            } catch (error) {
              console.error('Error:', error);
            }
          });
        </script>
      </body>
    </html>
  `
  );
});

const ollama = new Ollama({ host: "localhost:11434" });

app.post("/chat/message", async (c) => {
  c.res.headers.set("Content-Type", "text/event-stream");
  c.res.headers.set("Cache-Control", "no-cache");
  c.res.headers.set("Connection", "keep-alive");

  const { prompt } = await c.req.json();

  if (!prompt) {
    return c.json({ error: "Body parameter 'prompt' is required" }, 400);
  }

  const message = { role: "user", content: prompt };

  try {
    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      messages: [message],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const part of response) {
          const data = `data: ${JSON.stringify(part.message.content)}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error) {
    return c.json({ error: JSON.stringify(error) }, 500);
  }
});

/* Server */
serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log("Listening on port", info.port);
});
