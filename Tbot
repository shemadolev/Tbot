// This is a bot that was developed for the use of Technion students.
// The bot was developed by Michael Toker in the purpose to help students and has no profit.
// The bot is running on google script platform and using google sheets to store the information to operate.
// The bot can handle multiple requests, analyze commands, and execute them.
// The bot is in constant testing and improvement. 

//Global variables
var token = "";
var url = "https://api.telegram.org/bot" + token;
var webAppUrl = "";
var numberOfCourses = 1400; 
var numberOfReviews = 2*26; 

//Exel
var helpList = "";
var userExel = "";
var courseExel = "";
var facultyRidesExel = "";


//Symbols
var groupSy = "\ud83d\udc6b"; 
var driveSy = "\ud83d\udcc1";
var csSy = "\ud83d\udcbb";
var ugSy = "\ud83d\udcca";
var moodleSy = "\ud83d\udccb";
var reviewsSy = "\ud83d\udcad";
var facebookSy = "\ud83d\udc65";
var scansSy = "\ud83d\udcda";
var attentionSy = "\ud83d\udc49";
var downSy = "\ud83d\udc47";
var YouTubeSy = "\ud83d\udcfa";
var mainSy = "\ud83c\udfe0";
var Korona = "אסט - עדכונים";
var help = "כפתור מצוקה" + 	" \ud83d\udd34";
var About = "About "+ "\ud83c\udf0e";
var wantToHelp = "I want to help";
    
var ride = "Ride groups (טרמפים) \ud83d\ude97";
var faculty = "Department groups \ud83c\udfeb";
var add = "Add course to the bot \ud83d\udcd7";
var course = "Courses \ud83d\udcda";
var usefulLink = "useful links \ud83d\udd25";
var feedback = "Feedback \ud83d\udcdd"; 
var calendar = "Calendar \ud83d\udcc5";

var drive = "Drive "+driveSy;
var courseGroup = "Telegram group "+groupSy;
var testock = "Scans - testock "+scansSy;
var facebook = "Facebook "+facebookSy;
var youTube = "YouTube " +YouTubeSy;
var reviews = "Reviews "+reviewsSy;
var mainM = "Main menu "+mainSy;
var ug = "Ug "+ugSy;
var moodle = "Moodle "+moodleSy;
var cs = "Computer science site "+csSy;

var ContactFacebook = "facebook";
var ContactEmail = "email";
var ContactLinkdIn = "linkedin";

var Domestic = "אלימות במשפחה";
var Security = "אירוע בטחון";
var Distress = "מצוקה נפשית";
var anotherHelp = "אחר";
var UsefullLinks = "קישורים שימושיים";
var QuickCalls = "חיוג מהיר";
var WantToTalk = "שיחה אנונימית עם סטודנט";
var BackFromDomestic = "חזור";
var BackFromSecurity = "חזור";
var BackFromDistress = "חזור";

var Male= "זכר";
var Female="נקבה";
var GeneralHelper = "לא משנה לי";
var BackFromGenderHelper = "חזור";

var fisrtLogInPassword = '2468';


//functions that handels the fetching of the commands from the users
function getMe() {
  var response =  UrlFetchApp.fetch(url + "/getMe");
  Logger.log(response.getContentText());
}

function getUpdates() {
  var response =  UrlFetchApp.fetch(url + "/getUpdates");
  Logger.log(response.getContentText());
}

//sendText(chatId, text, keyBoard)
//Description: sends text to chatId with exeternal keyboared(optional).
//input: chat id, string and the name of the exeternal keyboared(optional).
function sendText(chatId, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify({
        "inline_keyboard": keyBoard,
      })
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

//sendKey(chatId, text, keyBoard)
//Description: sends text to chatId with internal keyboared(optional).
//input: chat id, string and the name of the internal keyboared(optional).
function sendKey(chatId, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "Markdown",
      reply_markup: JSON.stringify({
        "keyboard": keyBoard,
      })
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function removeKey(chatId, text) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      reply_markup: JSON.stringify({
        remove_keyboard: true })
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function setWebhook() {
  var response =  UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e)); 
}

//doPost(e)
//Description: main function. Execution of the requestes.
//input: JSON. It may contain callback_query - input from exeternal keyboard, 
//or massege - input from text sent from the user or internal keyboard.
function doPost(e){
  var userEx = SpreadsheetApp.openByUrl(userExel);
  var users = userEx.getActiveSheet();
  var coursesEX = SpreadsheetApp.openByUrl(courseExel);
  var courses = coursesEX.getActiveSheet();
  var contents = JSON.parse(e.postData.contents);
  
  //exeternal keyboard command
  if (contents.callback_query){
    var id = contents.callback_query.from.id;
    var data = contents.callback_query.data;
    var name = contents.callback_query.from.first_name;
    if (data == 'Another course'){
      removeKey(id, "Please insert the course number or course name(can be partial name)");
      set(id, "Course", name, 0);
    }
    else if (data == 'Main menu'){
      sendKey(id, "How may I help you?", mainKeyBoard);
      set(id, 0, name, 0);
    }
    else if(data == "Clean my list"){
      var row = users.createTextFinder(id).findAll();
      if (row.length == 1){
        if (row[0]){
          var idRow = row[0].getRow();
          for (var currCol = 5;currCol <=15; currCol++){
            users.getRange(idRow, currCol).setValue(0);
          }
          sendText(id, "your list is clean");
        }
      }
    }else{
      var list = courses.createTextFinder(data).findAll();
      if (list.length == 1){
        sendOpt(id, name, courses, list[0].getRow());
      }
    }
    return;
  }
  
  //internal massage command
  else if (contents.message){
    //Statistics update
    var current = users.getRange(2, 12).getValue();
    users.getRange(2, 12).setValue(++current);
   
    
    //Clean text
    var id = contents.message.from.id;
    var name = contents.message.from.first_name;
    var text = contents.message.text;
    var clean = text.split('"');
    if (clean.length == 2){
      text=clean[0]+clean[1];
    }
    var info = text.split('-');
    if (info.length == 2){
      var courseNumber = info[0];
      var courseReview = info[1];
    }
    if (info.length == 3){
      var courseNumber = info[0];
      var courseName = info[1];
      var courseLink = info[2];
    }
    ///////////////////////////////////////////////password - not in use for now
    /*
    var app = SpreadsheetApp.openByUrl(userExel);
    var ss = app.getActiveSheet();
    var rows = ss.createTextFinder(id).findAll();
    if (rows.length == 0){
      sendText(id, "Hi " + name + " \ud83d\udc4b, welcome to Tbot \ud83d\udcd6");   
      sendText(id, "To get access to the bot Please insert your Technion email address to get the first time log-in password");
      var next = ss.getRange(2, 4).getValue();
      ss.getRange(next, 1).setValue(id);
      ss.getRange(next, 2).setValue("need to be verified");
      if (name) ss.getRange(next, 3).setValue(name);
      ss.getRange(2, 4).setValue(++next);
      return;
    }else{
      var row = rows[0].getRow();
      if (ss.getRange(row, 2).getValue() == "need to be verified"){
        if (text.includes(fisrtLogInPassword)){
          set(id, 0, name, 0);
          sendKey(id, "How may I help you?", mainKeyBoard);
          sendText(id, "To add a course to your list, simply search for it in the courses, and click 'Add to My List' button");
        }else if (text.includes("technion.ac.il")){
          sendText(id, "The passwors is sent to "+ text+ " please insert the password now");
          // Fetch the email address
          var emailAddress = text;
              // Send Alert Email.
              var message = text; 
              var subject = 'Tbot first log-in password';
          MailApp.sendEmail(emailAddress, subject, "The password is: "+fisrtLogInPassword);
          //TODO sent email
        }else{
          sendText(id, "To get access to the bot Please insert your Technion email address to get the first time log-in password");
        }
        return;
      }
    }*/
    /*
    else if (text == 'Re 404'){
      sendText( , 'Hi, thank you for your feedback');
      sendText( ,'You are right, I have not yet added a button that deletes a specific course. In the meantime, you can clear the list and build a new one. Hope to add an option to remove a specific course soon ..');
      sendText(id, 'Your massage sent');
    }*/
    
    if (text == "/start"){ // || text == "hey" || text == 'היי' || text == "hello" || text == 'hi'
      sendText(id, "Hi " + name + " \ud83d\udc4b, welcome to Tbot \ud83d\udcd6");        
      sendKey(id, "How may I help you?", mainKeyBoard);
      sendText(id, "To add a course to your list, simply search for it in the courses, and click 'Add to My List' button");
      set(id, 0, name, 0);
      return;
    }else if (text == 'תפריט ראשי' || text == 'Main menu' || text == mainM){
      sendKey(id, "How may I help you?", mainKeyBoard);
      set(id, 0, name, 0);
      return;
    }
    //find the user in the table and check his mode
    var rows = users.createTextFinder(id).findAll();
    var row = rows[0].getRow();
    var mode = users.getRange(row, 2).getValue();
    
    if (mode == "Talk"){
      var otherId = users.getRange(row, 4).getValue();
      //var app = SpreadsheetApp.openByUrl(helpList);
      //var helpers = app.getSheetByName('helper');
      //var needsHelp = app.getSheetByName('needHelp');
      if (text == "end" || text == 'quit' || text == 'done'){
        sendText(id, "The conversation is over");
        sendText(otherId, "The conversation is over");
        set(id, 0, name, 0);
        set(otherId, "", 0);
        sendKey(id, "How may I help you?", mainKeyBoard);
        sendKey(otherId, "How may I help you?", mainKeyBoard);
        //TODO send some feedback about the conversation
      }else{
        sendText(otherId, text);
      }
    }
    //not in anonymous convertation. Check for other commands.
    //if simple test command - sent it and return
    var isDone = simpleText(id, text);
    if (isDone) return;
    
    if (text == ride || text == 'רשימת אזורים'){
      sendKey(id, "Send the required city name or choose your region from the list below " + downSy, rideKeyBoard);
      set(id, "Ride");
      //var current = users.getRange(2, 2).getValue();
      //users.getRange(2, 2).setValue(++current);
    }else if (text == course || text == 'Another course'){
      removeKey(id, "Please insert the course number or course name in hebrew");
      set(id, "Course", name, 0);
      //var current = users.getRange(2, 1).getValue();
      //users.getRange(2, 1).setValue(++current);
    } else if (text == faculty){
      sendKey(id, "Choose your faculty from the list below ", coursesKeyBoard);
      set(id, 'faculty');
     // var current = users.getRange(2, 3).getValue();
      //users.getRange(2, 3).setValue(++current);
    }else if (text == feedback || text == "/feedback"){
      removeKey(id, "You can send your feedback now");
      set(id, 'feedback');
    }else if (text == drive || text == courseGroup || text == reviews || text == 'Get all' || text == facebook
             || text == youTube || text == ug || text == cs || text == 'All tests - exel'
             || text == moodle || text == testock || text == "Panopto"||  text == "Course info" || text == 'Teams group \ud83d\udc6a'){
      getDone(id, name, text, users, courses);
    } else if (text == Domestic){
      sendKey(id, "I can help in a variety of ways, choose your preferred way:", DomesticKeyBoard);
      var rows = needsHelp.createTextFinder(id).findAll();
      needsHelp.getRange(rows[0].getRow(), 2).setValue(text);
    }else if (text == Security){
      sendKey(id, "I can help in a variety of ways, choose your preferred way", SecurityKeyBoard);
      var rows = needsHelp.createTextFinder(id).findAll();
      needsHelp.getRange(rows[0].getRow(), 2).setValue(text);
    }else if (text == Distress){
      sendKey(id, "I can help in a variety of ways, choose your preferred way", DistressKeyBoard);
      var rows = needsHelp.createTextFinder(id).findAll();
      needsHelp.getRange(rows[0].getRow(), 2).setValue(text);
    }else if(text == wantToHelp){
      sendtext(id, "על מנת להיכנס למאגר העוזרים עלייך למלא את הטופס הבא וניצור איתך קשר בהקדם");
      sendtext(id, "https://docs.google.com/forms/d/1Zyqj5wwhV7EqxcazmRgMqISq5g7Pp98TwNDQPdRmEHQ/prefill");
    }else if (text == 'Write a review'){
      removeKey(id, "Please write  your review");
      set(id, text);
    }
    else if (text == add){
      set(id, 'Add course');
      removeKey(id, "Please insert the course number, course name and group link in the following format:"
                + " course number-course name-group link. If there is no telegram group, please insert: course number-course name-");
    }
    else if (text == 'Add telegram group'){
      set(id, text);
      sendText(id, "Please insert the group link");
      sendText(id, "Note: to get a group link you need to open a group, then go to: Manage group (or click the edit symbol using smartphone) -> Group type -> Copy link");
      sendText(id, "Don't forget to make the group visible so new members will see messages that were sent before they joined");
    }  
    else if (text == "Add Teams link"){
      set(id, text);
      sendText(id, "Please insert the group link");
    }else if (text == "Add to my course list \ud83d\udccd"){
      var added = false;
      //var row = users.createTextFinder(id).findAll();
      //if (row.length == 1){
      if (row){
        var idRow = row;
        var courseToAdd = users.getRange(idRow, 4).getValue();
        var currCol = 5;
        while (currCol <= 26){
          var currNumber = users.getRange(idRow, currCol).getValue();
          if (courseToAdd == currNumber){
            sendText(id, "This course is already in your course list");
            return;
          }
          if (currNumber) currCol++;
          else{
            (users.getRange(idRow, currCol).setValue(courseToAdd));
            var currCourseName = courses.getRange(courseToAdd, 2).getValue();
            sendText(id, currCourseName+" is added to your list")
            added = true;
            currCol = 27;
          }
        }
        if (!(added)){
          sendtext(id, "The list is full");
        }
      }
    }else if (text == "remove course"){
      //TODO
    }else if(text == "My courses \ud83d\udccc"){
      sendText(id, "Loading your courses..");
      var idRow = row;
      if (idRow){
        var currCol = 5;
        var courseList = [];
        var numberList = [];
        while (currCol <= 26){
          var courseRow = users.getRange(idRow, currCol).getValue();
          if (courseRow){
            var courseNumber = courses.getRange(courseRow, 1).getValue();
            var courseName = courses.getRange(courseRow, 2).getValue();
            numberList.push(courseNumber);
            courseList.push(courseName+" - "+courseNumber);
            currCol++;
          }else{
            currCol = 27;
          }
        }
        if (numberList.length > 0){
          courseList.push("Clean my list");
          numberList.push("Clean my list");
          set(id, "Course", name, 0);
          makeKeyBoard(id, courseList, numberList);
        }
        else{
          sendText(id, "There is no registered courses yet");
        }
      }
    }else if(text == "Clean my list"){
      var row = users.createTextFinder(id).findAll();
      if (row.length == 1){
        if (row[0]){
          var idRow = row[0].getRow();
          for (var currCol = 5;currCol <=15; currCol++){
            users.getRange(idRow, currCol).setValue(0);
          }
          sendText(id, "your list is clean");
        }
      }
    //set an anonymous talk
    }else if(text == WantToTalk){
      var app = SpreadsheetApp.openByUrl(helpList);
      var helpers = app.getSheetByName('helper');
      var needsHelp = app.getSheetByName('needHelp');
      var helperCol = 2;
      var row = needsHelp.createTextFinder(id).findNext();
      if (row !== null){
        row = row.getRow();
        var helperRow =  needsHelp.getRange(row, 2).getValue();
        if (helperRow){
          var helperId = helpers.getRange(helperRow, 9).getValue();
          set(id, "NeedsHelp","" ,helperRow);
          set(helperId, "Helper","" ,row);
          sendText(helperId, "patiant no. "+ row + " want's to talk to you. You are connected."
                   +"To end the convertation simply send: end or done");
          sendText(id, "You are connected with your helper.  To end the convertation simply send: 'end' or 'done'");
          return;
        }
      }//There is no helper yet
      sendText(id, "Searching for an heleper for you.. You can always change your preference for an helper and i'll try to find"+
               " the best one for you.. ");
      var helperId = findHelper(id);
      if (helperId == 0){
        //TODO - add a problem message
      }else{
        set(id, "NeedsHelp","" ,helperRow);
        set(helperId, "Helper","" ,needsHelpRow);
        sendText(helperId, "patiant no. "+ row + " want's to talk to you. You are connected");
        sendText(helperId, "You are connected with your patiant");
      }
    
    //not a command, find the mode of the user
    }else{ //find id and get data
      if (row){
        var mode = users.getRange(row, 2).getValue();
        if (!(mode)){
          sendKey(id, "How may I help you?", mainKeyBoard);
        }else if (mode == 'feedback'){
          // Fetch the email address
          var emailAddress = "technobot404@gmail.com";
          // Send Alert Email.
          var message = text;       
          var subject = 'You have a new feedback from technoBot user';
          MailApp.sendEmail(emailAddress, subject, message + 'id: '+id+' ');
          sendText(id, "Thank you for your feedback! \uD83D\uDE4F");
          set(id, 0, name, 0);
          sendKey(id, "What would you like to do next?", mainKeyBoard);
        }else if (mode == 'Ride'){
          var RidesEX = SpreadsheetApp.openByUrl(facultyRidesExel);
          var Rides = RidesEX.getActiveSheet();
          var list = Rides.createTextFinder(text).findAll();
          if (list.length > 0){
            var row = list[0].getRow();
            var name = Rides.getRange(row,1).getValue();
            var link = Rides.getRange(row,3).getValue();
            sendText(id, link + ' - ' + name);
          }
      }else if (mode == 'Add course'){
        if (!(courseNumber) || !(courseName)){
          sendText(id, "Wrong format. please inset your review in the followog format: course number-course name-group link");
          sendKey(id, "What would you like to do next?", mainKeyBoard);
        }
        else{
          courseAdd(id, courseNumber, courseName, courseLink, courses);
          set(id, 0);
          sendKey(id, "What would you like to do next?", mainKeyBoard);
        }
      }else if (mode == 'Write a review'){
        var row = users.createTextFinder(id).findAll();
        var courseRow = 0;
        if (row.length == 1){
          if (row[0]){
            var idRow = row[0].getRow();
            courseRow = users.getRange(idRow, 4).getValue();
            var courseNumber = courses.getRange(courseRow, 1).getValue();
            var courseName = courses.getRange(courseRow, 2).getValue();
          }
        }
        if (courseRow){
          var j = 7;
          while (courses.getRange(courseRow,j).getValue()){
            j++;
          }
          courses.getRange(courseRow,j).setValue(text);
          sendText(id, "Your review is added to " + courseNumber + ' ' + courseName);
          sendKey(id, "What would you like to do next?", mainKeyBoard);
          set(id, 0, name, 0);
        }
      }else if (mode == 'Add telegram group'){
        var row = users.createTextFinder(id).findAll();
        var courseRow = 0;
        if (row.length == 1){
          if (row[0]){
            var idRow = row[0].getRow();
            courseRow = users.getRange(idRow, 4).getValue();
            var courseNumber = courses.getRange(courseRow, 1).getValue();
            var courseName = courses.getRange(courseRow, 2).getValue();
            var group = courses.getRange(courseRow, 3).getValue();
            if (group){
              sendText(id, 'The group is already exist');
              sendText(id, group);
              set(id, 0, name, 0);
              sendKey(id,'What would you like to do next?',mainKeyBoard)
              return;
            }
          }
        }
        if (courseRow){
          var checkIfLink = text.split('ttps://t.me/joinchat');
          if (checkIfLink.length !== 2){
            sendText(id, 'This is not a link to telegram group. Please try again');
            sendKey(id,'What would you like to do next?',mainKeyBoard)
            set(id, 0, name, 0);
          }
          else{
            courses.getRange(courseRow, 3).setValue(text);
            sendText(id, "The group is added to " + courseNumber + ' ' + courseName);
            set(id, 0, name, 0);
            sendKey(id,'What would you like to do next?',mainKeyBoard)
          }
        }
      }else if (mode == 'Add Teams link'){
        var row = users.createTextFinder(id).findAll();
        var courseRow = 0;
        if (row.length == 1){
          if (row[0]){
            var idRow = row[0].getRow();
            courseRow = users.getRange(idRow, 4).getValue();
            var courseNumber = courses.getRange(courseRow, 1).getValue();
            var courseName = courses.getRange(courseRow, 2).getValue();
            var group = courses.getRange(courseRow, 6).getValue();
            if (group){
              sendText(id, 'The group is already exist');
              sendText(id, group);
              set(id, 0, name, 0);
              sendKey(id,'What would you like to do next?',mainKeyBoard)
              return;
            }
          }
        }
        if (courseRow){
          var checkIfLink = text.split('ttps://teams.microsoft.com');
          if (checkIfLink.length !== 2){
            sendText(id, 'This is not a link to Teams group \ud83d\udc6a. Please try again');
            sendKey(id,'What would you like to do next?',mainKeyBoard)
            set(id, 0, name, 0);
          }
          else{
            courses.getRange(courseRow, 6).setValue(text);
            sendText(id, "The group is added to " + courseNumber + ' ' + courseName);
            set(id, 0, name, 0);
            sendKey(id,'What would you like to do next?',mainKeyBoard)
          }
        }
      }else if (mode == 'Add exams exel'){
        var row = users.createTextFinder(id).findAll();
        var courseRow = 0;
        if (row.length == 1){
          if (row[0]){
            var idRow = row[0].getRow();
            courseRow = users.getRange(idRow, 4).getValue();
            var courseNumber = courses.getRange(courseRow, 1).getValue();
            var courseName = courses.getRange(courseRow, 2).getValue();
          }
        }
        if (courseRow){
          courses.getRange(courseRow, 4).setValue(text);
          sendText(id, "The exel is added to " + courseNumber + ' ' + courseName);
        }
      }else if (mode == 'faculty'){
        facultyGroupHandler(id, text);
      }else if (mode == 'Course'){
        var list = courses.createTextFinder(text).findAll();
        var len = list.length;
        if (len == 1){
          sendOpt(id, name, courses, list[0].getRow());
        }
        else if (len > 1){
          var tooLong = false;
          if (len > 50){
            tooLong = true;
            sendText(id, 'There is too many courses containing: '+text);
            sendText(id, 'Try to search full course name or course number');
          }
          if (!(tooLong)){
            sendText(id, "looking for relevant courses..");
            var courseNames = [];
            var courseNumbers = [];
            var count = 0;
            while (count < len){
              var courseRow = list[count].getRow();
              var courseName = courses.getRange(courseRow, 2).getValue();
              var courseNumber = courses.getRange(courseRow, 1).getValue();
              //if (!(courseNumbers.includes(courseNumber))){
              courseNames.push(courseName+" - "+courseNumber);
              courseNumbers.push(courseNumber)
              count++;
              //}
            }
            makeKeyBoard(id, courseNames, courseNumbers);
          }
        }
        else{ //len in 0  
          set(id, 0, name, 0);
          sendKey(id, "can't find "+text+". You can add a new course by Add course tab", mainKeyBoard);
        }
      }//else if (mode == 'inConvertation'){
      //elseId = find in helpList;
      //num = find in helpList
      //set(id, help, name, 0);
      // sendText(elseId, "you have a new massage from helpGuy number " + num);
      // sendText(elseId, text);
      //}
      }
    }
  }
}


function findHelper(id){
  var app = SpreadsheetApp.openByUrl(helpList);
  var helpers = app.getSheetByName('helper');
  var needsHelp = app.getSheetByName('needHelp');
  var row = needsHelp.createTextFinder(id).findNext();
  if (row !== null){ //the user is in the table
    var needsHelpRow = row.getRow();
    var helperRow = needsHelp.getRange(needsHelpRow, 2).getValue();
    sendText(id, helperRow);//test
    var helperId = helpers.getRange(helperRow, 9);
    sendText(id, "test1223");//test
    set(id, "NeedsHelp","" ,helperRow);
    set(helperId, "Helper","" ,needsHelpRow);
    sendText(helperId, "patiant no. "+ row + " want's to talk to you. You are connected");
    sendText(helperId, "You are connected with your patiant");
  }else{ //init user
    var nextPlace = needsHelp.getRange(1, 1).getValue();
    needsHelp.getRange(nextPlace, 1).setValue(id);
    needsHelp.getRange(1, 1).setValue(nextPlace+1);
  }//init helper - find and register
  var otherId = 0;
  var maxScore = -1;
  var otherRow = 0;
  var otherCol = 0;
  
  for (var i = 21; i <= 31; i++){//a table representing helpers by the number of students they help
    var nextFree = helpers.getRange(1,i).getValue();
    if (nextFree != 3){
      sendText(id, "looking for an helper..");
      for (var j = nextFree-1; j > 2; j--){
        var helperRow = helpers.getRange(j, i).getValue();
        sendText(id,"heper row: "+helperRow); //test
        //check if helper can help more people
        var maxHelp = helpers.getRange(helperRow,7).getValue();
        var helpCount = helpers.getRange(helperRow,8).getValue()-10;
       // sendText(id, maxHelp );
             //    sendText(id, helpCount);
        if (maxHelp > helpCount){
          var score = 0;
          //calculate score //TODO
          //sendText(id, "score: " + score + "max: "+maxScore);
          if (score > maxScore){
            //sendText(id, "updating otherId::" + otherId + "   "  + i);
            maxScore = score;
            otherRow = helperRow;
            otherCol = i;
          }
        }
        //sendText(id, "otherId : " + otherId);
      }
    }
  }
  sendText(id, "otherId ::: " + otherCol);
  if (otherCol !== 0){
    var helperRow = 
    //swap with last in line
    var nextFree = helpers.getRange(1, otherCol).getValue();
    var lastInCol = helpers.getRange(nextFree, otherCol).getValue();
    helpers.getRange(otherRow, otherCol).setValue(lastInCol);
    helpers.getRange(nextFree, otherCol).setValue(0);//optional
    helpers.getRange(1, otherCol).setValue(nextFree-1);
    
    var nextFreeNextCol = helpers.getRange(1, otherCol+1).getValue();
    helpers.getRange(nextFreeNextCol, otherCol+1).setValue(otherRow);
    helpers.getRange(1, otherCol+1).setValue(nextFreeNextCol+1);
       
    //TODO: update helper table
    otherId = helpers.getRange(otherRow, 9).getValue();
    needsHelp.getRange(nextPlace, 2).setValue(otherId)
  }
  return otherId;
}

function simpleText(id, text){
  if(text == About){
    sendText(id, "Hi! My name is Michael Toker and I am a student at the Computer Science department at the Technion");
    sendText(id, "I developed this bot as an open-source project for the use of Technion students, I hope that you find it useful!");
    sendKey(id, "You are more than welcome to contact me with any issue..", contactKeyBoard);
  }else if(text == ContactFacebook){
    sendText(id, "https://www.facebook.com/michael.toker");
  } else if(text == ContactEmail){
    sendText(id, "dontokeron@gmail.com");
  }else if(text == ContactLinkdIn){
    sendText(id, "https://www.linkedin.com/in/michael-toker-52814b153");
  }else if (text == usefulLink){
    sendKey(id,"Here are some useful links for you" ,usefulKeyBoard);   
  } else if (text == 'Copiers and printers'){
    sendText(id, 'General info - http://www.asat.org.il/academic/contents/print/צילום_והדפסה');
    sendText(id, 'in order to send a file to print start a new mail, type your ID in the SUBJECT.')
    sendText(id, 'Attach your files (Office documents, pictures and pdf files)');
    sendKey(id, 'Insert the recipient according to your desired task (click suitable tab to get email)', printKeyBoard)
  }else if (text == "A4 B&W single sided"){
    sendText(id, 'A4 B&W single sided – print.bws@campus.technion.ac.il');
  }else if (text == "A4 B&W two sided"){
    sendText(id, 'A4 B&W two sided – print.bwd@campus.technion.ac.il');
  } else if (text == "A4 Color single sided"){
    sendText(id, 'A4 Color single sided – print.color@campus.technion.ac.il');
  } else if (text == "A3 B&W single sided"){
    sendText(id, 'A3 B&W single sided – print.A3bws@campus.technion.ac.il')
  }else if (text == "A3 B&W two sided"){
    sendText(id, 'A3 B&W two sided – print.A3bwd@campus.technion.ac.il')
  } else if (text == "A3 Color single sided"){
    sendText(id, 'A3 Color single sided – print.A3color@campus.technion.ac.il')
  }else if (text == "B&W 2 slides per page, single sided"){
    sendText(id, 'B&W 2 slides per page, single sided – print.2pbws@campus.technion.ac.il')
  }else if(text == "B&W 2 slides per page, two sided"){
    sendText(id, 'B&W 2 slides per page, two sided – print.2pbwd@campus.technion.ac.il')
  }else if (text == "B&W 4 slides per page, single sided"){
    sendText(id, 'B&W 4 slides per page, single sided – print.4pbws@campus.technion.ac.il')
  }else if(text == "B&W 4 slides per page, two sided"){
    sendText(id, 'B&W 4 slides per page, two sided – print.4pbwd@campus.technion.ac.il')
  }else if (text == calendar){
    sendKey(id,"http://www.admin.technion.ac.il/dpcalendar/Student.aspx" ,usefulKeyBoard);   
  }else if (text == "אזור תל אביב-יפו והמרכז" || text == "אזור ירושליים" || text == "אזור חיפה והצפון" 
            || text == "אזור השפלה והדרום" || text == "אזור השרון" ){
    switch(text){
      case ("אזור תל אביב-יפו והמרכז"):
        sendKey(id, "Choose a city from the list below:", teKeyBoard);
        break;
      case ("אזור ירושליים"):
        sendKey(id, "Choose a city from the list below:", jeKeyBoard);
        break;
      case ("אזור חיפה והצפון"):
        sendKey(id, "Choose a city from the list below:", heKeyBoard);
        break;
      case ("אזור השפלה והדרום"):
        sendKey(id, "Choose a city from the list below:", soKeyBoard);
        break;
      case ("אזור השרון"):
        sendKey(id, "Choose a city from the list below:", shKeyBoard);
        break;
    }
  }else if (text == "טרמפים בפייסבוק"){
    sendText(id, "https://www.facebook.com/groups/301410316636087/"+" - "+"טרמפים יוצאים מהטכניון");
    sendText(id, "https://www.facebook.com/groups/135704829788347/"+ " - " + "טרמפים נכנסים לטכניון");
    sendKey(id, "מה תרצה לעשות כעת?",  ridesKeyBoard);
  }else if (text == "scans - cf"){
    sendText(id, "https://tscans.cf/");
  }else if (text == 'MyDegree'){
    sendText(id, "https://www.mydegree.co.il/");
  }else if (text == 'Technion Students FAQ (doc)'){
    sendText(id,"https://docs.google.com/document/d/1XGWWns6IZy9QpsAhWZu_WxIQTXYbRVeAV3XGr6pcMpc/edit?fbclid=IwAR1bBn5g3NBdxf2JFPbeWinOmQ3F0qa2KxlQGlMZ5wPyr31l0yRfo7ESPLc");
  }else if (text == 'useful links from facebook (doc)'){
    sendText(id,"https://docs.google.com/document/d/1tR8X8YawbK_h2VwQU1k1Fz4q12B0nWxOMSqxE_hV2sw/"+
             "edit?fbclid=IwAR1cQkxt1PG-gFwF_QWPG80u9ZNYuVwwBlWwmCes5MLst1ERmAIGijH8BRM");
  }else if (text == 'cheese&fork'){
    sendKey(id,"https://cheesefork.cf/",usefulKeyBoard);
  }else if (text == 'testock'){
    sendKey(id,"https://testock.tk/courses",usefulKeyBoard);
  }else if (text == 'ug '+ugSy) {
    sendKey(id, 'https://ug3.technion.ac.il/rishum/search',usefulKeyBoard );
  }else if (text == 'moodle '+moodleSy){
    sendKey(id, 'https://moodle.technion.ac.il/',usefulKeyBoard );
  }else if (text == "Git"){
    sendText(id, 'https://github.com/tokeron/Tbot/blob/master/Tbot');
  }else if (text == 'אסט'){
    sendKey(id,"http://www.asat.org.il/",usefulKeyBoard);
  }else if (text == 'ASA'){
    sendKey(id,"https://www.asatechnion.co.il/",usefulKeyBoard);
  }else if (text == 'ניב סקרביאנסקי'){
    sendKey(id, 'https://drive.google.com/file/d/11-zadZjM-0qDwc0qrWXHVygLN7aKkqna/view?usp=drivesdk', mainKeyBoard) ;
  }else if (text == Korona){
    sendText(id, "https://t.me/asat_technion");
  }else if (text == 'חזור'){
    sendKey(id, "What distress are you experiencing?", helpKeyBoard);
  }else if (text == help){
    sendKey(id, "What distress are you experiencing?", helpKeyBoard);
  }else if (text == UsefullLinks){
    //@TODO
  }else{
    return false;
  }
  return true;
}


function sendOpt(id, name, courses, courseRow){
  var exel = false;
  var cs = false;
  var teams = false;
  set(id, 'Course', name, courseRow);
  var courseNumber = courses.getRange(courseRow, 1).getValue();
  var courseName = courses.getRange(courseRow, 2).getValue();
  var mode = courses.getRange(courseRow, 5).getValue();
  var link = courses.getRange(courseRow, 3).getValue();
  if (mode == 1){
    sendText(id, courseName + " - "+ courseNumber );
    if (courses.getRange(courseRow, 6).getValue()) teams = true;
    if (link && teams){
      sendKey(id, "choose the required information", tgmalagKeyBoard);
    }
    else if (link){
      sendKey(id, "choose the required information", gmalagKeyBoard);
    }
    else if (teams){
      sendKey(id, "choose the required information", tmalagKeyBoard);
    }
    else sendKey(id, "choose the required information", malagKeyBoard);
    return;
  }
  else if (mode == 2){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", gsportKeyBoard);
    else sendKey(id, "choose the required information", sportKeyBoard);
    return;
  }
  if ((courseNumber.indexOf('236') !== -1) || (courseNumber.indexOf('234') !== -1)){
    cs = true;
  }
  if (courses.getRange(courseRow, 4).getValue()) exel = true;
  if (courses.getRange(courseRow, 6).getValue()) teams = true;
  if (exel && cs && teams){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", tgexelCsKeyBoard);
    else sendKey(id, "choose the required information", texelCsKeyBoard);
  }
  else if (exel && cs){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", gexelCsKeyBoard);
    else sendKey(id, "choose the required information", exelCsKeyBoard);
  }
  else if (cs && teams){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", tgcsKeyBoard);
    else sendKey(id, "choose the required information", tcsKeyBoard)
      }
  else if (exel && teams){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", tgexelKeyBoard);
    else sendKey(id, "choose the required information", texelKeyBoard)
      }
  else if (teams){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", tgallKeyBoard);
    else sendKey(id, "choose the required information", tallKeyBoard);
  }
  else if (cs){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", gcsKeyBoard);
    else sendKey(id, "choose the required information", csKeyBoard)
      }
  else if (exel){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", gexelKeyBoard);
    else sendKey(id, "choose the required information", exelKeyBoard)
      }
  else{
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", gallKeyBoard);
    else sendKey(id, "choose the required information", allKeyBoard)
  }
}


function getDone(id, name, command, users, courses){
  var row = users.createTextFinder(id).findAll();
  var courseRow = 0;
  if (row.length == 1){
    if (row[0]){
      var idRow = row[0].getRow();
      courseRow = users.getRange(idRow, 4).getValue();
    }
  }
  if (courseRow){
    var courseNumber = courses.getRange(courseRow, 1).getValue();
    var courseName = courses.getRange(courseRow, 2).getValue();
    var group = courses.getRange(courseRow, 3).getValue();
    var exel = courses.getRange(courseRow, 4).getValue();
    var teams = courses.getRange(courseRow, 6).getValue();
    var csCourse = false;
    if ((courseNumber.indexOf('236') !== -1) || (courseNumber.indexOf('234') !== -1)){
      csCourse = true;
    }
    switch(command){
      case drive:
        sendText(id, "Looking for a link to the drive "+ driveSy);
        driveHandler(id, courseNumber, courseName);
        var currentCounter = users.getRange(2, 9).getValue();
        users.getRange(2, 9).setValue(++currentCounter);
        break;
      case courseGroup:
        sendText(id, "Looking for telegram group" + groupSy);
        if (group) sendText(id, group);
        else sendText(id, "There is no telegram group for this course yet. you can open and add a groupby using 'Add group'");
        var currentCounter = users.getRange(2, 8).getValue();
        users.getRange(2, 8).setValue(++currentCounter);
        break;
      case "Teams group \ud83d\udc6a":
        sendText(id, "Looking for Teams group \ud83d\udc6a" + groupSy);
        if (teams) sendText(id, teams);
        else sendText(id, "There is no Teams group \ud83d\udc6a for this course yet. you can open and add a groupby using 'Add group'")
        var currentCounter = users.getRange(2, 8).getValue();
        users.getRange(2, 8).setValue(++currentCounter);
        break;
      case testock:
        sendText(id, "Looking for a link to the test scans " + scansSy);
        scansHandler(id, courseNumber);
        var currentCounter = users.getRange(2, 11).getValue();
        users.getRange(2, 11).setValue(++currentCounter);
        break;
      case 'All tests - exel':
        sendText(id, "Looking for a link to the tests exel " + groupSy);
        sendText(id, exel);
        var currentCounter = users.getRange(2, 11).getValue();
        users.getRange(2, 11).setValue(++currentCounter);
        break;
      case reviews:
        reviewsHandler(id, courseRow, courses, 0);
        var currentCounter = users.getRange(2, 10).getValue();
        users.getRange(2, 10).setValue(++currentCounter);
        break;
      case facebook:
        facebookHandler(id, courseNumber, courseName);
        var currentCounter = users.getRange(2, 7).getValue();
        users.getRange(2, 7).setValue(++currentCounter);
        break;
      case youTube:
        youtubeHandler(id, courseNumber, courseName)
        var currentCounter = users.getRange(2, 7).getValue();
        users.getRange(2, 7).setValue(++currentCounter);
        break;
      case ug:
        sendText(id, "Looking for ug link " + ugSy);
        sendText(id, "https://ug3.technion.ac.il/rishum/course/"+courseNumber);
        var currentCounter = users.getRange(2, 6).getValue();
        users.getRange(2, 6).setValue(++currentCounter);
        break;
      case cs:
        sendText(id, "Looking for computer science link " + csSy);
        sendText(id, "https://webcourse.cs.technion.ac.il/"+courseNumber);
        var currentCounter = users.getRange(2, 6).getValue();
        users.getRange(2, 6).setValue(++currentCounter);
        break;
      case moodle:
        sendText(id, "Looking for moodle link " + moodleSy);
        sendText(id, "https://moodle.technion.ac.il/course/search.php?search="+courseNumber);
        var currentCounter = users.getRange(2, 6).getValue();
        users.getRange(2, 6).setValue(++currentCounter);
        break;
      case  "Course info":
        sendText(id, "Looking for info link ");
        sendText(id, "https://asatechnion.co.il/courses/syllabus"+courses.getRange(courseRow, 4).getValue()+".pdf");
        break;
      case "Panopto":
        panoptoHandler(id, courseNumber);
        break;
      case 'Get all':
        if (group){
          sendText(id, "Looking for a link to the telegram group " + groupSy);
          sendText(id, group);
        }
        if (teams){
          sendText(id, "Looking for Teams group \ud83d\udc6a" + groupSy);
          if (teams) sendText(id, teams);
        }
        sendText(id, "Looking for a link to the test scans " + scansSy);
        scansHandler(id, courseNumber);
        if (exel) sendText(id, exel);
        reviewsHandler(id, courseRow, courses, 1);
        facebookHandler(id, courseNumber, courseName);
        youtubeHandler(id, courseNumber, courseName);
        sendText(id, "Looking for ug link " + ugSy);
        sendText(id, "https://ug3.technion.ac.il/rishum/course/"+courseNumber);
        if (csCourse){
          sendText(id, "Looking for computer science link " + csSy);
          sendText(id, "https://webcourse.cs.technion.ac.il/"+courseNumber);
        }
        sendText(id, "Looking for moodle link " + moodleSy);
        sendText(id, "https://moodle.technion.ac.il/course/search.php?search="+courseNumber);
        driveHandler(id, courseNumber, courseName);
        set(id, 0, name, 0)
        sendKey(id, "What would you like to do next?", mainKeyBoard);
        break;
    }
  }
}

//simple handlers - adds the course number to the url to return link to a query with the course number in the site
function panoptoHandler(id, courseNumber){
  sendText(id, "Looking for Panopto link " + YouTubeSy);
  sendText(id, "https://panoptotech.cloud.panopto.eu/Panopto/Pages/Sessions/List.aspx#query=%22"+courseNumber+"%22");
}


function youtubeHandler(id, courseNumber, courseName){
  sendText(id, "Looking for YouTube link " + YouTubeSy);
  var splited = courseName.split(' ');
  var combined = "+";
  for(var i = 0; splited[i]; i++){
    combined += splited[i];
    combined += '+';
  }
  sendText(id, "https://www.youtube.com/results?search_query=+"+combined+courseNumber);
}

function facebookHandler(id, courseNumber, courseName){
  sendText(id, "Looking for facebook link" + facebookSy);
  var nameCheck = courseName.split('(');
  if (nameCheck.length > 1){
    courseName = nameCheck[0];
  }
  var nameList = courseName.split(' ');
  var len = nameList.length;
  if (len > 1){
    var tempName = "";
    for(var count = 0; count < len; count++){
      tempName=tempName+"%20";
      tempName=tempName+nameList[count];
      courseName = tempName;
    }
  }
  else courseName = "%20"+courseName
  sendText(id, "https://www.facebook.com/search/top/?q="+courseNumber+courseName+"&epa=SEARCH_BOX"); 
}

function scansHandler(id, number){
  sendText(id, "https://testock.tk/course/"+number);
  return;
}

//handler using sheets
function facultyGroupHandler(id, data){
  var facultyEX = SpreadsheetApp.openByUrl(facultyRidesExel);
  var faculties = facultyEX.getActiveSheet();
  var row = faculties.createTextFinder(data).findNext();
  var i = row.getRow();
  var groupName = faculties.getRange(i,3).getValue();
  var currLink = faculties.getRange(i,2).getValue();
  sendText(id, currLink + ' - ' + groupName);
  if (groupName == 'סטודנטים בטכניון') sendText(id, 'https://teams.microsoft.com/l/team/19%3afde92135b254443db1e887147bbfdc09%40thread.skype/conversations?groupId=484ee060-222c-465a-9d1b-65803822e19f&tenantId=f1502c4c-ee2e-411c-9715-c855f6753b84 - Teams group')
}

//handler using drive
function driveHandler(id, courseNumber, courseName){
  var found = 0;
  var dApp = DriveApp;
  sendText(id, "Searching in CS..");
  var folderItr = dApp.getFoldersByName("Technion CS");
  var folder = folderItr.next();
  var subFolderItr = folder.getFolders();
  while (subFolderItr.hasNext()){
    var subFolder = subFolderItr.next();
    var currFolderName = subFolder.getName();
    if (currFolderName.indexOf(courseNumber) !== -1){
      found = true;
      sendText(id, currFolderName);
      sendText(id, subFolder.getUrl());
      return;
    }
  }
  var scienceItr = folder.getFoldersByName("קורסים מדעיים");
  var science = scienceItr.next();
  var subFolderItr = science.getFolders()
  while (subFolderItr.hasNext()){
    var s = subFolderItr.next();
    var currFolderName = s.getName();
    if (currFolderName.indexOf(courseNumber) !== -1){
      found = true;
      sendText(id, currFolderName);
      sendText(id, s.getUrl());
      return;
    }
  }
  var folderItr = dApp.getFoldersByName("Technion CS");
  var folder = folderItr.next();
  var humanItr = folder.getFoldersByName("קורסים הומניים");
  var human = humanItr.next();
  var subFolderItr = human.getFolders()
  while (subFolderItr.hasNext()){
    var h = subFolderItr.next();
    var currFolderName = h.getName();
    if (currFolderName.indexOf(courseNumber) !== -1){
      found = true;
      sendText(id, currFolderName);
      sendText(id, h.getUrl());
      return;
    }
  }
  sendText(id, "Searching in Industrial Engineering and Management..");
  var folderItr = dApp.getFoldersByName("Technion Drive - Public");
  var folder = folderItr.next();
  var subFolderItr = folder.getFolders();
  while (subFolderItr.hasNext()){
    var subFolder = subFolderItr.next();
    var currFolderName = subFolder.getName();
    if (currFolderName.indexOf(courseName) !== -1){
      found = true;
      sendText(id, currFolderName);
      sendText(id, subFolder.getUrl());
      return;
    }
  }
  sendText(id, "Searching in Electrical Engineering..");
  var folderItr = dApp.getFoldersByName("הנדסת חשמל טכניון");
  var folder = folderItr.next();
  var subFolderItr = folder.getFolders();
  while (subFolderItr.hasNext()){
    var subFolder = subFolderItr.next();
    var currFolderName = subFolder.getName();
    if (currFolderName.indexOf(courseNumber) !== -1){
      sendText(id, currFolderName);
      sendText(id, subFolder.getUrl());
      return;
    }
  }
  sendText(id, "Searching in Mechanical engineering..");
  var folderItr = dApp.getFoldersByName("הנדסת מכונות - דרייב פקולטי");
  var folder = folderItr.next();
  var semestersItr = folder.getFolders();
  while (semestersItr.hasNext()){
    var semesters = semestersItr.next();
    var subFolderItr = semesters.getFolders();
    while (subFolderItr.hasNext()){
      var subFolder = subFolderItr.next();
      var currFolderName = subFolder.getName();
      if (currFolderName.indexOf(courseNumber) !== -1){
        found = true;
        sendText(id, currFolderName);
        sendText(id, subFolder.getUrl());
        return;
      }
    }
  }
  sendText(id, "Searching in Civil engineering..");
  var folderItr = dApp.getFoldersByName("אזרחית 2014");
  var folder = folderItr.next();
  var semestersItr = folder.getFolders();
  while (semestersItr.hasNext()){
    var semesters = semestersItr.next();
    var subFolderItr = semesters.getFolders();
    while (subFolderItr.hasNext()){
      var subFolder = subFolderItr.next();
      var currFolderName = subFolder.getName();
      if (currFolderName.indexOf(courseName) !== -1){
        found = true;
        sendText(id, currFolderName);
        sendText(id, subFolder.getUrl());
        return;
      }
    }
  }
  sendText(id, "Searching in Physics..");
  var folderItr = dApp.getFoldersByName("PhysicsDrive");
  var folder = folderItr.next();
  var subFolderItr = folder.getFolders();
  while (subFolderItr.hasNext()){
    var subFolder = subFolderItr.next();
    var currFolderName = subFolder.getName();
    if (currFolderName.indexOf(courseNumber) !== -1){
      found = true;
      sendText(id, currFolderName);
      sendText(id, subFolder.getUrl());
      return;
    }
  }
  sendText(id, "Searching in Aerospace Engineering..");
  var folderItr = dApp.getFoldersByName("טכניון");
  var folder = folderItr.next();
  var semestersItr = folder.getFolders();
  while (semestersItr.hasNext()){
    var semesters = semestersItr.next();
    var subFolderItr = semesters.getFolders();
    while (subFolderItr.hasNext()){
      var subFolder = subFolderItr.next();
      var currFolderName = subFolder.getName();
      if (currFolderName.indexOf(courseName) !== -1){
        found = true;
        sendText(id, currFolderName);
        sendText(id, subFolder.getUrl());
        return;
      }
      else if(currFolderName.indexOf(courseNumber) !== -1){
        found = true;
        sendText(id, currFolderName);
        sendText(id, subFolder.getUrl());
        return;
      }
    }
  }
  if (!(found)){
    sendText(id, "sorry \u2639, can't find the drive for this course...");
    return;
  }
  else{
    sendText(id, 'Done');
  }
}

//adds a course to the list. Can be deleted after automation
function courseAdd(id ,courseNumber, courseName, link, courses){
  if (courseNumber == "" || courseNumber == 0){
    sendText(id, "Wrong course number", mainKeyBoard);
    return;
  }
  var list = courses.createTextFinder(courseNumber).findAll();
  if (list.length >= 1){
    sendKey(id, "The course is already registered", mainKeyBoard);
  }
  else{
    var i = courses.getRange(numberOfCourses, numberOfReviews).getValue();
    if (i == numberOfCourses){
      sendKey(id, 'The list is full', mainKeyBoard);
      return;
    }
    courses.getRange(i, 1).setValue(courseNumber);
    courses.getRange(i, 2).setValue(courseName);
    if (link) courses.getRange(i, 3).setValue(link);
    sendText(id, courseNumber+ ' - ' +courseName + " course is added, thank you for the information \uD83D\uDE4F");
    courses.getRange(numberOfCourses, numberOfReviews).setValue(++i);
  }
}
  
//not so usefull feature, probably goes down
function reviewsHandler(id, i, courses, isAll){
  sendText(id, "Looking for reviews " + reviewsSy);
  var j = 7;
  while (courses.getRange(i,j).getValue()){
    sendText(id, courses.getRange(i,j).getValue());
    j++;
  }
  if (j==6){
    if (!(isAll)) sendText(id, "sorry \u2639 there is no reviews for this course yet");
    return;
  }
}

//important function set(id, data, name, num)
//Description: the function changes the cell in the sheets according to the data and num variables. 
//That way the bot can "remmeber" the previous commands in order to complete the commands.
//input: user id, data(string) that determines the state of the student in the sheets,
//name of the user and num that most of the time is the number of the course
function set(id, data, name, num){
  var app = SpreadsheetApp.openByUrl(userExel);
  var ss = app.getActiveSheet();
  var rows = ss.createTextFinder(id).findAll();
  if (rows.length !== 0){
    var row = rows[0].getRow();
    ss.getRange(row, 2).setValue(data);
    if (name) ss.getRange(row, 3).setValue(name);
    if (num) ss.getRange(row, 4).setValue(num);
    return;
  }
  else{
    var next = ss.getRange(2, 4).getValue();
    if (next == numberOfCourses){
      // Fetch the email address
      var emailAddress = "technobot404@gmail.com";
      // Send Alert Email.
      var message = "The 'mode' list is full!!"; 
      var subject = 'You have a problem in TBot';
      MailApp.sendEmail(emailAddress, subject, message);
      sendText(id, 'There is a temporary error');
    }
    ss.getRange(next, 1).setValue(id);
    ss.getRange(next, 2).setValue(data);
    if (name) ss.getRange(next, 3).setValue(name);
    if (num) ss.getRange(next, 4).setValue(num);
    ss.getRange(2, 4).setValue(++next);
    return;
  }
}

//function that makes an internal keyboard from the numbers in the spreadsheet. 
function makeKeyBoard(id, names, numbers){
  var num = names.length;
  var newKeyBoard = [];
  for (var i = 0; i < num; i++) {
    newKeyBoard.push([{"text": names[i], 'callback_data': numbers[i]}]);
  }
  newKeyBoard.push([{"text": 'Another course', 'callback_data': 'Another course'}]);
  newKeyBoard.push([{"text": 'Main menu', 'callback_data': 'Main menu'}]);
  sendText(id, "Please select the required course from the following list", newKeyBoard);
}
  
//keyBoards
var mainKeyBoard = [
  [{text: course }, { text: "My courses \ud83d\udccc" }],
  [{ text: ride}, { text: usefulLink}, { text: faculty }],
  [{ text: feedback}, { text: add }],
  [{ text: Korona }, { text: help }],
  [{ text: About}]
]

var rideKeyBoard = [
  [{ text: "אזור ירושליים" }, { text: "אזור תל אביב-יפו והמרכז" }, { text: "אזור חיפה והצפון" }],
  [{ text: "אזור השפלה והדרום" }, { text: "אזור השרון" }, { text: "טרמפים בפייסבוק" }],
  [{ text: "תפריט ראשי" }]
]
var jeKeyBoard = [
  [{ text: "מעלה אדומים" }, { text: "ביתר עילית" }],
  [{ text: "ירושלים" }, { text: "בית שמש" }],
  [{ text: "רשימת אזורים" }],
  [{ text: "תפריט ראשי" }]
]
var teKeyBoard = [
  [{ text: "חולון" }, { text: "תל אביב-יפו" }, { text: "קרית אונו" }],
  [{ text: "אור יהודה" }, { text: "יהוד-מונוסון" }, { text: "רמת השרון" }],
  [{ text: "בת ים" }, { text: "גבעתיים" }, { text: "בני ברק" }],
  [{ text: "רמת גן" }, { text: "פתח תקוה" }, { text: "אלעד" }],
  [{ text: "אריאל" }, { text: "ראש העין" }, { text: "ראשון לציון" }],
  [{ text:"רשימת אזורים"}],
  [{ text: "תפריט ראשי" }]
]
var heKeyBoard = [
  [{ text: "טבריה" }, { text: "קרית שמונה" }, { text: "צפת" }],
  [{ text: "מגדל העמק" }, { text: "עפולה" }, { text: "נשר" }],
  [{ text: "חיפה" }, { text: "טירת כרמל" }, { text: "אור עקיבא" }],
  [{ text: "קרית אתא" }, { text: "קרית מוצקין" }, { text: "קרית ביאליק" }],
  [{ text: "קרית ים" }, { text: "כרמיאל" }, { text: "מעלות-תרשיחא" }],
  [{ text: "יקנעם" }, { text: "נהריה" }, { text: "עכו" }],
  [{ text: "חדרה" }, { text: "נצרת" }, { text: "בית שאן" }],
  [{ text:"רשימת אזורים"}],
  [{ text: "תפריט ראשי" }]
]
var soKeyBoard = [
  [{ text: "ערד"  }, { text: "דימונה" }, { text: "באר שבע" }],
  [{ text: "רהט" }, { text: "רמלה" }, { text: "מודיעין-מכבים-רעות" }],
  [{ text: "יבנה" }, { text: "רחובות" }, { text: "נס ציונה" }],
  [{ text: "לוד" }, { text: "קרית מלאכי" }, { text: "קרית גת" }],
  [{ text: "אשדוד" }, { text: "אשקלון" }, { text: "שדרות" }],
  [{ text: "אילת" }, { text: "נתיבות" }],
  [{ text:"רשימת אזורים"}],
  [{ text: "תפריט ראשי" }]
]
var shKeyBoard = [
  [{ text: "רעננה"  }, { text: "הוד השרון" }, { text: "הרצליה" }],
  [{ text: "כפר סבא" }, { text: "נתניה" }, { text: "טירה" }],
  [{ text:"רשימת אזורים"}],
  [{ text: "תפריט ראשי" }]
]
var usefulKeyBoard = [
  [{ text: "Technion Students FAQ (doc)" }, { text: "useful links from facebook (doc)" }],
  [{ text: "cheese&fork" }, { text: "scans - cf"}, { text: "testock" }],
  [{ text: "moodle "+moodleSy }, {text: "ug "+ugSy }, { text: calendar}],
  [{ text: "ASA" }, { text: "אסט" }, { text: "Copiers and printers" }], 
  [{text: "MyDegree"}],
  [{ text: mainM }]
]
var printKeyBoard = [
  [{ text: "A4 B&W single sided" }, { text: "A4 B&W two sided" }],
  [{ text: "A4 Color single sided" }], 
  [{ text: "A3 B&W single sided" }, { text: "A3 B&W two sided" }],
  [{ text: "A3 Color single sided" }], 
  [{ text: "B&W 2 slides per page, single sided" }, { text: "B&W 2 slides per page, two sided" }],
  [{ text: "B&W 4 slides per page, single sided" }, { text: "B&W 4 slides per page, two sided" }],   
  [{ text: mainM }]
  ]

/*
var coursesKeyBoardEn = [
  [{ text: "Computer Science" }, { text: 'Electrical Engineering' }, { text: 'Mechanical Engineering' }],
  [{ text: 'Civil and Environmental Engineering' }, { text: 'Industrial Engineering and Management' }, { text: 'Biomedical Engineering' }],
  [{ text: 'Chemical Engineering' }, { text: 'Biotechnology and Food Engineering' }, { text: 'Materials Science & Engineering' }],
  [{ text: 'Mathematics faculty' }, { text: 'Chemistry faculty' }, { text: 'Physics faculty' }, { text: 'Biology faculty' }],
  [{ text: 'Medicine faculty' }, { text: 'Architecture and Town Planning' }, { text: 'Education in Science and Technology' }],
  [{ text: "עברית" }],
  [{ text: "Main menu" }]
]
*/

var coursesKeyBoard = [
  [{text: "סטודנטים בטכניון" }],
  [{ text: "מדעי המחשב" }, { text: 'הנדסת חשמל' }, { text: 'הנדסת מכונות' }],
  [{ text: 'הנדסה אזרחית וסביבתית' }, { text: 'הנדסת תעשייה וניהול' }, { text: 'הנדסה ביו-רפואית' }],
  [{ text: 'הנדסה כימית' },{ text: 'הנדסת ביוטכנולוגיה ומזון' }, { text: 'מדע והנדסה של חומרים' }],
  [{ text: 'הפקולטה למתמטיקה' }, { text: 'הפקולטה לכימיה' }, { text: 'הפקולטה לפיסיקה' }],
  [{text: 'הפקולטה לביולוגיה'}, { text: 'רפואה' }, { text: 'ארכיטקטורה ובינוי ערים' }], 
  [{ text: 'חינוך למדע וטכנולוגיה' }, {text: 'הפקולטה להנדסת אוירונוטיקה וחלל'}],
  [{ text: "תפריט ראשי" }]
]

var ridesBackKeyBoard = [
  [{ text: "רשימת אזורים" }],
  [{ text: "תפריט ראשי" }]
]

var allKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: testock }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var gallKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: courseGroup }, { text: testock }],
  [{ text: facebook }, { text: youTube }, { text: 'Panopto' }, { text: reviews }],
  [{ text: "Write a review" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var tgallKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: courseGroup }, { text: 'Teams group \ud83d\udc6a'}, { text: testock }],
  [{ text: facebook }, { text: youTube },  { text: 'Panopto' }, { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: mainM }, { text: "Another course" }]
]


var tallKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: 'Teams group \ud83d\udc6a'}, { text: testock }],
  [{ text: facebook }, { text: youTube },{ text: 'Panopto' },   { text: reviews }],
  [{ text: "Write a review" },  { text: "Add telegram group" }],
  [{ text: mainM }, { text: "Another course" }]
]

var csKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: testock }],
  [{ text: facebook }, { text: youTube },{ text: 'Panopto' },   { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var tcsKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: 'Teams group \ud83d\udc6a'}, { text: testock }],
  [{ text: facebook }, { text: youTube },{ text: 'Panopto' },   { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: mainM }, { text: "Another course" }]
]

var gcsKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: courseGroup }, { text: testock }],
  [{ text: facebook }, { text: youTube }, { text: 'Panopto' },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var tgcsKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: courseGroup }, { text: 'Teams group \ud83d\udc6a'}, { text: testock }],
  [{ text: facebook }, { text: youTube },{ text: 'Panopto' },   { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: mainM }, { text: "Another course" }]
]

var exelKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube },{ text: 'Panopto' },   { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var texelKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: 'Teams group \ud83d\udc6a'}],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube }, { text: 'Panopto' },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: mainM }, { text: "Another course" }]
]

var gexelKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: courseGroup }],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube }, { text: 'Panopto' },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var tgexelKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: courseGroup }, { text: 'Teams group \ud83d\udc6a'}],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube }, { text: 'Panopto' },  { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: mainM }, { text: "Another course" }]
]

var exelCsKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube }, { text: 'Panopto' },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var texelCsKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }], 
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: 'Teams group \ud83d\udc6a'}],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube }, { text: 'Panopto' },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: mainM }, { text: "Another course" }]
]

var gexelCsKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: courseGroup }],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube }, { text: 'Panopto' },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var tgexelCsKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: courseGroup }, { text: 'Teams group \ud83d\udc6a'}],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube },{ text: 'Panopto' },   { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: mainM }, { text: "Another course" }]
]

var malagKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: ug }, { text: moodle }],
  [{ text: facebook }, { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var gmalagKeyBoard = [
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: ug }, { text: moodle }],
  [ { text: courseGroup }, { text: facebook }, { text: reviews }],
  [{ text: "Write a review" }, { text: "Add Teams link"}],
  [{ text: mainM }, { text: "Another course" }]
]

var tmalagKeyBoard = [
  [{ text: ug }, { text: moodle }],
  [ { text: courseGroup }, { text: 'Teams group \ud83d\udc6a'}, { text: facebook }, { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: mainM }, { text: "Another course" }]
]

var tgmalagKeyBoard = [
  [{ text: ug }, { text: moodle }],
  [ { text: courseGroup }, { text: 'Teams group \ud83d\udc6a'}, { text: facebook }, { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: mainM }, { text: "Another course" }]
]

var sportKeyBoard = [
  [{ text: reviews }],
  [{ text: "Course info"}],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: mainM }, { text: "Another course" }]
]

var gsportKeyBoard = [
  [{ text: courseGroup }, { text: reviews }],
  [{ text: "Course info"}],
  [{ text: "Write a review" }],
  [{ text: "Add to my course list \ud83d\udccd" }, { text: "My courses \ud83d\udccc"}],
  [{ text: mainM }, { text: "Another course" }]
]
  

var contactKeyBoard = [
  [{ text: "Git"}],
  [{ text: ContactLinkdIn},  { text: ContactEmail } ],
  [{ text: mainM }]
]


var helpKeyBoard = [
  [{ text: Domestic}, { text: Distress}],
  [{ text: Security}],
  [{ text: wantToHelp}], 
  [{ text: mainM }]
]

var DomesticKeyBoard = [
  [{ text: UsefullLinks}],
  [{ text: QuickCalls}],
  [{ text: WantToTalk}],
  [{ text: BackFromDomestic}],
  [{ text: mainM }]
]

var SecurityKeyBoard = [
  [{ text: UsefullLinks}],
  [{ text: QuickCalls}],
  [{ text: BackFromSecurity}],
  [{ text: mainM }]
]

var DistressKeyBoard = [
  [{ text: UsefullLinks}],
  [{ text: QuickCalls}],
  [{ text: WantToTalk}],
  [{ text: BackFromDistress}],
  [{ text: mainM }]
]

var HelperPrefrencesKeyBoard = [
  [{ text: Male}],
  [{ text: Female}],
  [{ text: GeneralHelper}],
  [{ text: BackFromGenderHelper}],
  [{ text: mainM }]
]

//old features
/*
    else if (text == 'addEx'){
      var tempEX = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1SrY52SSHMgrZ-_hjM07dS8mJwtKvrEdEYQNdpMQiKYg/edit?usp=sharing");
      var temp = tempEX.getActiveSheet();
      var i = 3401;
      var courseNumber = temp.getRange(i, 4).getValue();
      sendText(id, courseNumber);
      while (i <= 4156){
        courseNumber = temp.getRange(i, 4).getValue();
        i++;
        var courseName = temp.getRange(i, 4).getValue();
        i+=3;
        courseAdd(id, courseNumber, courseName, 0, courses);
      }
      }
    else if (text == 'sortM'){
      var tempEX = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1SrY52SSHMgrZ-_hjM07dS8mJwtKvrEdEYQNdpMQiKYg/edit?usp=sharing");
      var temp = tempEX.getActiveSheet();
      var i = 4163;
      var courseNumber = temp.getRange(i, 4).getValue();
      while (i <= 4205){
        var list = courses.createTextFinder(courseNumber).findAll();
        if (list.length < 1){
          sendText(id, courseNumber);
        }
        else{
          var row = list[0].getRow();
          if (courses.getRange(row, 5).getValue() !== 1){
            sendText(id, courseNumber);
            courses.getRange(row, 5).setValue(1);
          }
        }
      }
    }*/
