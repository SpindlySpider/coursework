# HIIT up2107487

# forword 
within the code i use exercise and acitivity interchanagably, additionally i use workout and playlist interchanagably 
a link to the github can be found here: `https://github.com/SpindlySpider/coursework`

# setup
## installation 
first run `npm install` then once complete run `npm start` 
## connection
on the same machine you are running `npm start` go to the web address `http://localhost:8080`
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

# advanced features

## visual cues - count in 
when the user starts a workout there is a count in, this allows the users to get ready for the exercises and be sufficently prepared

## workout import and exporting - users are able to import and export playlist
users can share playlists via a JSON file, either importing or exporting it 
these features can be found in:
    - playlist page -> edit -> scroll down to the bottom -> export playlist
    - add -> create new playlist -> import playlist

## tags - users can tag excerises
users are able to tag exercises
this feature is not complete, the idea was that exercises could be filtered on tags, which would allow for easily adding exercices to a workout
this feature can be found in:
    - either add or edit exercise -> type a tag -> press enter -> tag is now assocaited with this exercise

## toast notificaiton - web componenet
to show notificaiton to the user there is a toast notificaiton web componenet, this can be found within `public/web_components/toast-notification`
this web componenet allows you to show messages on the user screen that disapear after a timeout, in addition you are able to provide a URL to a photo allowing you to create custom messages to show the user

## file structure

## justification of design

- multiple of the same activity title can exist, this is because users may want different versions of the activity, example : squats with differnt times



- css varaibles are not defined in :root instead they are defined in the * selector, this is because :root varaibles are not avalaible inside template componenets and as such you are not able to define them for each web componenet there. defning them within gives avalaiblity to the entire webcomponenet DOM to use these CSS variables which allows for rapid chanignig of colours 

## TODO

- make a description box which has a edit button otherwise it is not editable
- add a tag selector web componenet
- make a equipment selector
- add photo selector too
- create a web componenet for storing items in a column fashion
- [x] core functionality
- [x] add storage of new events
- [ ] create custom description field
  - [ ] not editable untill edit button pressed
- [ ] create custom add photo for customising the excerize
- [ ] add css to make it look functional
- [x] push the new data to the server to store it in a mysqllite database
- [ ] difficulty rating for custom exercises
  - [ ] have server made rests which have long rest, short rest, no rest
  - [ ] difficulty is when the rests is longer -> shorter
- [x] maybe make a server and client within the public folder to store code and serve
- [x] implement timer
- [ ] clean up code -- specifically entry componenet that has alot of mess
- [x] database use https://github.com/portsoc/staged-simple-message-board to learn how
- [ ] create history using reference to https://github.com/portsoc/simple-one-page
- [ ] navigation bar should only show name of categotry when it is pressed
- [ ] implement tags and import and exporting entire tags
- [ ] error handling/making sure user cannot import wrong data
- [ ] number of exercieses
- [x] prevent multiple "new tabs" comming up when making new events
- [ ] when first opening app make it start on playlists, and make sure it can never reach a point of not having anything on the screen
- [ ] have title, description and time as non editable untill pressed and it will swap out the text for the input
- [ ] promodo timer like expereince of entire workout, you should be able to swtich between views
- [ ] need to make sure that playlist and activities read from local storage if server is offline
- [ ] PWA
- [ ] tags
- [ ] import export
- [ ] readable body svg https://youtu.be/6C-GYwxdZd4 , https://youtu.be/WMqB8sVOCtk

## Key features

- HOMEMADE IMAGE MULTIPARSER

REMOVE ME: Introduce the key features, paying special attention to the non-code ones. Tell us briefly how to find & use them, and describes the reasons behind the design decisions you made in their implementation.

## drag and drop

learning to make drag and drop using
https://youtu.be/jfYWwQrtzzY

### new activities.

this is a feature which will allow users to create custom workout events by giving it a title, description, duration, tags and equipment assocaited with it.

### custom webcomponents design pholosiphy

- all selections should be done within the constructor of the webcomponents , this is due to the fact (i think) we cannot easily select elements form the shadowDOM outside of the constructor, therefore doing this reduces the long lines of query selectors to get a specific element

### Key Another Feature Name/Description.

Words words. Words words words.

Words words words words. Words words words.

Words words words words words. Words.

### Final Key Feature Name/Description.

Words.

## AI

REMOVE ME: Detail your use of AI, listing of the prompts you used, and whether the results formed or inspired part of your final submission and where we can see this (and if not, why not?). You may wish to group prompts into headings/sections - use markdown in any way that it helps you communicate your use of AI.

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

---

> this is an example prompt given to a chatbot detailing XYZ
> The response was better so I could speifically ask about QRST

The response was proved useless because the prompt wasn't specific enough about XYZ, so:

> how can I integrate QRST here?
> The suggestion worked with minor modification.


### Prompts to understand how to keep code good quaility
this is a sequence of prompts I have used to try to understand the best way I can go about keeping code clean 

> what is the best way of keeping my code clean when i am defning html elements within jacvascript?


### Prompts to develop GHIJ (exmaple)

For the GHIJ feature I ...

> this is an example prompt given to a chatbot
> words words words etc.
