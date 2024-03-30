# HIIT up2107487

## file structure

## justification of design

- multiple of the same activity title can exist, this is because users may want different versions of the activity, example : squats with differnt times

## TODO

- make a description box which has a edit button otherwise it is not editable
- add a tag selector web componenet
- make a equipment selector
- add photo selector too
- create a web componenet for storing items in a column fashion
- [ x ] core functionality
- [ x ] add storage of new events
- [ ] create custom description field
  - [ ] not editable untill edit button pressed
- [ ] create custom add photo for customising the excerize
- [ ] add css to make it look functional
- [ ] push the new data to the server to store it in a mysqllite database
- [ ] difficulty rating for custom exercises
- [ x ] maybe make a server and client within the public folder to store code and serve
- [ ] utilities get activity and get playlist functions can be combined into one
- [ x ] implement timer
- [ ] clean up code
- [ ] database use https://github.com/portsoc/staged-simple-message-board to learn how
- [ ] create history using reference to https://github.com/portsoc/simple-one-page

## Key features

REMOVE ME: Introduce the key features, paying special attention to the non-code ones. Tell us briefly how to find & use them, and describes the reasons behind the design decisions you made in their implementation.

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

---

> this is an example prompt given to a chatbot detailing XYZ
> The response was better so I could speifically ask about QRST

The response was proved useless because the prompt wasn't specific enough about XYZ, so:

> how can I integrate QRST here?
> The suggestion worked with minor modification.

### Prompts to develop GHIJ (exmaple)

For the GHIJ feature I ...

> this is an example prompt given to a chatbot
> words words words etc.
