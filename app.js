const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req,res) => {
    res.render('contact');
});

app.post('/send', (req,res) => {
    const output = `
    <h3>Informacoes de Contato</h3>
    <ul>  
      <li>Nome: ${req.body.name}</li>
      <li>Empresa: ${req.body.company}</li>
      <li>E-mail: ${req.body.email}</li>
      <li>Telefone: ${req.body.phone}</li>
    </ul>
    <h3>Mensagem</h3>
    <p>${req.body.message}</p>
  `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.agencia33.net',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'fabio@agencia33.net', // generated ethereal user
            pass: 'abc123456'  // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
          }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer <fabio@agencia33.net>', // sender address
        to: 'fabio@agencia33.net', // list of receivers
        subject: 'Nodemailer', // Subject line
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg:'E-mail enviado com sucesso'});        
    });
});

app.listen(8080, () => console.log('Server started on Port 3000'));