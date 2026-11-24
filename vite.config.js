import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function apiRepliesPlugin() {
  const dataDir = path.resolve(__dirname, 'data');
  const filePath = path.resolve(dataDir, 'replies.json');

  const getReplies = () => {
    try {
      if (!fs.existsSync(filePath)) return [];
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (e) {
      return [];
    }
  };

  const saveReplies = (replies) => {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(replies, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving replies to file:', e);
    }
  };

  return {
    name: 'api-replies-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // GET /api/replies
        if (req.url === '/api/replies' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify(getReplies()));
          return;
        }

        // POST /api/replies
        if (req.url === '/api/replies' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const newReply = JSON.parse(body);
              const replies = getReplies();
              const entry = {
                id: newReply.id || `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                mood: newReply.mood || '💖',
                message: (newReply.message || '').trim(),
                timestamp: newReply.timestamp || new Date().toISOString(),
              };
              replies.unshift(entry);
              saveReplies(replies);
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: true, reply: entry }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // DELETE /api/replies/:id
        if (req.url && req.url.startsWith('/api/replies/') && req.method === 'DELETE') {
          const id = req.url.split('/api/replies/')[1];
          let replies = getReplies();
          replies = replies.filter(r => r.id !== id);
          saveReplies(replies);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // DELETE /api/replies (clear all)
        if (req.url === '/api/replies' && req.method === 'DELETE') {
          saveReplies([]);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ success: true }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiRepliesPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
