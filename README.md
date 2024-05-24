# HIIT up2107487

# foreword
 - Within the code, I use exercise and activity interchangeably. Additionally, I use workout and playlist interchangeably.
 - a link to the github can be found here: `https://github.com/SpindlySpider/coursework`
 - mobile only application as its unlikely people will be working out with their laptop/computer and as such it is taloired for a mobile experience 

# setup
## installation 
first run `npm install` then once complete run `npm start` 
## connection
on the same machine you are running `npm start` go to the web address `http://localhost:8080`

---
# core requirements
I have implemented all core requirements I will now list them and where to find them
## build custom HIIT workout from scratch
a user can build a custom HIIT workout, first create a new exercise,then create a playlist and add the exercise to it 
 - to create an exercise => add button in the navbar -> add activity -> input data -> save
 - to create a playlist => add button in the navbar -> create new playlist -> create empty playlist -> input data -> save
 - to add an exercise to the playlist press +exercise and then click the exercises you wish to add.
## start, stop and pause workout
to start a workout you must create a workout with exercises within it
then go to playlist page, the dumbell icon in the navbar and press start on the workout you have made

---
# advanced features

## visual cues - count in 
 - when the user starts a workout there is a count in, this allows the users to get ready for the exercises and be sufficently prepared
 - there is a timer with a clock and text showing the current time 
 - there is also a up next box under the timer which the user can see
### motivation
 this allows the user to understand and be able to quickly glimice where they are within the workout
## workout import and exporting - users are able to import and export playlist
users can share playlists via a JSON file, either importing or exporting it 
these features can be found in:
 - playlist page -> edit -> scroll down to the bottom -> export playlist
 - add -> create new playlist -> import playlist
 this feature also exports all exercies within the JSON so that all the user needs to do is import the exported JSON to add the workout and exercies to their own account. 
### motivation
 I believe that users should be able to share data even offline and easily share workout, providing the users with a JSON allows users to easily share workouts
## tags - users can tag excerises
users are able to tag exercises
this feature is not complete, the idea was that exercises could be filtered on tags, which would allow for easily adding exercices to a workout
this feature can be found in:
 - either add or edit exercise -> type a tag -> press enter -> tag is now assocaited with this exercise
## toast notificaiton - web componenet
to show notificaiton to the user there is a toast notificaiton web componenet, this can be found within `public/web_components/toast-notification`
this web componenet allows you to show messages on the user screen that disapear after a timeout, in addition you are able to provide a URL to a photo allowing you to create custom messages to show the users
## dashboard - overview 
the dashboard gives a user an overview of how long they have worked out for and how many workouts they have completed

## image multiparser - handling image uploads on the server
as we were not allowed to use external libaries, it made getting images to and from the server difficult. The solution I came to was to create my own image multiparser, this can be found in the path `server/routes/pictures/multibody_praser.mjs`.
this features is implmenting featues that a libary like multer would add. This file creates a file reader for a input stream that the user will send when uploading a file.
to see this feature in action:
 - simply create a new activity and press the add activity button 
 - add an image and save it.
 - logout of your account and log back in you can see the server has successfuly saved it.

## multiple users 
this application supports multiple users. you are able to log in and out of differnt accounts. each account keeps track of what the user has done. to log in and out of accounts go to:
 - the person icon in the nav bar -> login / out
### not signed in user
a user of the application should still be able to use the app without being signed in. And as such the if you are not signed in you are able to create and edit exercises, however you are not able to add pictures or have dashboard information
## PWA - progressive web app
this application is also a progressive web app and is installable on supported devices as well has support for offline
### service worker - static and dynamic caching
I have also set up a service worker (`/public/serviceworker.mjs`) which caches static assests on install, and has a network-first dynamic caching stratagy when caching fetch requests
orginally I wanted to have a stale-while-revailidate stratagy, however I found it difficult to properly set up service workers. additionally when impleneted it caused unwanted behaviour as the cached response was returned rather than the freshest version. In the future I think that stale-while-revailidate stratagy would be good for images, however text and exercise lists must be a network-first cache
### offline - partially implemented
because of the service worker if you have used the app while online you are still able to browse and edit exercises, and if you completed a work out the application will also allow you to complete a workout.
 - the reason it is partially implemented is because you are not able to create new playlists while ofline.
## web worker - for timer 
 a web worker `./public/web_componets/timer/timer-worker.mjs` is used for a timer web componenet to reduce stress on the main thread
 ### motivation for this 
orginally I was having issues with the workout timer having consistant speed. After some research I have found that setinterval and settimeout are not the most aucrate. I was having issues where the timer would take around 3 seconds to actually start. I beleive this is because of lots of operations occuring on the main thread. To mitigate the delay with the set interval timer I decided to create a web worker to handle set intervals and calculations to reduce the load on the main thread.  
## drag and drop workout modification
the user can edit the order of exercies within a workout by dragging the workout up and down. this can be found within the webapp when you edit an exercise and then hold and drag on the :: icon

---

# maintance
## file structure
the structure for this application is comprised of two main folders: `public` and `server`. 
 - public refers to the client side database 
    - examples include web componenets
    - icons 
    - css 
    - js
    - service worker
 - the service worker is placed in the root of the public folder as it allows it to access all files and cache resources if it was placed in a child directory it would not be able to access and cache data correctly
 - the server contains server side data this includes 
    - database files, such as the SQL database, and files to handle each route 
    - routes which contain javascript files telling express how to correctly route data and how to handle it 
    - photos, which contains a folder of all the images the user uploads, when a user uploads an image it is stored with a UUID

## database
there are two databases within this application:
 - the local database of the client(local storage) which contains 4 parts: account, activities, playlist, tag. 
 - the server database, this is a SQLLITE database which is built for scalabilitiy an ERD can be found here, although the database could have been a JSON stored within one table, I wanted to create a database within the server which would be better at scaling
![entity relationship diagram](https://github.com/SpindlySpider/coursework/assets/19748010/cc9f3b8f-6f0d-43d5-9def-83a33e8c33ff)

## justification of design

- multiple of the same activity title can exist, this is because users may want different versions of the activity, example : squats with differnt times

- css varaibles are not defined in :root instead they are defined in the * selector, this is because :root varaibles are not avalaible inside template componenets and as such you are not able to define them for each web componenet there. defning them within gives avalaiblity to the entire webcomponenet DOM to use these CSS variables which allows for rapid chanignig of colours 

 - the design is mobile only, this is because users are unlikely to use the application on their laptop while they are outside or moving around as it would be difficult to use while exercising
### custom webcomponents design pholosiphy
- all selections should be done within the constructor of the webcomponents , this is due to the fact we cannot easily select elements form the shadowDOM outside of the constructor, therefore doing this reduces the long lines of query selectors to get a specific element

## TODO - additonal features that could be added
- [x] image selector - allow the user to upload and view custom pictures for exercises
- [x] server side storage - the user should be able to store exercises, workouts, tags and images on the server
- [x] create web worker to reduce load on main thread
- [x] workouts should automatically add exercise rests and set rests
- [x] make progressive webapp
- [x] error handling for inputs
- [ ] equipment selector, users should be able to attach equipment to specific exercises (e.g 10KG dumbbell for deadlift)
- [ ] server side error handling for database inputs
- [ ] page history so that users are able to go back
- [ ] user should be able to filter exercises by tag
- [ ] user should be able to filter exercises by equipment
- [ ] user should be able to filter exercises by body part, for example there should be an image of a body and if they press a bicept it should show all exercieses to do with it 

---

## AI
within this project I tried to minimise the amount of AI I used, instead I looked through stack overflow, youtube videos and mdn. This is because at the begining of the coursework I used AI to learn about web componenets however it didnt provide me with useful information and instead left me more confused. Instead, I started reading through javascript documentation on MDN and found it significantly more useful. Because of this I do not have many AI prompts as I would just refer to documentation or other examples of implementation to do with specific features. 
### Prompts to develop my understanding of webcomponents

this sqeuence of prompts are used to try and help me grasp a better understanding of how the structure of a shadowDOM should be within a webcomponent.  
A sequence of prompts helped me develop this feature:

> hello i have a question about web components and best practises, I was wondering what is a standard way of defining shadow DOMs within JavaScript in a readable format, I was wondering if it was a good idea to use a template and then load it into the web component or define the structure within the web component its self

chatgpt response was that both are vaild ways of creating shadowDOM however it says that templates are may make the code more readable. because of this I may experiment using templates within the webcomponents.

looking more into templates it would be easier if the template is defined within the JS its self as we will have to deal with fetch requests, which for a constructor within a custom element is not ideal. Futhuer more the DOM being self contained allows for these web components to be effortlessly imported anywhere.  
https://www.youtube.com/watch?v=2I7uX8m0Ta0 -> this youtube video helps demonstrate how to use templates and web componenets together

---

I am unsure how to set a reference to a shadowDOM so it can be used later within the webcomponenet, I cannot find anything through search results so I am going to use chatGPT to see if there is a way.

> how can I make a reference to a shadowDOM when you call `this.attachShadow({ mode: 'open' })` in a web componenet. I need it to be able to be referenced in functions within the webcomponenet as I want to query select from it

the response chatGPT gave me is what I have already tried, therefore this response was useless. looking into different ways to do this is through the universitys repo custom-elements here -> https://github.com/portsoc/custom-elements/blob/master/examples/custom/8/analog/clock.js

- we should define all attribues we need to use later within the constructor
  looking into the example provided by the university, to allow functions to be able to access `this.var_name` you must use `function_name.bind(object_name)` I believe this is because you are binding the object to the function so it can use the calls within its function.

---

I am having issues when using async connectedCallback, I have been utilizing setTimeout, to ensure that the entire connect back is finshed, but this solution is awful as not all elements are inilized meaing when we try to manipulate the comment is leads to odd behavoiur

> hello with a webcomponenet which has a async onconnect call back how can i make sure that it complelets and all of its waits are finished before code can continue

chatgpt is not correctly understanding my issue, it is suggesting that using a initilise async within the connectedCallback. This does not solve my problem as the issue is not with connectedCallback being excuted, rather the connectedCallback not being complete in external code leading to attributes not being avalaible.

one method I can think to fix this is having an asyncronise function which acts as the on connectedCallback, which can be invoked through a method call externally. we can use a variable called initilised, to check wether we need to append to the DOM or wether the method has already been invoked externally or from the connectedCallback.
