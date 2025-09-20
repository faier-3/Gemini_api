import express from 'express';
import axios from 'axios';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log('收到用户消息:', userMessage); 
  try {
    const r = await axios.post(
    { contents: [{ parts: [{ text: userMessage }] }] },
      { headers: { 'Authorization': 'Bearer API_KEY' } }
    );   BASEURL,

     
    console.log('API 原始返回:', JSON.stringify(r.data, null, 2));
    const parts = r.data?.candidates?.[0]?.content?.parts || [];
    let replyText = '（空响应）';

    // 遍历 parts
    for (const p of parts) {
    if (!p.thought) {
        replyText = p.text;
        break;
    }
    }
    console.log('提取的回复文本:', replyText);
    res.json({ reply: replyText });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: '请求失败' });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});