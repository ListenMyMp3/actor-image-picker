class ChatGPTAssistant {
    static API_KEY = "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"; // <-- Вставь сюда свой API-ключ!
    
    static async askGPT(prompt) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }
}

Hooks.on("init", () => {
    game.chatgpt = ChatGPTAssistant;

    ChatCommands.register("gpt", {
        description: "Отправить запрос в ChatGPT",
        permission: "PLAYER",
        callback: async (text) => {
            if (!text) return ui.notifications.warn("Введите вопрос после /gpt");
            
            const reply = await ChatGPTAssistant.askGPT(text);
            ChatMessage.create({
                content: `<strong>ChatGPT:</strong> ${reply}`,
                speaker: { alias: "ChatGPT" }
            });
        }
    });
});
