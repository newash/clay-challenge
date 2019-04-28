# Frontend coding challenge project for Clay

## Original description

Now let’s assume that one of those customers “TheCloudLock” so far only used RFID Tags to let customers open doors. TheCloudLock customers for instance are small retail shops. The next cool thing they are looking for is a way to open the door with the click of a button. That’s what your assignment is about. We ask you to build an interface for Web and/or Mobile for an imaginary shop with 2 doors: Front Door and Storage Room. There’re four employees. Only employees with the proper authorization can open the doors.

So what we need at a minimum is:
1. An Input screen to define doors and people
2. A screen to set authorization for opening the doors
3. A screen that allows users to click “open door”
4. Every door opening or rejection needs to be displayed in an events list

We think that great applications are smooth and clear so we expect at least a smooth UX experience after pressing the “open door” button and a clear “access denied” message when someone can’t open the door.

## Project description

The project uses Firebase for hosting, user management and database. Can be visited at https://clay-challenge.firebaseapp.com/ .

- If the database and the userlist is empty / hasn't been initialized, the app starts with a manager signup screen. Only that user will have access to the administrator screens later. Its email and password can't be changed in the app.
- The admin screens are 4 tabs in a page: 3 management tables plus the event list. Because of the table sizes, it's recommended to use them on desktop.
- The employee users (that the manager created), after logging in, are seeing a different page, the "Open Door". That is a very simple list of buttons triggering open requests to the backend and giving visual feedback. That page is optimized for mobile use.
- The app is secure in the sense that only the logged in manager can modify the backend data (and mostly even read them), and the employees' door open requests are processed on the server.

## Deployment

- create a Firebase project as described [here](https://firebase.google.com/docs/web/setup#create-project)
- [install Firebase CLI](https://firebase.google.com/docs/cli/#install_the_firebase_cli)
- check out the project from this repository
- create and configure the `/client/.env` environment file according to [this](https://firebase.google.com/docs/web/setup#obtain-config-object)
- deploy with `firebase deploy`

