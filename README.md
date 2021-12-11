Secure Chat Application Server

Hosted at: https://secure-chat-application.herokuapp.com/
Websocket at: wss://secure-chat-application.herokuapp.com/

Rough Docs:

Connect to the websocket using above mentioned URL
Send a message of following format to authorize
    {
    "type": 1000,
    "authCode": "123456"
    }
Current version doesnot verify authCode it could be any random value as of now
After receiving auth message from client, Server will recognise the client and
client will be able to send and receive messages from the client

To send messages from other devices use 
    {
    "type": 2000,
    "Message": "Hello"
    }
This message will be broadcasted to all connected devices

Add to property to send this message to a specific user
As of now authCode send during authorization is being used to idenfity the unique user
{
    "type": 2000,
    "authCode": "12345",
    "to": "123456"
}

