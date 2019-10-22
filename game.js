var currentArea = 0                                                                                                         //The game is composed of a series of rooms identified by number. This line starts the game at room 0
const clearInput = () => {document.getElementById("parsebox").value = ""}                                                   //clearInput blanks the input field which is named 'parsebox'. This just means that you don't have to remove the text you've just typed in order to type something else
var inventory = []                                                                                                          //There is an inventory and, at initialisation, it is an empty array

const addItem = (item) => {                                                                                                 //The addItem function accepts an item and adds that item to the inventory 
    if (inventory.includes(item) == false){                                                                                 //The function will only add an item to the inventory if it isn't already there, to avoid unnecessary duplicates in the inventory
        inventory.push(item)}}                                                                                              //To add the item to the inventory, it is simply pushed into the inventory array

const removeItem = (item) => {                                                                                              //removeItem works exactly the same way as addItem, except it removes an item from your inventory
    if (inventory.includes(item)){                                                                                          //This line is almost in perfect english, and it's literally checking 'if (the) inventory includes (the specified) item'
        inventory.splice(inventory.indexOf(item), 1)}}                                                                      //To remove the item from the inventory, this function splices the array at the position of the item that matches the function's parameter, thus removing it from the inventory

const getArea = (num) => {                                                                                                  //getArea is a function which accepts a number for the area. It reads the json file for the area corresponding to this number. getArea(0), for example, returns the information for the very first room
    var area = ""                                                                                                           //area is a temporary variable which is used internally as shorthand
    jQuery.ajax({                                                                                                           //Jquery is a library which contains ajax, both of which are used in order to 
      url: "areas.json",                                                                                                    //The url is passed directly into the function as a key-value pair to determine the file that'll be used
      success: function(html) {                                                                                             //If the function is successful, then it'll perform the next line, passing in a temporary variable called html which is effectively a link to the url previously mentioned; a link to the json file which contains all of the information for the game
        area = html},                                                                                                       //Now, the area variable is assigned the same value as the html and can be used to refer to the json file
      async:false})                                                                                                         //This line ensures that the function is not being run asynchronously. This is not recommended, it's actually deprecated, but this means that I don't have to write the rest of muy code asynchronously to match
    return area[num]}                                                                                                       //Finally, this line returns the the area of the number specified by the function's caller. 
  
const draw = (num) => {                                                                                                     //The draw function is responsible for updating the different parts of the screen; 'drawing' the information. It requires a number which will be passed into the getArea function three times
    currentArea = num                                                                                                       //First, the current area is assigned to the number that has been passed into the function, this is important as currentArea is a global variable which is used in this and other functions
    if (getArea(currentArea).hasOwnProperty("code")){                                                                       //Then we check whether or not there is a 'code' component to the area. If there is, the 'code' will take effect before the rest of the function
        if (getArea(currentArea).code.hasOwnProperty("add")){                                                               //What the 'code' does depends on what's available inside it, the first possible thing being to 'add' if this is specified in the json
            addItem(getArea(currentArea).code.add)}                                                                         //If there is an 'add' component then the value of this will be added to the inventory as an item
        if (getArea(currentArea).code.hasOwnProperty("remove")){                                                            //Similarly, the 'remove' component's value will be removed from the inventory
            removeItem(getArea(currentArea).code.remove)}                                                                         
        if (getArea(currentArea).code.hasOwnProperty("condition")){                                                         //Then, if there's a condition, then that means the inventory will be checked for that condition.
            if (inventory.includes(getArea(currentArea).code.condition)){                                                   //If the condition exists, and the inventory contains it, then the following will run
                currentArea = getArea(currentArea).code.goto}}                                                              //The currentArea will be updated to the area number specified in the 'goto' variable in the json file. This means that instead of going to the previously assigned area, the player will go to this area instead
            else { if(getArea(currentArea).code.hasOwnProperty("goto")){currentArea = getArea(currentArea).code.goto}}}     //If there isn't a condition, but there is a 'goto', then the player will still go to the area specified. This isn't likely to be useful, but it's still an option in case anyone wants to use it. If nothing else, it can function as a redirect to working areas if this area is under development and not ready for playing
    console.log("current area is now "+currentArea)                                                                         //To ensure that the function has been called successfully and to give the room number which is useful for debugging, the room number is logged to the console for anyone using web development tools
    if(inventory != [] && inventory != [""]){console.log(`You have: ${inventory.join(", ")}`)}                              //This line also logs to the console the current inventory
    document.getElementById("titleName").innerText = getArea(currentArea).title                                             //The inner text of titleName is effectively the title of the page, which we change to the title which is in the json file for the new area
    document.getElementById("subtitleName").innerText = getArea(currentArea).subtitle                                       //Similarly, the subtitle name is changed according to the json file, and so is the description
    document.getElementById("gametext").innerText = getArea(currentArea).desc}

const myfunc = () => {                                                                                                      //myfunc is a placeholder name which just stuck. This is what is called in the HTML when enter is pressed
    var input = document.getElementById("parsebox").value.toLowerCase()                                                     //input is a local variable which I use to collect the input from the input field on the page; this is what the user types.
    if (getArea(currentArea).hasOwnProperty(input) && input != 'title' && input != 'subtitle' && input != 'desc' && input != 'code'){   //This checks that the current area has a command for what has been input, and that it isn't an 'illegal' value. This means that the input will always and only be accepted if it makes sense
        draw(getArea(currentArea)[input])}                                                                                  //Assuming that it does make sense and the room exists, the user will be taken to the appropriate area. This is done by drawing the room corresponding to the player's input 
    else if (input == 'restart'){draw(0);inventory = []}                                                                    //These 'else if' statements are used for global commands. The previous checks aren't necessary for these because we don't want to check that the room contains these commands; we want to make sure that these commands are carried out regardless. Also, on restart, the inventory is cleared to make it a true restart.
    else if (input == 'info'){draw(3)}                                                                                      //Typing 'restart' or 'info' at any time will take you to rooms 0 or 4 respectively
    else if (input == 'inv' || input == 'inventory' || input == 'i'){                                                       //Typing 'i', 'inv' or 'inventory will show your inventory
        document.getElementById("gametext").innerText += `\n\nYour current inventory consists of:\n ${inventory.join(", ")}`//The inventory is shown by adding the text 'Your current inventory consists of: ' followed by your inventory to the end of the on-screen description
    }clearInput()}                                                                                                          //Lastly, the clearInput function is called just to clean up
    
                                                                                                            

/*
    json files do not allow comments, so they're described here instead. This is an example of an area

    {
        "title": "title name",
        "subtitle": "subtitle name",
        "desc": "room description",
        "other": room number
        "code": {
            "add": "item"
            "remove": "item"
            "condition": "item"
            "goto": room number
        }
    }

    'title name', 'subtitle name' and 'room description' are self-descriptive
    The fourth line is an example of an additional command
    The key ("other") is the text that the player must type in that room in order to move to a certain room
    The value (room number) is the room that the player will move to when they type the command (other) in the current room
    There is no defined limit on the number of additional commands that can be used, simply add another command as necessary

    the "code" object contains different things that will happen depending on additional variables
    "add" instantly adds the specified item to the inventory whilst remove does the opposite
    "condition" checks for the specified item and if it is in the inventory (or isn't present) then "goto" will be used
    the room number after goto is the room that the player will be taken to if they reach the conditions or there are no conditions
    you cannot be forced through multiple redirects; if you 'goto' an area then you will not 'goto' any subsequent areas even if you reach the conditions. 
    
*/