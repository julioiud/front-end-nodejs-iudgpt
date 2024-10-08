const loaders = document.getElementById('loaders')
const inputField = document.getElementById('userInput')
const buttonSend = document.getElementById('buttonSend')
const buttonLoading = document.getElementById('buttonLoading')
const spinners = `<div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`

const sendMessage = () => {
  loaders.innerHTML = spinners
  buttonSend.disabled = true
  inputField.disabled = true
  buttonSend.style.display = 'none'
  buttonLoading.style.display = 'block'
  let data = {
    courseId, 
    studentId, 
    inChat: true, 
    name, 
    contextId, 
    studentIdCanvas,
    contextTitle
  }
  
  var message = inputField.value.trim();

  if (message !== "") {
      
      data.message = message

      var chatMessages = document.getElementById('chatMessages');

      // Crear contenedor para el mensaje del usuario
      var userMessage = document.createElement('div');
      userMessage.className = 'message user';

      // Crear elemento de imagen para el usuario
      var userImage = document.createElement('img');
      userImage.src = htmlString; // Coloca la ruta de la imagen del usuario
      userImage.alt = 'Usuario';
      userImage.className = 'user-image'; // Clase CSS para la imagen del usuario

      // Crear el elemento del texto del mensaje
      var userMessageText = document.createElement('span');
      userMessageText.textContent = message;

      // Agregar la imagen y el texto al contenedor del mensaje del usuario
      userMessage.appendChild(userImage); // Imagen primero
      userMessage.appendChild(userMessageText); // Mensaje del usuario después de la imagen
        
      // Agregar el mensaje del usuario al chat
      chatMessages.appendChild(userMessage);
      let htmlText = ''
      axios({
        method: 'post',
        url: baseUrl+'/messages',
        data,
        headers: {
          'secret': secret
        }
      }).then(function (response) {
        loaders.innerHTML = ''
        buttonSend.disabled = false
        inputField.disabled = false
        
        buttonLoading.style.display = 'none'
        buttonSend.style.display = 'block'

        inputField.focus()
        const responses = response.data.answer
        let text = ''
        if (responses.length === 1) {
          text = responses[0].text
        } else {
          text = responses
        }
        htmlText = text
        if (window.markedFunction) {
           htmlText = window.markedFunction.marked(text)
         } else {
             console.error('Marked no está disponible');
         }
  
        inputField.value = '';
  
        

      }).catch(function (e){
        loaders.innerHTML = ''
        buttonSend.disabled = false
        inputField.disabled = false
        buttonLoading.style.display = 'none'
        buttonSend.style.display = 'block'    
        htmlText = '<b>No estoy disponible en este momento, lo siento</b>'    
        console.log(e)
      }).finally(function() {
        loaders.innerHTML = ''
        // Simular respuesta automática del bot
        var botMessage = document.createElement('div');
        botMessage.className = 'message bot';
  
        // Crear elemento de imagen para el bot
        var botImage = document.createElement('img');
        botImage.src = '/isotipo-57x57.png'; // Coloca la ruta de la imagen del bot
        botImage.alt = 'Bot';
        botImage.className = 'img img-fluid'; // Clase CSS para la imagen del bot
    
        
        // Crear el elemento del texto del mensaje del bot
        var botMessageText = document.createElement('span');
        botMessageText.innerHTML = (htmlText) || '<b>En el momento, No puedo responder a tu pregunta</b>';
  
        // Agregar la imagen y el texto al contenedor del mensaje del bot
        botMessage.appendChild(botImage); // Imagen primero
        botMessage.appendChild(botMessageText); // Mensaje del bot después de la imagen
  
        // Agregar el mensaje del bot al chat
        chatMessages.appendChild(botMessage);
        // Scroll automático hacia el final
        chatMessages.scrollTop = chatMessages.scrollHeight;
      })
  }
}
