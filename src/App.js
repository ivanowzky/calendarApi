import React from 'react';
import logo from './logo.svg';
import './App.css';
import TaskForm from './components/TaskForm';

function App() {

  var gapi = window.gapi
  /* 
    Update with your own Client Id and Api key 
  */
  var CLIENT_ID = "476809100464-s3gcun2e8evenk24o3u2l6gu383mjnsa.apps.googleusercontent.com"
  var API_KEY = "AIzaSyCcEyLdXZTKAIKL5XKV9cB111p2hWWG_Vc"
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"

  const handleClick = () => {
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        
        var event = {
          'summary': 'Awesome Event!',
          'location': '800 Howard St., San Francisco, CA 94103',
          'description': 'Really great refreshments',
          'start': {
            'dateTime': '2021-06-10T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': '2021-06-10T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'attendees': [
            {'email': 'meneaeso@gmail.com'},
            {'email': 'ivanovpsy@yahoo.com'},
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        }
        console.log(event.summary);
          
        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
         
        

        /*
            Uncomment the following block to get events
        */
        
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
        
    

      })
    })
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TaskForm/>
        <p>Click to add event to Google Calendar</p>
        <p style={{fontSize: 18}}>Uncomment the get events code to get events</p>
        <p style={{fontSize: 18}}>Don't forget to add your Client Id and Api key</p>
        <button style={{width: 100, height: 50}} onClick={handleClick}>Add Event</button>
      </header>
   
    </div>
  );
}

export default App;
