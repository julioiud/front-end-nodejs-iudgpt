document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatMessages = document.getElementById('chatMessages');
  const clearButton = document.getElementById('clearChat');
  const themeToggle = document.getElementById('themeToggle');
  const faqItems = document.querySelectorAll('.faq-item');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  const faqSearch = document.getElementById('faqSearch');
  const toggleSidebar = document.querySelector('.toggle-sidebar');
  const sidebar = document.querySelector('.sidebar');

  // Bot responses database
  const botResponses = {
    "hola": "¡Hola! Soy el asistente virtual de tu curso. ¿En qué puedo ayudarte hoy?",
    "adiós": "¡Hasta pronto! Si tienes más dudas sobre el curso, estaré aquí para ayudarte.",
    "gracias": "¡De nada! Estoy aquí para ayudarte con el curso. ¿Hay algo más en lo que pueda asistirte?",
    "contenido": "Este curso abarca los siguientes temas principales: introducción a la materia, fundamentos teóricos, aplicaciones prácticas, y evaluación de casos. Cada unidad cuenta con lecturas, vídeos explicativos y actividades para reforzar el aprendizaje.",
    "objetivos": "Los objetivos de aprendizaje del curso son: comprender los conceptos fundamentales de la materia, desarrollar habilidades prácticas para aplicar estos conocimientos, analizar casos reales, y crear soluciones innovadoras a problemas del campo.",
    "evaluación": "La evaluación del curso se distribuye de la siguiente manera: 20% participación en foros, 30% actividades prácticas, 20% proyecto grupal y 30% evaluación final. Para aprobar necesitas obtener al menos 70/100 puntos.",
    "fechas": "Las fechas importantes del curso son: primera entrega (15 de mayo), segunda entrega (10 de junio), entrega de proyecto (25 de junio) y evaluación final (10 de julio). Todas las entregas deben realizarse antes de las 23:59 del día indicado.",
    "material": "El material de estudio lo encuentras en la sección 'Recursos' del aula virtual. Incluye presentaciones, lecturas recomendadas, videos explicativos y guías de ejercicios prácticos.",
    "foros": "Los foros de discusión son espacios para debatir temas del curso. Para participar, debes acceder a la sección 'Foros', seleccionar el tema actual y hacer clic en 'Responder'. Recuerda que tu participación es parte de la evaluación.",
    "profesor": "Para contactar a tu profesor, puedes enviarle un mensaje directo a través del aula virtual en la sección 'Mensajes', o escribir al correo electrónico profesor@iudigital.edu.co. El tiempo promedio de respuesta es de 24-48 horas.",
    "biblioteca": "Los recursos bibliográficos del curso están disponibles en la biblioteca digital. Puedes acceder desde el aula virtual en la sección 'Biblioteca'. Allí encontrarás los libros de texto, artículos científicos y material complementario recomendado.",
    "grupos": "Para los trabajos grupales, puedes inscribirte en un grupo desde la sección 'Grupos' del aula virtual. Cada grupo debe tener entre 3-5 estudiantes. La fecha límite para formar grupos es el 20 de mayo."
  };

  initChat();

  async function sendMessage(message = '', isUser = true) {
    if (message.trim() === '') return;

    const currentTime = getCurrentTime();
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user' : 'message bot';

    // Create message content
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;

    // Create time element
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;

    // Add content and time to message
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);

    // Add options for user messages
    if (isUser) {
      const messageOptions = document.createElement('div');
      messageOptions.className = 'message-options';

      const editButton = document.createElement('button');
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.title = 'Editar';

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-times"></i>';
      deleteButton.title = 'Eliminar';

      messageOptions.appendChild(editButton);
      messageOptions.appendChild(deleteButton);
      messageDiv.appendChild(messageOptions);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Bot response function
  async function getBotResponse(userMessage) {
    // Convert to lowercase for case-insensitive matching
    const messageLower = userMessage.toLowerCase();

    // Check for exact matches first
    if (botResponses[messageLower]) {
      return botResponses[messageLower];
    }

    // Check for partial matches
    for (const key in botResponses) {
      if (messageLower.includes(key)) {
        return botResponses[key];
      }
    }

    // Default response
    // return "Gracias por tu consulta. Para darte una respuesta más precisa, ¿podrías proporcionarme más detalles o reformular tu pregunta? También puedes revisar las preguntas frecuentes en el menú lateral.";
    return await sendMessageButton(messageLower);
  }

  // Show bot typing animation
  function showBotTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-typing';
    typingDiv.id = 'botTyping';
    typingDiv.innerHTML = `
        <span>Asistente está escribiendo</span>
        <div class="typing-animation">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Remove bot typing animation
  function removeBotTyping() {
    const typingDiv = document.getElementById('botTyping');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  // Get current time in HH:MM format
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Initialize the chat
  function initChat() {
    // Load chat history from localStorage if available
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      chatMessages.innerHTML = savedMessages;
    }

    // Chat form submission
    chatForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const message = userInput.value.trim();
      if (message !== '') {
        await sendMessage(message, true);
        userInput.value = '';

        // Show bot typing animation
        showBotTyping();

        // Simulate bot response time (500-1500ms)
        const responseTime = Math.floor(Math.random() * 1000) + 500;
        setTimeout(async() => {
          removeBotTyping();
          const botReply = await getBotResponse(message);
         await sendMessage(botReply, false);
          // Save chat history
          localStorage.setItem('chatHistory', chatMessages.innerHTML);
        }, responseTime);
      }
    });

    // Clear chat button
    clearButton.addEventListener('click', async function () {
      if (confirm('¿Estás seguro de que deseas borrar todo el historial de chat?')) {
        chatMessages.innerHTML = '';
        // Add welcome message
        await sendMessage('Hola, soy el asistente virtual de tu curso. Estoy aquí para responder tus dudas sobre el contenido del curso, actividades, evaluaciones, fechas de entrega y recursos de aprendizaje. ¿En qué puedo ayudarte hoy?', false);
        // Clear localStorage
        localStorage.removeItem('chatHistory');
      }
    });

    // Theme toggle
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-theme');
      const icon = themeToggle.querySelector('i');
      if (icon.classList.contains('fa-moon')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });

    // FAQ items click
    faqItems.forEach(item => {
      item.addEventListener('click', async function () {
        const question = this.getAttribute('data-question');
        await sendMessage(question, true);

        // Show bot typing
        showBotTyping();

        // Simulate bot response
        setTimeout(async () => {
          removeBotTyping();
          const botReply = getBotResponse(question);
          await sendMessage(botReply, false);
          // Save chat history
          localStorage.setItem('chatHistory', chatMessages.innerHTML);
        }, 800);
      });
    });

    // Suggestion chips click
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', async function () {
        const suggestion = this.textContent;
        await sendMessage(suggestion, true);

        // Show bot typing
        showBotTyping();

        // Simulate bot response
        setTimeout(async () => {
          removeBotTyping();
          const botReply = getBotResponse(suggestion);
         await sendMessage(botReply, false);
          // Save chat history
          localStorage.setItem('chatHistory', chatMessages.innerHTML);
        }, 800);
      });
    });

    // FAQ search
    faqSearch.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase();
      faqItems.forEach(item => {
        const question = item.textContent.toLowerCase();
        if (question.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });

    // Toggle sidebar on mobile
    toggleSidebar.addEventListener('click', function () {
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 768 &&
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        !toggleSidebar.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }

const sendMessageButton = async (message = '') => {
  const data = {
    courseId,
    studentId,
    inChat: true,
    name,
    contextId,
    studentIdCanvas,
    contextTitle
  };

  if (message === '') {
    return 'En el momento, No puedo responder a tu pregunta';
  }

  data.message = message;

  try {
    showBotTyping();
    const response = await axios({
      method: 'post',
      url: baseUrl + '/messages',
      data,
      headers: {
        'secret': secret
      }
    });

    const responses = response.data.answer;

    if (Array.isArray(responses) && responses.length === 1) {
      removeBotTyping();
      return responses[0].text;
    }
    removeBotTyping();

    return typeof responses === 'string' ? responses : JSON.stringify(responses);
  } catch (e) {
    console.error(e);
    removeBotTyping();
    return '<b>No estoy disponible en este momento, lo siento</b>';
  }
}

});