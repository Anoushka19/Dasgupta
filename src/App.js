import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper, List, Slider } from '@material-ui/core';
import './App.css'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '35%',
    },
    '& .MuiButton-root': {
      margin: theme.spacing(1),
      width: '14%',
    },
    '& .MuiSlider-root': {
      margin: theme.spacing(1),
    },
    '& .MuiBox-root': {
      margin: theme.spacing(1),
      width: '35%',
    },
    '& .MuiPaper-root': {
      margin: theme.spacing(1),
      width: '35%',
    },
  },
}));

const request = require('request');
//const uuidv4 = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');

export default function App() {
  const scrollRef = useRef(null);
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [messages, setMessages] = React.useState({
    "sent": []
  });

  function translate(lang, sender, text) {
    let options = {
      method: 'POST',
      baseUrl: 'https://api.cognitive.microsofttranslator.com/',
      url: 'translate',
      qs: {
        'api-version': '3.0',
        'to': [lang]
      },
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.REACT_APP_TRANS_API_KEY,
        'Ocp-Apim-Subscription-Region': 'eastus',
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      body: [{
        'text': text
      }],
      json: true,
    };

    request(options, function (err, res, body) {
      console.log(body[0].translations[0].text);
      var tempJson = { ...messages }
      tempJson.sent.push({ "sender": sender, "text": body[0].translations[0].text })
      setMessages(tempJson)
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
      setValue("")
    });
  };

  function addMessage(sender, text) {
    if (text !== "") {
      if (sender === "right") {
        translate('es', sender, text)
      }
      if (sender === "left") {
        translate('en', sender, text)
      }
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  return (
    <div className="App-header">
      <div className="App">

        <form className={classes.root} noValidate autoComplete="off">
          <h1 style={{ fontFamily: 'verdana', color: '#ff9900' }}>GatorCom App</h1>
          <div>
            <Button style={{ backgroundColor: '#b17316', color: 'white', width: "50%"}} onClick={() => window.open("https://campusmap.ufl.edu/#/", "_blank")} variant="contained">Campus Map / Mapa del Campus</Button>
           
          </div>
          <div style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Paper style={{ width: '60%', height: '20ch', overflow: 'auto', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#ff9900' }}>
              {
                messages.sent.length === 0 &&
                <div>
                <h3 style={{ color: '#0d0d59' }}>Type a message and tap the translate button to begin!</h3>
                <h3 style={{ color: '#0d0d59' }}>Escriba un mensaje y toque el botón traducir para comenzar!</h3>
                </div>
              }
              <List style={{ padding: '10px' }}>
                {
                  messages.sent.map(item => item.sender === "left" ? (
                    <div style={{ textAlign: 'left', backgroundColor: "#2a8cfd", maxWidth: '45%', borderStyle: 'solid', borderWidth: '1px', padding: '5px', borderRadius: '10px', marginTop: '4px' }}>
                      <text style={{ color: "white" }} display="inline">{item.text}</text>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'left', backgroundColor: '#17b817', maxWidth: '45%', borderStyle: 'solid', borderWidth: '1px', padding: '5px', borderRadius: '10px', marginTop: '4px', alignSelf: 'right', marginLeft: 'auto' }}>
                      <text style={{ color: "white" }} display="inline">{item.text}</text>
                    </div>
                  ))
                }

              </List>
              
              <br></br>
              <li ref={scrollRef} style={{ color: '#3d3d3d' }} />
            </Paper>
            <Paper style={{ width: '60%', height: '11ch', overflow: 'auto', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#ff9900' }}>
              <h1 style={{ color: '#0d0d59e', fontSize: '16px' }}>Translation Quality / Calidad de Traducción</h1>
            <div style={{ display: "flex", flexDirection: "row", alignContent: "center", marginLeft: 'auto', marginRight: 'auto'}}>
                <div style={{ width: '40%', paddingTop: '0px', paddingLeft:'15px', marginTop: '4px' }}>
                  <Slider
                    defaultValue={5}
                    style={{ color: "#2a8cfd"}}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={10}
                  />
                </div>
                <div style={{ width: '40%', paddingTop: '0px', paddingLeft:'13%', marginTop: '4px' }}>

                  <Slider
                    defaultValue={5}
                    style={{ color: "#17b817"}}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={10}
                  />
                </div>
              </div>
            </Paper>
          </div>
          <div>
            <textarea
              
              placeholder="Texto Para Traducir/ Text To Translate"
              multiline
              style={{ backgroundColor: '#848484', borderRadius: '5px', width: '35%', fontSize: '16px', fontFamily: 'arial' }}
              rows={4}
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </div>
          <div>
            <Button style={{ backgroundColor: '#2a8cfd', color: 'white' }} onClick={() => { addMessage("left", value); setValue("") }} variant="contained">Traducir al Inglés</Button>
            <Button style={{ backgroundColor: '#17b817', color: 'white' }} onClick={() => { addMessage("right", value); setValue("") }} variant="contained">Translate to Spanish</Button>
          </div>
          <div>
          <Button style={{ backgroundColor: '#b17316', color: 'white', width: "50%" }} onClick={() => window.open("http://localhost:3000/", "_self")} variant="contained">End Interaction / Interacción Final</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
