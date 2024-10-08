require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { validarLti } = require('./middleware/validar-lti');
// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000)

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const baseUrl = process.env.BASE_URL
const CONSUMER_SECRET = process.env.CONSUMER_SECRET

// Definir una ruta para la página principal
app.get('/', (req, res) => {
  res.render('info', { message: 'IUD GPT' });
});

/*app.post('/', (req, res) => {
   // console.log(req)
    res.render('index', { message: 'Hello, World!' });
});*/

app.post('/', [validarLti], (req, res) => {
    if(process.env.ENABLED !== 'ok') {
        res.render('info', { message: 'IUD GPT' });
        return;
    }
    if(!req.body) {
        res.status(400).send('No body');
        return;
    }
    
    const {
        user_id, 
        context_title, 
        lis_person_name_given, 
        user_image,
        custom_canvas_course_id,
        custom_canvas_user_id,
        context_id
                
    } = req.body
    console.log(req.body)

    res.render('index', { 
        image : user_image,
        courseId : custom_canvas_course_id, 
        name : lis_person_name_given,
        contextId: context_id,
        studentId : user_id,
        studentIdCanvas : custom_canvas_user_id,
        message: `Hola ${lis_person_name_given}, Soy IUD GPT. Puedes preguntarme lo que desees sobre el curso: ${context_title}`,
        baseUrl,
        secret: CONSUMER_SECRET,
        contextTitle: context_title
    });

})
// Iniciar el servidor
app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});
