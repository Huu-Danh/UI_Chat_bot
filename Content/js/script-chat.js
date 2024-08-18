const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Lấy thời gian hiện tại và định dạng
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Tạo phần tử <li> chứa nội dung tin nhắn và thời gian
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    if (className === "outgoing") {
        chatLi.style.alignItems = `flex-end`;
        chatLi.style.flexDirection = `column`;
      }
    // Nội dung của tin nhắn và thời gian
    let chatContent = className === "outgoing" 
        ? `<p>${message}</p><small class="time">${currentTime}</small>` 
        : `<span><img src="/Content/img/download.png" alt="logo_Vietravel" width="30" height="30"></span><div><p>${message}</p><small class="time">${currentTime}</small></div>`;
    
    chatLi.innerHTML = chatContent;
    
    return chatLi; // Trả về phần tử <li>
}

const generateResponse = async (chatElement, userMessage) => {
    const API_URL = "http://127.0.0.1:8000/chatbot/";
    const messageElement = chatElement.querySelector("p");

    // Định nghĩa các tùy chọn yêu cầu
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: userMessage })
    };

    try {
        // Gửi yêu cầu POST đến API và chờ phản hồi
        const response = await fetch(API_URL, requestOptions);

        // Kiểm tra nếu phản hồi không thành công
        if (!response.ok) {
            throw new Error('Phản hồi mạng không ổn định');
        }
        // Chuyển đổi phản hồi thành chuỗi văn bản
        const data = await response.json();
        const botResponse = data.answer;
        // Hiển thị nội dung phản hồi
        messageElement.innerHTML = botResponse
    } catch (error) {
        // Xử lý lỗi
        messageElement.classList.add("error");
        messageElement.textContent = "Đã có lỗi xảy ra. Vui lòng thử lại.";
    } finally {
        // Cuộn xuống cuối cùng của chatbox
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("CSKH Vietravel đang trả lời...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, userMessage);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});


function convertTextToLink(text) {
    // biểu thức nhận ra url
    const urlPattern = /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[-A-Z0-9+&@#\/%=~_|$])/ig;
    return text.replace(urlPattern, function (url) {
        // Chuyển URL thành thẻ <a> với thuộc tính href và target
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}


sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
