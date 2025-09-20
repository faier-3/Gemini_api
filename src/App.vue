<template>
  <div class="chat-container">
    <header class="chat-navbar">Gemini智能助手</header>

    <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index" :class="['chat-bubble', msg.position === 'right' ? 'right' : 'left']">
        <div v-if="msg.markdown" v-html="msg.contentHtml"></div>
        <div v-else>{{ msg.content.text }}</div>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="inputVal"
        type="text"
        placeholder="输入消息..."
        @keyup.enter="handleSend"
      />
      <button @click="handleSend">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const messages = ref([]);
const inputVal = ref('');

function appendMsg(msg, markdown = false) {
  if (markdown) {
    msg.contentHtml = DOMPurify.sanitize(marked(msg.content.text));
    msg.markdown = true;
  }
  messages.value.push(msg);
}

async function handleSend() {
  if (!inputVal.value.trim()) return;

  // 显示用户发送的消息
  appendMsg({
    type: 'text',
    content: { text: inputVal.value },
    position: 'right',
  });
  console.log('用户消息:', inputVal.value);

  const userMessage = inputVal.value;
  inputVal.value = '';

  try {
    // 调用本地代理后端
    const res = await axios.post('http://10.29.131.139:3000/api/chat', {
      message: userMessage
    });
    const replyText = res.data?.reply || '（空响应）';
    // 显示助手回复
      appendMsg({
        type: 'text',
        content: { text: replyText },
        position: 'left'
      }, true); // true 表示解析 Markdown
  } catch (err) {
    console.error('请求出错:', err.response?.data || err.message || err);
    appendMsg({
      type: 'text',
      content: { text: '请求失败，请稍后再试。' },
      position: 'left',
    });
  }
}


</script>

<style>
html, body, #app {
  /* background-color:#232b35; */
  background-image:url('assets/背景.jpg');
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
}
</style>

<style scoped>
.chat-container {
  background-color:hsl(211, 73%, 78%,0.7);
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  font-family: sans-serif;
  padding: 0 0px; /* 左右各留 12px */
  box-sizing: border-box;
  
}


.chat-navbar {
  background: #787f86;
  color: white;
  padding: 12px;
  text-align: center;
  font-size: 18px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.chat-bubble {
  max-width: 70%;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
}

.chat-bubble div[v-html] {
  text-align: left;
}
.chat-bubble.left {
  background-color: #1a4a7e;
  align-self: flex-start;
  color: white;
  text-align: left;
  opacity: 1;
}

.chat-bubble.right {
  background-color: #1a4a7e;
  opacity: 1;
  color: white;
  align-self: flex-end;
  color: rgb(255, 255, 255);
  text-align: left;
  
}

.chat-input {
  display: flex;
  padding: 8px;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}

.chat-input button {
  margin-left: 8px;
  padding: 8px 16px;
  background: #1a4a7e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

</style>
