// This is a bot that was developed for the use of Technion students.
// The bot was developed by Michael Toker for the purpose to help students and has no profit.
// The bot is running on the google script platform and using google sheets to store the information to operate.
// The bot can handle multiple requests, analyze commands, and execute them.
// The bot is in constant testing and improvement. 


//Macros
const TESTMODE = false;

//Global variables
const token = "";
const url = "https://api.telegram.org/bot" + token;
const webAppUrl = "";
const numberOfCourses = 1400;

//Exel
const helpList = "";
const userExel = "";
const courseExel = "";
const facultyRidesExel = "";
const businessExel = "";


//Symbols
const groupSy = "\ud83d\udc6b";
const driveSy = "\ud83d\udcc1";
const csSy = "\ud83d\udcbb";
const ugSy = "\ud83d\udcca";
const moodleSy = "\ud83d\udccb";
const reviewsSy = "\ud83d\udcad";
const facebookSy = "\ud83d\udc65";
const scansSy = "\ud83d\udcda";
const attentionSy = "\ud83d\udc49";
const downSy = "\ud83d\udc47";
const YouTubeSy = "\ud83d\udcfa";
const mainSy = "\ud83c\udfe0";
const Corona = "אסט - עדכונים";
const help = "Talk To Me" + " \ud83d\udd34";
const About = "About " + "\ud83c\udf0e";
const WantToHelp = "I want to help";

const ride = "Ride Groups \ud83d\ude97";
const faculty = "Department Groups \ud83c\udfeb";
const add = "Add course to the bot \ud83d\udcd7";
const course = "Courses \ud83d\udcda";
const usefulLink = "Useful Links \ud83d\udd25";
const feedback = "feedback \ud83d\udcdd";
const calendar = "Calendar \ud83d\udcc5";

const drive = "Drive " + driveSy;
const courseGroup = "Telegram group " + groupSy;
const testock = "Scans - testock " + scansSy;
const facebook = "Facebook " + facebookSy;
const youTube = "YouTube " + YouTubeSy;
const reviews = "Reviews " + reviewsSy;
const mainMenu = "Main Menu " + mainSy;
const ug = "Ug " + ugSy;
const moodle = "Moodle " + moodleSy;
const cs = "CS " + csSy;

const ContactFacebook = "facebook";
const ContactEmail = "email";
const ContactLinkedIn = "linkedin";

const WantToTalk = "Anonymous talk with a student";
const SFS = "Students Business " + "\ud83d\udcb8";


//functions that handles the fetching of the commands from the users
function getMe() {
  const response = UrlFetchApp.fetch(url + "/getMe");
  Logger.log(response.getContentText());
}

function getUpdates() {
  const response = UrlFetchApp.fetch(url + "/getUpdates");
  Logger.log(response.getContentText());
}

//sendText(chatId, text, keyBoard)
//Description: sends text to chatId with external keyboard (optional).
//input: chat id, string and the name of the external keyboard (optional).
function sendText(chatId, text, keyBoard) {
  const data = {
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
//Description: sends text to chatId with internal keyboard(optional).
//input: chat id, string and the name of the internal keyboard(optional).
function sendKey(chatId, text, keyBoard) {
  const data = {
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
  const data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      reply_markup: JSON.stringify({
        remove_keyboard: true
      })
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function setWebhook() {
  const response = UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
}

let openedSS = {};

function getBusinessExcel() {
  //Get data, if not cached yet
  if (!openedSS.busi) {
    const app = SpreadsheetApp.openByUrl(businessExel);
    openedSS.busi = {
      busi: app.getSheetByName('info'),
      maxCol: busi.getRange(2, 2).getValue(),
      maxRow: busi.getRange(3, 2).getValue(),
      topicBase: busi.getRange(4, 2).getValue(),
      sectionBase: busi.getRange(5, 2).getValue(),
      sectionsNum: busi.getRange(6, 2).getValue(),
      topicNum: busi.getRange(7, 2).getValue(),
    };
  }
  return openedSS.busi;
}

function getHelperListExcel() {
  //Get data, if not cached yet
  if (!openedSS.helperList) {
    const app = SpreadsheetApp.openByUrl(helpList);
    openedSS.helperList = {
      helpers: app.getSheetByName('helper'),
      needsHelp: app.getSheetByName('needHelp'),
    };
  }
  return openedSS.helperList;
}

function getFacultyRidesExcel() {
  //Get data, if not cached yet
  if (!openedSS.facultyRides) {
    const app = SpreadsheetApp.openByUrl(facultyRidesExel);
    openedSS.facultyRides = {
      Rides: app.getActiveSheet(),
    };
  }
  return openedSS.facultyRides;
}

function makeKeyboard_CourseList({id,sectionBase, sectionsNum}){
  let courseList = [];
  let numberList = [];
  for (let i = sectionBase + 1; i < sectionBase * sectionsNum; i += sectionBase) {
    let currTopic = busi.getRange(1, i).getValue();
    //sendText(id, "test: currTopic: "+currTopic);
    numberList.push(currTopic);
    courseList.push(currTopic);
  }
  courseList.push("Add a Topic \ud83c\udfea");
  numberList.push("Add a Topic \ud83c\udfea");
  makeKeyBoard(id, courseList, numberList);
}

//doPost(e)
//Description: main function. Execution of the requests.
//input: JSON. It may contain callback_query - input from external keyboard,
//or message - input from text sent from the user or internal keyboard.
function doPost(e) {
  const userEx = SpreadsheetApp.openByUrl(userExel);
  const users = userEx.getActiveSheet();
  const coursesEX = SpreadsheetApp.openByUrl(courseExel);
  const courses = coursesEX.getActiveSheet();
  const contents = JSON.parse(e.postData.contents);

  //internal keyboard command
  if (contents.callback_query) {

    const id = contents.callback_query.from.id;
    const data = contents.callback_query.data;
    const name = contents.callback_query.from.first_name;

    if (data == 'Search For Another Course') {
      removeKey(id, "Please insert the course number or course name (can be partial name)"
        + "in order to search for a course. To add it to your list simply choose 'Add to my list'");
      set(id, "Course", name, 0);
      return;
    } else if (data == mainMenu) {
      sendKey(id, "How may I help you?", mainKeyBoard);
      set(id, 0, name, 0);
      return;
    } else if (data == "Clean My List") {
      const cellFinder = users.createTextFinder(id);
      let cell = cellFinder.findNext();
      while (cell !== null && cell.getColumn() !== 1) {
        cell = cellFinder.findNext();
      }
      if (cell) {
        let idRow = cell.getRow();
        for (let currCol = 5; currCol <= 15; currCol++) {
          users.getRange(idRow, currCol).setValue(0);
        }
        sendText(id, "Your list is clean");
      }
      return;

    } else if (data == "Delete A Course From My List") {
      set(id, data, name, 0);
      sendText(id, "Please tap on a course in order to delete it from your list");
      return;
    }
    //get mode
    let cellFinder = users.createTextFinder(id);
    let cell = cellFinder.findNext();
    while (cell !== null && cell.getColumn() !== 1) cell = cellFinder.findNext();
    let mode = 0;
    let otherMode = 0;
    if (cell) {
      let row = cell.getRow();
      mode = users.getRange(row, 2).getValue();
      otherMode = users.getRange(row, 4).getValue();
    } else {
      sendKey(id, "How may I help you?", mainKeyBoard);
    }
    //course have been chosen
    if (mode == "Delete A Course From My List") {//course to delete
      let courseCol = 0;
      let index = 5;
      let currCourseRow = users.getRange(row, index).getValue();
      let currCourse;

      while (currCourseRow) {//while there is courses in the list
        currCourse = courses.getRange(currCourseRow, 1).getValue();
        if (currCourse == data) courseCol = index;//the course to delete is found
        currCourseRow = users.getRange(row, ++index).getValue();
      }

      if (courseCol) {//swap with last and delete
        let lastCourse = users.getRange(row, index - 1).getValue();
        users.getRange(row, courseCol).setValue(lastCourse);
        users.getRange(row, index - 1).setValue(0);
      }
      set(id, 0, name, 0);
      sendText(id, "Course number " + data + " is not on your list anymore");
    } else if (mode == SFS) {//students fo students
      let {busi, maxCol, maxRow, topicBase, sectionBase, sectionsNum} = getBusinessExcel();

      if (data == "Add a Topic \ud83c\udfea") {
        set(id, mode, 0, data);
        sendText(id, "We glad that you decided to join us! Please insert the topic");
        return;
      } else if (data == "Add a Business \ud83c\udfea") {
        sendText(id, "We glad that you decided to join us! Please insert your business name");
        set(id, mode, 0, "Password");//abuse of notation: using name as additional data holder
        return;
      } else if (data == "Delete My Business \ud83d\udcdb") {
        set(id, SFS, name, data);
        sendText(id, "Please tap on your business in order to delete it from the list");
        return;
      } else if (data == "Edit My Business \ud83d\udcdd") {
        set(id, SFS, name, data);
        sendText(id, "Please tap on your business in order to edit it");
        return;
      } else if (otherMode == "Delete My Business \ud83d\udcdb") {
        sendText(id, "In order to continue please provide your password");
        set(id, SFS, data, "Pass");
      } else if (otherMode == "Edit My Business \ud83d\udcdd") {
        sendText(id, "In order to continue please provide your password");
        set(id, SFS, data, "PassToEdit");
      } else if (data == SFS) {
        makeKeyboard_CourseList({id,sectionBase, sectionsNum})
        set(id, SFS, name, "Wait");
      } else {
        let currBusi = busi.createTextFinder(data).findNext();
        if (currBusi) {
          let busiCol = currBusi.getColumn();
          let busiRow = currBusi.getRow();
        }
      }
      if (currBusi && busiRow == 1) {//Show all business in the topic
        let courseList = [];
        let numberList = [];
        let topiCol = busi.createTextFinder(data).findNext().getColumn();
        let counter = busi.getRange(2, topiCol - 1).getValue();
        if (counter == 0) sendText(id, "There is no business here yet. Tap on 'Add a Business' in order to add your business to the list.")

        for (let i = topicBase + 1; i < topicBase + counter + 1; ++i) {
          let currBusi = busi.getRange(i, topiCol).getValue();
          numberList.push(currBusi);
          courseList.push(currBusi);
        }
        courseList.push("Add a Business \ud83c\udfea");
        numberList.push("Add a Business \ud83c\udfea");
        courseList.push("Delete My Business \ud83d\udcdb");
        numberList.push("Delete My Business \ud83d\udcdb");
        courseList.push("Edit My Business \ud83d\udcdd");
        numberList.push("Edit My Business \ud83d\udcdd");
        courseList.push(SFS);
        numberList.push(SFS);
        makeKeyBoard(id, courseList, numberList);
        set(id, mode, data, data);
      } else if (currBusi) {//Show busiKeyBoard and set topic mode
        set(id, mode, name, data);
        let description = busi.getRange(busiRow, busiCol + 1).getValue();
        sendKey(id, description, busiKeyBoard);
        return;
      }
    } else {//looking for course options
      let courseFinder = courses.createTextFinder(data);
      let currCourse = courseFinder.findNext();
      while (currCourse !== null && currCourse.getColumn() !== 1) {
        currCourse = courseFinder.findNext();
      }
      if (currCourse) {
        sendOpt(id, name, courses, currCourse.getRow());
      }
    }
  }

  //external massage command
  else if (contents.message) {
    //Statistics update
    let current = users.getRange(2, 12).getValue();
    users.getRange(2, 12).setValue(++current);

    //Clean text
    let id = contents.message.from.id;
    let name = contents.message.from.first_name;
    let text = contents.message.text;
    let clean = text.split('"');
    if (clean.length == 2) {
      text = clean[0] + clean[1];
    }
    let info = text.split('-');
    if (info.length == 2) {
      let courseNumber = info[0];
      let courseReview = info[1];
    }
    if (info.length == 3) {
      let courseNumber = info[0];
      let courseName = info[1];
      let courseLink = info[2];
    }

    if (text == "/start") { // || text == "hey" || text == 'היי' || text == "hello" || text == 'hi'
      sendText(id, "Hi " + name + " \ud83d\udc4b, welcome to Tbot \ud83d\udcd6");
      sendKey(id, "How may I help you?", mainKeyBoard);
      sendText(id, "To add a course to your list, simply search for it in the courses, and click 'Add to My List' button");
      set(id, 0, name, 0);
      return;
    } else if (text == 'תפריט ראשי' || text == 'Main Menu' || text == mainMenu) {
      sendKey(id, "How may I help you?", mainKeyBoard);
      set(id, 0, name, 0);
      return;
    }
    //find the user in the table and check his mode
    let cellFinder = users.createTextFinder(id);
    let cell = cellFinder.findNext();
    while (cell !== null && cell.getColumn() !== 1) cell = cellFinder.findNext();
    let row = -1;
    let mode;
    let otherMode = 0;
    let otherMode2 = 0;
    if (cell) {
      let row = cell.getRow();
      mode = users.getRange(row, 2).getValue();
      otherMode = users.getRange(row, 4).getValue();
      otherMode2 = users.getRange(row, 3).getValue();
      let date = Utilities.formatDate(new Date(), "GMT+3", "dd/MM/yyyy");
      users.getRange(row, 5).setValue(date);
    } else {
      set(id, 0, name, 0);
      sendKey(id, "How may I help you?", mainKeyBoard);
    }

    //if simple test command - sent it and return
    let isDone = simpleText(id, text);
    if (isDone) return;

    //Check for other commands
    if (text == ride || text == 'רשימת אזורים') {
      sendKey(id, "Send the required city name or choose your region from the list below " + downSy, rideKeyBoard);
      set(id, "Ride");
    } else if (text == course || text == 'Search For Another Course') {
      removeKey(id, "Please insert the course number or course name in hebrew");
      set(id, "Course", name, 0);
    } else if (text == faculty || text == "Department Groups \ud83c\udfeb") {
      sendKey(id, "Choose your faculty from the list below ", coursesKeyBoard);
      set(id, 'faculty');
    } else if (text == feedback || text == "/feedback") {
      removeKey(id, "You can send your feedback now");
      set(id, 'feedback');
    } else if (text == drive || text == courseGroup || text == reviews || text == 'Get all' || text == facebook
      || text == youTube || text == ug || text == cs || text == 'All tests - exel'
      || text == moodle || text == testock || text == "Panopto" || text == "Course info" || text == 'Teams Group \ud83d\udc6a') {
      getDone(id, name, text, users, courses);
    } else if (text == WantToHelp) {
      sendText(id, "על מנת להיכנס למאגר העוזרים עלייך למלא את הטופס הבא וניצור איתך קשר בהקדם");
      sendText(id, "בשדה id בשאלוון הכנס בבקשה את המספר הבא: " + id);
      sendText(id, "https://forms.gle/ECq5NxEvJAMD9pTn8");
    } else if (text == 'Write a review') {
      removeKey(id, "Please write  your review");
      set(id, text);
    } else if (text == add) {
      set(id, 'Add course');
      removeKey(id, "Please insert the course number, course name and group link in the following format:"
        + " course number-course name-group link. If there is no telegram group, please insert: course number-course name-");
    } else if (text == 'Add telegram group') {
      set(id, text);
      sendText(id, "Please insert the group link");
      sendText(id, "Note: to get a group link you need to open a group, then go to: Manage group (or click the edit symbol using smartphone) -> Group type -> Copy link");
      sendText(id, "Don't forget to make the group visible so new members will see messages that were sent before they joined");
    } else if (text == "Add Teams link") {
      set(id, text);
      sendText(id, "Please insert the group link");
    } else if (text == "Add to my course list \ud83d\udccd") {
      let added = false;
      if (row) {
        let idRow = row;
        let courseToAdd = users.getRange(idRow, 4).getValue();
        let currCol = 10;
        while (currCol <= 26) {
          let currNumber = users.getRange(idRow, currCol).getValue();
          if (courseToAdd == currNumber) {
            sendText(id, "This course is already in your course list");
            return;
          }
          if (currNumber) currCol++;
          else {
            (users.getRange(idRow, currCol).setValue(courseToAdd));
            let currCourseName = courses.getRange(courseToAdd, 2).getValue();
            sendText(id, currCourseName + " is added to your list")
            added = true;
            currCol = 27;
          }
        }
        if (!(added)) {
          sendtext(id, "The list is full");
        }
      }
    } else if (text == "My Courses \ud83d\udccc") {
      sendText(id, "Loading your Courses..");
      let idRow = row;
      if (idRow) {
        let currCol = 10;
        let courseList = [];
        let numberList = [];
        while (currCol <= 26) {
          let courseRow = users.getRange(idRow, currCol).getValue();
          if (courseRow) {
            let courseNumber = courses.getRange(courseRow, 1).getValue();
            let courseName = courses.getRange(courseRow, 2).getValue();
            numberList.push(courseNumber);
            courseList.push(courseName + " - " + courseNumber);
            currCol++;
          } else {
            currCol = 27;
          }
        }
        if (numberList.length > 0) {
          courseList.push("Delete A Course From My List");
          numberList.push("Delete A Course From My List");
          courseList.push("Clean My List");
          numberList.push("Clean My List");
          courseList.push("Search For Another Course");
          numberList.push("Search For Another Course");
          set(id, "Course", name, 0);
          makeKeyBoard(id, courseList, numberList);
        } else {
          sendText(id, "There is no registered courses yet");
        }
      }
    } else if (text == "Clean My List") {
      let idRow = row;
      for (let currCol = 5; currCol <= 15; currCol++) {
        users.getRange(idRow, currCol).setValue(0);
      }
      sendText(id, "your list is clean");
    } else if (text == WantToTalk || (text == 'כן' && id == '810039866')) { //set an anonymous talk //id wanted to talk
      const {helpers} = getHelperListExcel();

      let helperCol = 2;
      sendText(id, "Searching for an helper for you.. You can always change your preference for an helper and i'll try to find" +
        " the best one for you.. ");
      let helperId = findHelper(id);
      if (helperId == 0) {
        sendText(id, "There is no available helper for now, please try again later..");
        return;
      }
      //check if in talk already
      let isAvail = false;
      let helperFinder = users.createTextFinder(helperId);
      let helperCell = helperFinder.findNext();
      while (helperCell && helperCell.getColumn() !== 1) {
        helperCell = helperFinder.findNext();
      }
      if (helperCell) {
        if (users.getRange(helperCell.getRow(), 2).getValue() !== "Talk") {
          isAvail = true;
        } else {
          sendText(id, "Your helper is in another conversation right now, you can wait a while or change your helper");
          return;
        }
      }
      if (helperId && isAvail) {
        set(id, "Talk", "", helperId);
        set(helperId, "Talk", "", id);
        let needsHelpColFinder = helpers.createTextFinder(id);
        let needsHelpCol = needsHelpColFinder.findNext().getColumn();
        while (needsHelpCol == 1) needsHelpCol = needsHelpColFinder.findNext().getColumn();
        let needsHelpNum = helpers.getRange(2, needsHelpCol).getValue();
        sendText(id, "You are connected with your helper");
        sendText(id, "To end the connection just type 'goodbye' or 'ביי'");
        sendText(helperId, "Student no. " + needsHelpNum + " want's to talk to you. You are connected");
        return;
      }
    } else if (text == "Settings and Preference") {
      const {needsHelp} = getHelperListExcel();
      let cellFinder = needsHelp.createTextFinder(id);
      let needsHelpCell = cellFinder.findNext();
      while (needsHelpCell !== null && needsHelpCell.getColumn() !== 1) {
        needsHelpCell = cellFinder.findNext();
      }
      if (!(needsHelpCell)) { //the user is not in the table -> init user
        let nextPlace = needsHelp.getRange(1, 1).getValue();
        needsHelp.getRange(nextPlace, 1).setValue(id);
        needsHelp.getRange(1, 1).setValue(nextPlace + 1);
        row = nextPlace;
      } else {
        row = needsHelpCell.getRow();
      }
      set(id, text, name, 0);
      let gender = needsHelp.getRange(row, 3).getValue();
      let faculty = needsHelp.getRange(row, 4).getValue();
      let topic = needsHelp.getRange(row, 5).getValue();
      if ((!(gender)) && (!(faculty)) && (!(topic))) sendText(id, "There is no preference yet");
      else sendText(id, "Your current settings are:");
      if (gender) sendText(id, "Gender: " + gender);
      if (faculty) sendText(id, "Faculty: " + faculty);
      if (topic) sendText(id, "Topic: " + topic);
      sendKey(id, "Choose the settings you are willing to change", settingsKeyBoard);
    } else if (text == SFS) {
      sendText(id, "Students for Students is a project designed to encourage students to support other students businesses");
      let {busi, maxCol, maxRow, topicBase, sectionBase, sectionsNum} = getBusinessExcel();
      makeKeyboard_CourseList({id,sectionBase, sectionsNum});
      set(id, text, name, "Wait");
    }

    //if mode - handle
    else if (mode == "Talk") {
      let otherId = users.getRange(row, 4).getValue();
      if (text == "ביי" || text == "goodbye") { //text == "end" || text == "End" || text == 'quit' || text == "Quit"|| text == 'done' || text == "Done" ||
        sendText(otherId, text);
        sendText(id, "The conversation is over");
        sendText(otherId, "The conversation is over");
        set(id, 0, name, 0);
        set(otherId, 0, 0, 0);
        sendKey(id, "How may I help you?", mainKeyBoard);
        sendKey(otherId, "How may I help you?", mainKeyBoard);
        //TODO send some feedback about the conversation
      } else {
        sendText(otherId, text);
      }
    } else if (mode == 'feedback') {
      // Fetch the email address
      let emailAddress = "technobot404@gmail.com";
      // Send Alert Email.
      let message = text;
      let subject = 'You have a new feedback from technoBot user';
      MailApp.sendEmail(emailAddress, subject, message + 'id: ' + id + ' ');
      sendText(id, "Thank you for your feedback! \uD83D\uDE4F");
      set(id, 0, name, 0);
      sendKey(id, "What would you like to do next?", mainKeyBoard);
    } else if (mode == 'Ride') {

      let {Rides} = getFacultyRidesExcel();
      let list = Rides.createTextFinder(text).findAll();
      if (list.length > 0) {
        let row = list[0].getRow();
        let name = Rides.getRange(row, 1).getValue();
        let link = Rides.getRange(row, 3).getValue();
        sendText(id, link + ' - ' + name);
      }
    } else if (mode == 'Add course') {
      if (!(courseNumber) || !(courseName)) {
        sendText(id, "Wrong format. please inset your review in the following format: course number-course name-group link");
        sendKey(id, "What would you like to do next?", mainKeyBoard);
      } else {
        courseAdd(id, courseNumber, courseName, courseLink, courses);
        set(id, 0);
        sendKey(id, "What would you like to do next?", mainKeyBoard);
      }
    } else if (mode == 'Write a review') {
      let idRow = row;
      let courseRow = users.getRange(idRow, 4).getValue();
      let courseNumber = courses.getRange(courseRow, 1).getValue();
      let courseName = courses.getRange(courseRow, 2).getValue();
      if (courseRow) {
        let j = 7;
        while (courses.getRange(courseRow, j).getValue()) {
          j++;
        }
        courses.getRange(courseRow, j).setValue(text);
        sendText(id, "Your review is added to " + courseNumber + ' ' + courseName);
        sendKey(id, "What would you like to do next?", mainKeyBoard);
        set(id, 0, name, 0);
      }
    } else if (mode == 'Add telegram group') {
      //let row = users.createTextFinder(id).findAll();
      let courseRow = 0;
      let idRow = row;
      courseRow = users.getRange(idRow, 4).getValue();
      let courseNumber = courses.getRange(courseRow, 1).getValue();
      let courseName = courses.getRange(courseRow, 2).getValue();
      let group = courses.getRange(courseRow, 3).getValue();
      if (group) {
        sendText(id, 'The group is already exist');
        sendText(id, group);
        set(id, 0, name, 0);
        sendKey(id, 'What would you like to do next?', mainKeyBoard)
        return;
      }
      if (courseRow) {
        let checkIfLink = text.split('ttps://t.me/joinchat');
        if (checkIfLink.length !== 2) {
          sendText(id, 'This is not a link to telegram group. Please try again');
          sendKey(id, 'What would you like to do next?', mainKeyBoard)
          set(id, 0, name, 0);
        } else {
          courses.getRange(courseRow, 3).setValue(text);
          sendText(id, "The group is added to " + courseNumber + ' ' + courseName);
          set(id, 0, name, 0);
          sendKey(id, 'What would you like to do next?', mainKeyBoard)
        }
      }
    } else if (mode == 'Add Teams link') {
      let courseRow = 0;
      let idRow = row;
      courseRow = users.getRange(idRow, 4).getValue();
      let courseNumber = courses.getRange(courseRow, 1).getValue();
      let courseName = courses.getRange(courseRow, 2).getValue();
      let group = courses.getRange(courseRow, 6).getValue();
      if (group) {
        sendText(id, 'The group is already exist');
        sendText(id, group);
        set(id, 0, name, 0);
        sendKey(id, 'What would you like to do next?', mainKeyBoard)
        return;
      }
      if (courseRow) {
        let checkIfLink = text.split('ttps://teams.microsoft.com');
        if (checkIfLink.length !== 2) {
          sendText(id, 'This is not a link to Teams Group \ud83d\udc6a. Please try again');
          sendKey(id, 'What would you like to do next?', mainKeyBoard)
          set(id, 0, name, 0);
        } else {
          courses.getRange(courseRow, 6).setValue(text);
          sendText(id, "The group is added to " + courseNumber + ' ' + courseName);
          set(id, 0, name, 0);
          sendKey(id, 'What would you like to do next?', mainKeyBoard)
        }
      }
    } else if (mode == 'Add exams exel') {
      let courseRow = 0;
      let idRow = row;
      courseRow = users.getRange(idRow, 4).getValue();
      let courseNumber = courses.getRange(courseRow, 1).getValue();
      let courseName = courses.getRange(courseRow, 2).getValue();
      if (courseRow) {
        courses.getRange(courseRow, 4).setValue(text);
        sendText(id, "The exel is added to " + courseNumber + ' ' + courseName);
      }
    } else if (mode == faculty) {
      facultyGroupHandler(id, text);
    } else if (mode == 'Course') {
      let list = courses.createTextFinder(text).findAll();
      let len = list.length;
      if (len == 1) {
        sendOpt(id, name, courses, list[0].getRow());
      } else if (len > 1) {
        let tooLong = false;
        if (len > 50) {
          tooLong = true;
          sendText(id, 'There is too many courses containing: ' + text);
          sendText(id, 'Try to search full course name or course number');
        }
        if (!(tooLong)) {
          sendText(id, "looking for relevant courses..");
          let courseNames = [];
          let courseNumbers = [];
          let count = 0;
          while (count < len) {
            let courseCol = list[count].getColumn();
            if (courseCol == 1 || courseCol == 2) {
              let courseRow = list[count].getRow();
              let courseName = courses.getRange(courseRow, 2).getValue();
              let courseNumber = courses.getRange(courseRow, 1).getValue();
              //if (!(courseNumbers.includes(courseNumber))){
              courseNames.push(courseName + " - " + courseNumber);
              courseNumbers.push(courseNumber)
            }
            count++;
            //}
          }
          courseNames.push("Search For Another Course");
          courseNumbers.push("Search For Another Course");
          makeKeyBoard(id, courseNames, courseNumbers);
        }
      } else { //len in 0
        set(id, 0, name, 0);
        sendKey(id, "can't find " + text + ". You can add a new course by Add course tab", mainKeyBoard);
      }
    } else if (mode == "Settings and Preference") {
      if (text == "Gender") {
        sendKey(id, "Choose the required gender", genderKeyBoard);
        set(id, mode, name, text);
        return;
      } else if (text == "Faculty" && data == "Settings and Preference") {
        sendKey(id, "Choose the required faculty", coursesKeyBoard);
        set(id, mode, name, text);
        return;
      } else if (text == "Faculty") {
        sendKey(id, "Choose the required faculty", coursesKeyBoard);
        set(id, mode, name, text);
        return;
      } else if (text == "Topic") {
        sendKey(id, "Choose the required topic", topicKeyBoard);
        set(id, mode, name, text);
        return;
      }
      //getData
      const {helpers, needsHelp} = getHelperListExcel();
      let rowFinder = needsHelp.createTextFinder(id);
      let currID = rowFinder.findNext();
      let row;
      while (currID !== null && currID.getColumn() !== 1) {
        currID = rowFinder.findNext();
        //sendText(id, "test "+row.getColumn());
      }
      if (currID == null) {
        let nextFree = needsHelp.getRange(1, 1).getValue();
        needsHelp.getRange(nextFree, 1).setValue(id);
        needsHelp.getRange(nextFree, 6).setValue(0);//init black list
        needsHelp.getRange(1, 1).setValue(nextFree + 1);
        row = nextFree;
      } else row = currID.getRow();
      if (text == "Change helper") {
        let helperId = needsHelp.getRange(row, 2).getValue();
        if (helperId == 0) {
          sendText(id, "You have no helper yet. Choose 'anonymous chat' button to start a chat with a student.");
          return;
        }
        needsHelp.getRange(row, 2).setValue(0);
        let BLCounter = needsHelp.getRange(row, 6).getValue();
        needsHelp.getRange(row, 6 + BLCounter + 1).setValue(helperId);
        needsHelp.getRange(row, 6).setValue(BLCounter + 1);
        if (helperId) {
          sendText(id, "Sure, next time you'll get another helper");
          sendText(id, "You are welcome to fill the next form in order to give a feedback about your helper. Your helper id is: " + helperId);
          //findHelper(id);
          //free helper
          let finderHelper = helpers.createTextFinder(helperId);
          let helper = finderHelper.findNext();
          while (helper !== null && helper.getColumn() !== 1) {
            helper = finderHelper.findNext();
          }
          let baseCol = 33;
          if (helper) {
            let helperRow = helper.getRow();
            let helperCol = helper.getColumn();
            let nextFree = helpers.getRange(helperRow, 9).getValue();
            helpers.getRange(helperRow, 9).setValue(nextFree - 1);
            //swap with last
            //find id place in first table
            let finderIdPlace = helpers.createTextFinder(id);
            let IdCell = finderIdPlace.findNext();
            while (IdCell !== null && IdCell.getRow() !== helperRow) {
              IdCell = finderIdPlace.findNext();
            }
            let IdCol = IdCell.getColumn();
            let lastId = helpers.getRange(helperRow, nextFree - 1).getValue();
            helpers.getRange(helperRow, IdCol).setValue(lastId);

            //sendText to helper
            if (IdCol !== nextFree - 1) {
              let studentNumber = IdCol - 9;
              sendText(helperId, "Student number " + studentNumber + " no longer needs your help.");
              let lastNumber = nextFree - 1 - 9;
              sendText(helperId, "From now student number " + lastNumber + " has a new number: " + studentNumber);
            }
            //find in table and move to right place
            let numberOfPatients = nextFree - 10;
            let max = helpers.getRange(1, numberOfPatients + baseCol).getValue();
            for (let i = 3; i < max; i++) {
              let currIndex = helpers.getRange(i, numberOfPatients + baseCol).getValue();
              if (currIndex == helperRow) { //found in table. swap with last, update counter and move Back
                let last = helpers.getRange(max - 1, numberOfPatients + baseCol).getValue();
                helpers.getRange(i, numberOfPatients + baseCol).setValue(last);//insert last instead
                helpers.getRange(1, numberOfPatients + baseCol).setValue(max - 1);//update counter
                let beforeMax = helpers.getRange(1, numberOfPatients + baseCol - 1).getValue();
                helpers.getRange(1, numberOfPatients + baseCol - 1).setValue(beforeMax + 1);//update counter
                helpers.getRange(beforeMax, numberOfPatients + baseCol - 1).setValue(helperRow);//insert curr to the prev col
              }
            }
          }

        } else {
          sendText(id, "There is no helper set yet");
        }
        return;
      } else if ((text == "Back" || text == 'חזור') && mode == 'Settings and Preference') {
        sendKey(id, "Choose from the list below", helpKeyBoard);
        return;
      } else if ((text == "Back" || text == 'חזור') && (otherMode == "Faculty" || otherMode == "Gender" || otherMode == "Topic")) {
        sendKey(id, "Choose from the list below", settingsKeyBoard);
        return;
      }
      if (text == "Male" || text == "Female") {//gender
        needsHelp.getRange(row, 3).setValue(text);
        sendKey(id, "Your prefernce has been updated " + text + " gender", settingsKeyBoard);
      } else if (text == "Studies" || text == "Emotional Distress" || text == "Military experiences" || text == "Violence or harassment") {//topic
        needsHelp.getRange(row, 5).setValue(text);
        sendKey(id, "Your prefernce has been updated: " + text + " topic", settingsKeyBoard);
      } else if (text == "מדעי המחשב" || text == 'הנדסת חשמל' || text == 'הנדסת מכונות' || text == 'הנדסה אזרחית וסביבתית' || text == 'הנדסת תעשייה וניהול' || text == 'הנדסה ביו-רפואית' ||
        text == 'הנדסה כימית' || text == 'הנדסת ביוטכנולוגיה ומזון' || text == 'מדע והנדסה של חומרים' || text == 'הפקולטה למתמטיקה' || text == 'הפקולטה לכימיה' || text == 'הפקולטה לפיסיקה' ||
        text == 'הפקולטה לביולוגיה' || text == 'רפואה' || text == 'ארכיטקטורה ובינוי ערים' || text == 'חינוך למדע וטכנולוגיה' || text == 'הפקולטה להנדסת אוירונוטיקה וחלל') {//faculty
        needsHelp.getRange(row, 4).setValue(text);
        sendKey(id, "Your prefernce has been updated " + text + " faculty", settingsKeyBoard);
        return;
      }
    } else if (mode == SFS) {
      let {busi, maxCol, maxRow, topicBase, sectionBase, sectionsNum, topicNum} = getBusinessExcel();

      let currBusi = busi.createTextFinder(otherMode).findNext();
      if (currBusi) {
        let busiCol = currBusi.getColumn();
        let busiRow = currBusi.getRow();
      }
      if (otherMode == "Add a Topic \ud83c\udfea") {
        let isExist = busi.createTextFinder(text).findNext();
        if (isExist) sendText(id, "This topic is already exists. You can add your business by 'Add a Business \ud83c\udfea' button after entering the topic");
        else {
          busi.getRange(1, sectionBase * sectionsNum + 1).setValue(text);
          busi.getRange(2, sectionBase * sectionsNum).setValue(0);
          busi.getRange(6, 2).setValue(sectionsNum + 1);
          sendText(id, "Got it! " + text + " topic is initialized");
          set(id, "null", name, "null");
        }
        return;
      } else if (otherMode == "Pass") {//password is inserted in order to delete business
        let textFinder = busi.createTextFinder(otherMode2);
        let next = textFinder.findNext();
        if (next !== null) {
          let nextRow = next.getRow();
          let nextCol = next.getColumn();
          if (text == busi.getRange(nextRow, nextCol - 1).getValue()) { //the password is good
            let lastRow = 2 + busi.getRange(2, nextCol - 1).getValue();
            for (let i = nextCol - 1; i < nextCol - 1 + 6; i++) {//move last to this row
              let temp = busi.getRange(lastRow, i).getValue();
              busi.getRange(nextRow, i).setValue(temp);
            }
            busi.getRange(2, nextCol - 1).setValue(lastRow - 2 - 1);
            sendText(id, "Your business has been deleted");
          } else {
            sendText(id, "The password is wrong! please try again. You can contact us in case that you forgot your password.");
          }
        }
        return;
      } else if (otherMode == "PassToEdit") {//password is inserted in order to edit businesss
        let textFinder = busi.createTextFinder(otherMode2);
        let next = textFinder.findNext();
        if (next !== null) {
          let nextRow = next.getRow();
          let nextCol = next.getColumn();
          if (text == busi.getRange(nextRow, nextCol - 1).getValue()) { //the password is good
            sendKey(id, "What information would you like to modify?", busiEditKeyBoard);
            set(id, SFS, 0, "GoodPass")
          } else {
            sendText(id, "The password is wrong! please try again. You can contanct us in case that you forgot your password.");
          }
        }
        return;
      } else if (otherMode == "GoodPass") {
        set(id, "GoodPass", 0, text);//(id, GoodPass, busi name, information to change)
        sendText(id, "please send the new information");
        return;
      }
      let topic = otherMode2;//in name there is the topic in witch the user wants to insert the information
      let currTopic = busi.createTextFinder(topic).findNext();
      let topicCol = 0;
      let topicCounter = 0;
      //sendText(id, "curr topic: "+topic+" "+currTopic);
      if (currTopic) {
        topicCol = currTopic.getColumn();
        topicCounter = busi.getRange(2, topicCol - 1).getValue();
      }

      if (otherMode == "Password") {
        //sendText(id,"test");
        let isExist = busi.createTextFinder(text).findNext();
        if (text.length >= 34) sendText(id, "The name is too long. Please choose another name for your business");
        else if (isExist) sendText(id, "This name is already taken. Please choose another name for your business");
        else {
          busi.getRange(topicBase + topicCounter + 1, topicCol).setValue(text);//set name
          sendText(id, text + " is initialized. Please send a password in order to be able to make changes in the future..");
          busi.getRange(2, topicCol - 1).setValue(topicCounter + 1);//counter++
          set(id, mode, 0, "Description");
        }
        return;
      } else if (otherMode == "Description") {//User gets here after sending the password
        //sendText(id, "test "+topicBase+" "+topicCounter+" "+topicCol);
        busi.getRange(topicBase + topicCounter, topicCol - 1).setValue(text);//set password
        sendText(id, "Your password is " + text + ". Please send a description for your business");
        //set(id, mode, 0, "Location");
        set(id, mode, 0, "Contact");
        return;
      }
      else if (otherMode == "Contact") {//User gets here after sending the location
        busi.getRange(topicBase + topicCounter, topicCol + 1).setValue(text);//set Description
        sendText(id, "We almost done! Please send the contact information for your business");
        //set(id, mode, 0, "Prices");
        set(id, mode, 0, "Done");
        return;
      }
      else if (otherMode == "Done") {//User gets here after sending the prices
        busi.getRange(topicBase + topicCounter, topicCol + 3).setValue(text);//set contact info
        sendText(id, "Got it! Your business information is initialized, wish you luck!");
        set(id, mode, name, "null");
        return;
      } else if (otherMode == "Delete My Business \ud83d\udcdb") {
        let isExist = busi.createTextFinder(text).findNext();
        if (!(isExist)) sendText(id, "There is no business with that name. Please check the name and try again");
        else {
          let businessRow = isExist.getRow();
          sendText(id, "Please insert you password in order to delete your business");
          set(id, mode, text, "Delete if Password");
        }
        return;
      } else if (otherMode == "Delete if Password") {
        let busiToDelete = busi.createTextFinder(text).findNext();
        let busiRow = busiToDelete.getRow();
        let busiCol = busiToDelete.getColumn();
        let afteLastInCol = busi.getRange(1, busiCol).getValue();
        let lastInCol = busi.getRange(afteLastInCol - 1, busiCol).getValue();
        let lastInColPass = busi.getRange(afteLastInCol - 1, busiCol - 1).getValue();
        let lastInColDes = busi.getRange(afteLastInCol - 1, busiCol + 1).getValue();
        let lastInColContact = busi.getRange(afteLastInCol - 1, busiCol + 3).getValue();

        busi.getRange(busiRow, busiCol).setValue(lastInCol);
        busi.getRange(busiRow - 1, busiCol).setValue(lastInColPass);
        busi.getRange(busiRow + 1, busiCol).setValue(lastInColDes);
        busi.getRange(busiRow + 3, busiCol).setValue(lastInColContact);
        busi.getRange(1, busiCol).setValue(afteLastInCol - 1);
      }

      if (text == "Location") {
        if (currBusi) {
          let textToSend = busi.getRange(busiRow, busiCol + 2).getValue();
          sendText(id, textToSend);
        }
      } else if (text == "Get in Contact") {
        if (currBusi) {
          let textToSend = busi.getRange(busiRow, busiCol + 3).getValue();
          sendText(id, textToSend);
        }
      } else if (text == "Prices") {
        if (currBusi) {
          let textToSend = busi.getRange(busiRow, busiCol + 4).getValue();
          sendText(id, textToSend);
        }
      }
    } else if (mode == "GoodPass") {//helper function of STS: edit business // (id, GoodPass, busi name, information to change)
      let {busi, maxCol, maxRow, topicBase, sectionBase, sectionsNum, topicNum} = getBusinessExcel();

      let currBusi = busi.createTextFinder(otherMode2).findNext();
      let busiRow = currBusi.getRow();
      let busiCol = currBusi.getColumn();
      //(otherMode == "Business name") busiCol+=0;
      if (otherMode == "Description") busiCol += 1;
      else if (otherMode == "Contact Information") busiCol += 3;
      else if (otherMode == "Password") busiCol -= 1;
      busi.getRange(busiRow, busiCol).setValue(text);
      sendKey(id, "The " + otherMode + " has been updated to " + text, mainKeyBoard);
      return;
    } else {
      sendKey(id, "How may I help you?", mainKeyBoard);
    }
  }
}


function findHelper(id) {
  const {helpers, needsHelp} = getHelperListExcel();
  let cellFinder = needsHelp.createTextFinder(id);
  let cell = cellFinder.findNext();
  while (cell !== null && cell.getColumn() !== 1) {
    cell = cellFinder.findNext();
  }
  let needsHelpRow;
  if (cell == null) { //the user is not in the table -> init user
    let nextPlace = needsHelp.getRange(1, 1).getValue();
    needsHelp.getRange(nextPlace, 1).setValue(id);
    needsHelp.getRange(1, 1).setValue(nextPlace + 1);
    needsHelpRow = nextPlace;
  } else {
    needsHelpRow = cell.getRow();
  }
  let helperId = needsHelp.getRange(needsHelpRow, 2).getValue();
  if (helperId) {
    return helperId;
  }
  //sendText(id, "looking for your helper..");
  //init helper - find and register
  helperId = 0;
  let maxScore = -1;
  let helperRow = 0;
  let helperRowTab = 0;
  let helperColTab = 0;
  let tableBase = 33;
  for (let i = tableBase; i <= tableBase + 22; ++i) {//a table representing helpers by the number of students they are helping
    let nextFree = helpers.getRange(1, i).getValue();//if > 3 there is some helpers witn  #(i - tableBase) students in this col
    if (nextFree > 3) {
      for (let j = nextFree - 1; j > 2; j--) {
        let tempHelperRow = helpers.getRange(j, i).getValue();

        //check if helper can help more people
        let maxHelp = helpers.getRange(tempHelperRow, 8).getValue();
        let helpCount = helpers.getRange(tempHelperRow, 9).getValue() - 10;
        let tempHelperId = helpers.getRange(tempHelperRow, 1).getValue();
        if (maxHelp > helpCount) {
          let score = 0;
          if (tempHelperId == id) score -= 1000;
          let blackIndex = 6;
          let blackCounter = needsHelp.getRange(needsHelpRow, blackIndex).getValue();
          for (let k = 1; k <= blackCounter; k++) {
            let blackId = needsHelp.getRange(needsHelpRow, blackIndex + k).getValue();
            if (tempHelperId == blackId) score -= 1000;
          }
          if (needsHelp.getRange(needsHelpRow, 3).getValue() == helpers.getRange(tempHelperRow, 7).getValue()) score += 1;//gender
          if (needsHelp.getRange(needsHelpRow, 4).getValue() == helpers.getRange(tempHelperRow, 6).getValue()) {//faculty
            score += 1;
            if (needsHelp.getRange(needsHelpRow, 5).getValue() == "Studies") score += 1;//also looking for stufy help
          }
          if (helpers.getRange(tempHelperRow, 5).getValue() == "All") score += 6;
          else if (needsHelp.getRange(needsHelpRow, 5).getValue() == helpers.getRange(tempHelperRow, 5).getValue()) score += 6;//topic
          else score -= 100; //only people that can help in this field will help
          if ((score > 0) && (score > maxScore)) {
            helperRow = tempHelperRow;
            maxScore = score;
            helperRowTab = j;
            helperColTab = i;
            helperId = tempHelperId;
          }
        }
      }
    }
  }

  if (helperRow !== 0) {
    //swap with last in line - TODO CHECK & TESTS
    let nextFree = helpers.getRange(1, helperColTab).getValue();
    let lastInCol = helpers.getRange(nextFree - 1, helperColTab).getValue();
    helpers.getRange(helperRowTab, helperColTab).setValue(lastInCol);
    helpers.getRange(nextFree - 1, helperColTab).setValue(0);//optional
    helpers.getRange(1, helperColTab).setValue(nextFree - 1);
    let nextFreeNextCol = helpers.getRange(1, helperColTab + 1).getValue();
    helpers.getRange(nextFreeNextCol, helperColTab + 1).setValue(helperRow);
    helpers.getRange(1, helperColTab + 1).setValue(nextFreeNextCol + 1);
    //update helper table
    let nextFreePlace = helpers.getRange(helperRow, 9).getValue();
    helpers.getRange(helperRow, nextFreePlace).setValue(id);
    helpers.getRange(helperRow, 9).setValue(nextFreePlace + 1);
    helperId = helpers.getRange(helperRow, 1).getValue();
    needsHelp.getRange(needsHelpRow, 2).setValue(helperId);
  }
  return helperId;
}


function simpleText(id, text) {
  if (text == About) {
    sendText(id, "Hi! My name is Michael Toker and I am a student at the Computer Science department at the Technion");
    sendText(id, "I developed this bot as an open-source project for the use of Technion students, I hope that you find it useful!");
    sendKey(id, "You are more than welcome to contact me with any issue..", contactKeyBoard);
  } else if (text == ContactFacebook) {
    sendText(id, "https://www.facebook.com/michael.toker");
  } else if (text == ContactEmail) {
    sendText(id, "dontokeron@gmail.com");
  } else if (text == ContactLinkedIn) {
    sendText(id, "https://www.linkedin.com/in/michael-toker-52814b153");
  } else if (text == usefulLink) {
    sendKey(id, "Here are some useful links for you", usefulKeyBoard);
  } else if (text == 'Copiers and printers') {
    sendText(id, 'General info - http://www.asat.org.il/academic/contents/print/צילום_והדפסה');
    sendText(id, 'in order to send a file to print start a new mail, type your ID in the SUBJECT.')
    sendText(id, 'Attach your files (Office documents, pictures and pdf files)');
    sendKey(id, 'Insert the recipient according to your desired task (click suitable tab to get email)', printKeyBoard)
  } else if (text == "A4 B&W single sided") {
    sendText(id, 'A4 B&W single sided – print.bws@campus.technion.ac.il');
  } else if (text == "A4 B&W two sided") {
    sendText(id, 'A4 B&W two sided – print.bwd@campus.technion.ac.il');
  } else if (text == "A4 Color single sided") {
    sendText(id, 'A4 Color single sided – print.color@campus.technion.ac.il');
  } else if (text == "A3 B&W single sided") {
    sendText(id, 'A3 B&W single sided – print.A3bws@campus.technion.ac.il')
  } else if (text == "A3 B&W two sided") {
    sendText(id, 'A3 B&W two sided – print.A3bwd@campus.technion.ac.il')
  } else if (text == "A3 Color single sided") {
    sendText(id, 'A3 Color single sided – print.A3color@campus.technion.ac.il')
  } else if (text == "B&W 2 slides per page, single sided") {
    sendText(id, 'B&W 2 slides per page, single sided – print.2pbws@campus.technion.ac.il')
  } else if (text == "B&W 2 slides per page, two sided") {
    sendText(id, 'B&W 2 slides per page, two sided – print.2pbwd@campus.technion.ac.il')
  } else if (text == "B&W 4 slides per page, single sided") {
    sendText(id, 'B&W 4 slides per page, single sided – print.4pbws@campus.technion.ac.il')
  } else if (text == "B&W 4 slides per page, two sided") {
    sendText(id, 'B&W 4 slides per page, two sided – print.4pbwd@campus.technion.ac.il')
  } else if (text == calendar) {
    sendKey(id, "http://www.admin.technion.ac.il/dpcalendar/Student.aspx", usefulKeyBoard);
  } else if (text == "אזור תל אביב-יפו והמרכז" || text == "אזור ירושליים" || text == "אזור חיפה והצפון"
    || text == "אזור השפלה והדרום" || text == "אזור השרון") {
    switch (text) {
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
  } else if (text == "טרמפים בפייסבוק") {
    sendText(id, "https://www.facebook.com/groups/301410316636087/" + " - " + "טרמפים יוצאים מהטכניון");
    sendText(id, "https://www.facebook.com/groups/135704829788347/" + " - " + "טרמפים נכנסים לטכניון");
    sendKey(id, "מה תרצה לעשות כעת?", ridesKeyBoard);
  } else if (text == "scans - cf") {
    sendText(id, "https://tscans.cf/");
  } else if (text == 'MyDegree') {
    sendText(id, "https://www.mydegree.co.il/");
  } else if (text == 'Technion Students FAQ (doc)') {
    sendText(id, "https://docs.google.com/document/d/1XGWWns6IZy9QpsAhWZu_WxIQTXYbRVeAV3XGr6pcMpc/edit?fbclid=IwAR1bBn5g3NBdxf2JFPbeWinOmQ3F0qa2KxlQGlMZ5wPyr31l0yRfo7ESPLc");
  } else if (text == 'useful links from facebook (doc)') {
    sendText(id, "https://docs.google.com/document/d/1tR8X8YawbK_h2VwQU1k1Fz4q12B0nWxOMSqxE_hV2sw/" +
      "edit?fbclid=IwAR1cQkxt1PG-gFwF_QWPG80u9ZNYuVwwBlWwmCes5MLst1ERmAIGijH8BRM");
  } else if (text == 'cheese&fork') {
    sendKey(id, "https://cheesefork.cf/", usefulKeyBoard);
  } else if (text == 'testock') {
    sendKey(id, "https://testock.tk/courses", usefulKeyBoard);
  } else if (text == 'ug ' + ugSy) {
    sendKey(id, 'https://ug3.technion.ac.il/rishum/search', usefulKeyBoard);
  } else if (text == 'moodle ' + moodleSy) {
    sendKey(id, 'https://moodle.technion.ac.il/', usefulKeyBoard);
  } else if (text == "Git") {
    sendText(id, 'https://github.com/tokeron/Tbot/blob/master/Tbot');
  } else if (text == 'אסט') {
    sendKey(id, "http://www.asat.org.il/", usefulKeyBoard);
  } else if (text == 'ASA') {
    sendKey(id, "https://www.asatechnion.co.il/", usefulKeyBoard);
  } else if (text == 'ניב סקרביאנסקי') {
    sendKey(id, 'https://drive.google.com/file/d/11-zadZjM-0qDwc0qrWXHVygLN7aKkqna/view?usp=drivesdk', mainKeyBoard);
  } else if (text == Corona) {
    sendText(id, "https://t.me/asat_technion");
    //}else if (text == 'חזור'){
    //  sendKey(id, "Choose from the list below", helpKeyBoard);
  } else if (text == help) {
    sendKey(id, "Choose from the list below", helpKeyBoard);
  } else {
    return false;
  }
  return true;
}


function sendOpt(id, name, courses, courseRow) {
  let exel = false;
  let cs = false;
  let teams = false;
  set(id, 'Course', name, courseRow);
  let courseNumber = courses.getRange(courseRow, 1).getValue();
  let courseName = courses.getRange(courseRow, 2).getValue();
  let mode = courses.getRange(courseRow, 5).getValue();
  let link = courses.getRange(courseRow, 3).getValue();
  if (mode == 1) {
    sendText(id, courseName + " - " + courseNumber);
    if (courses.getRange(courseRow, 6).getValue()) teams = true;
    if (link && teams) {
      sendKey(id, "choose the required information", tgmalagKeyBoard);
    } else if (link) {
      sendKey(id, "choose the required information", gmalagKeyBoard);
    } else if (teams) {
      sendKey(id, "choose the required information", tmalagKeyBoard);
    } else sendKey(id, "choose the required information", malagKeyBoard);
    return;
  } else if (mode == 2) {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", gsportKeyBoard);
    else sendKey(id, "choose the required information", sportKeyBoard);
    return;
  }
  if ((courseNumber.indexOf('236') !== -1) || (courseNumber.indexOf('234') !== -1)) {
    cs = true;
  }
  if (courses.getRange(courseRow, 4).getValue()) exel = true;
  if (courses.getRange(courseRow, 6).getValue()) teams = true;
  if (exel && cs && teams) {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", tgexelCsKeyBoard);
    else sendKey(id, "choose the required information", texelCsKeyBoard);
  } else if (exel && cs) {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", gexelCsKeyBoard);
    else sendKey(id, "choose the required information", exelCsKeyBoard);
  } else if (cs && teams) {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", tgcsKeyBoard);
    else sendKey(id, "choose the required information", tcsKeyBoard)
  } else if (exel && teams) {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", tgexelKeyBoard);
    else sendKey(id, "choose the required information", texelKeyBoard)
  } else if (teams) {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", tgallKeyBoard);
    else sendKey(id, "choose the required information", tallKeyBoard);
  } else if (cs) {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", gcsKeyBoard);
    else sendKey(id, "choose the required information", csKeyBoard)
  } else if (exel) {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", gexelKeyBoard);
    else sendKey(id, "choose the required information", exelKeyBoard)
  } else {
    sendText(id, courseName + " - " + courseNumber);
    if (link) sendKey(id, "choose the required information", gallKeyBoard);
    else sendKey(id, "choose the required information", allKeyBoard)
  }
}


function getDone(id, name, command, users, courses) {
  let cellFinder = users.createTextFinder(id);
  let cell = cellFinder.findNext();
  while (cell && (cell.getColumn() !== 1)) cell = cellFinder.findNext();
  let idRow = cell.getRow();
  let courseRow = users.getRange(idRow, 4).getValue();
  if (courseRow) {
    let courseNumber = courses.getRange(courseRow, 1).getValue();
    let courseName = courses.getRange(courseRow, 2).getValue();
    let group = courses.getRange(courseRow, 3).getValue();
    let exel = courses.getRange(courseRow, 4).getValue();
    let teams = courses.getRange(courseRow, 6).getValue();
    let csCourse = false;
    if ((courseNumber.indexOf('236') !== -1) || (courseNumber.indexOf('234') !== -1)) {
      csCourse = true;
    }
    let currentCounter;
    switch (command) {
      case drive:
        sendText(id, "Looking for a link to the drive " + driveSy);
        driveHandler(id, courseNumber, courseName);
        currentCounter = users.getRange(2, 9).getValue();
        users.getRange(2, 9).setValue(++currentCounter);
        break;
      case courseGroup:
        sendText(id, "Looking for telegram group" + groupSy);
        if (group) sendText(id, group);
        else sendText(id, "There is no telegram group for this course yet. you can open and add a groupby using 'Add group'");
        currentCounter = users.getRange(2, 8).getValue();
        users.getRange(2, 8).setValue(++currentCounter);
        break;
      case "Teams Group \ud83d\udc6a":
        sendText(id, "Looking for Teams Group \ud83d\udc6a" + groupSy);
        if (teams) sendText(id, teams);
        else sendText(id, "There is no Teams Group \ud83d\udc6a for this course yet. you can open and add a groupby using 'Add group'")
        currentCounter = users.getRange(2, 8).getValue();
        users.getRange(2, 8).setValue(++currentCounter);
        break;
      case testock:
        sendText(id, "Looking for a link to the test scans " + scansSy);
        scansHandler(id, courseNumber);
        currentCounter = users.getRange(2, 11).getValue();
        users.getRange(2, 11).setValue(++currentCounter);
        break;
      case 'All tests - exel':
        sendText(id, "Looking for a link to the tests exel " + groupSy);
        sendText(id, exel);
        currentCounter = users.getRange(2, 11).getValue();
        users.getRange(2, 11).setValue(++currentCounter);
        break;
      case reviews:
        reviewsHandler(id, courseRow, courses, 0);
        currentCounter = users.getRange(2, 10).getValue();
        users.getRange(2, 10).setValue(++currentCounter);
        break;
      case facebook:
        facebookHandler(id, courseNumber, courseName);
        currentCounter = users.getRange(2, 7).getValue();
        users.getRange(2, 7).setValue(++currentCounter);
        break;
      case youTube:
        youtubeHandler(id, courseNumber, courseName)
        currentCounter = users.getRange(2, 7).getValue();
        users.getRange(2, 7).setValue(++currentCounter);
        break;
      case ug:
        sendText(id, "Looking for ug link " + ugSy);
        sendText(id, "https://ug3.technion.ac.il/rishum/course/" + courseNumber);
        currentCounter = users.getRange(2, 6).getValue();
        users.getRange(2, 6).setValue(++currentCounter);
        break;
      case cs:
        sendText(id, "Looking for computer science link " + csSy);
        sendText(id, "https://webcourse.cs.technion.ac.il/" + courseNumber);
        currentCounter = users.getRange(2, 6).getValue();
        users.getRange(2, 6).setValue(++currentCounter);
        break;
      case moodle:
        sendText(id, "Looking for moodle link " + moodleSy);
        sendText(id, "https://moodle.technion.ac.il/course/search.php?search=" + courseNumber);
        currentCounter = users.getRange(2, 6).getValue();
        users.getRange(2, 6).setValue(++currentCounter);
        break;
      case  "Course info":
        sendText(id, "Looking for info link ");
        sendText(id, "https://asatechnion.co.il/courses/syllabus" + courses.getRange(courseRow, 4).getValue() + ".pdf");
        break;
      case "Panopto":
        panoptoHandler(id, courseNumber);
        break;
      case 'Get all':
        if (group) {
          sendText(id, "Looking for a link to the telegram group " + groupSy);
          sendText(id, group);
        }
        if (teams) {
          sendText(id, "Looking for Teams Group \ud83d\udc6a" + groupSy);
          if (teams) sendText(id, teams);
        }
        sendText(id, "Looking for a link to the test scans " + scansSy);
        scansHandler(id, courseNumber);
        if (exel) sendText(id, exel);
        reviewsHandler(id, courseRow, courses, 1);
        facebookHandler(id, courseNumber, courseName);
        youtubeHandler(id, courseNumber, courseName);
        sendText(id, "Looking for ug link " + ugSy);
        sendText(id, "https://ug3.technion.ac.il/rishum/course/" + courseNumber);
        if (csCourse) {
          sendText(id, "Looking for computer science link " + csSy);
          sendText(id, "https://webcourse.cs.technion.ac.il/" + courseNumber);
        }
        sendText(id, "Looking for moodle link " + moodleSy);
        sendText(id, "https://moodle.technion.ac.il/course/search.php?search=" + courseNumber);
        driveHandler(id, courseNumber, courseName);
        set(id, 0, name, 0)
        sendKey(id, "What would you like to do next?", mainKeyBoard);
        break;
    }
  }
}

//simple handlers - adds the course number to the url to return link to a query with the course number in the site
function panoptoHandler(id, courseNumber) {
  sendText(id, "Looking for Panopto link " + YouTubeSy);
  sendText(id, "https://panoptotech.cloud.panopto.eu/Panopto/Pages/Sessions/List.aspx#query=%22" + courseNumber + "%22");
}


function youtubeHandler(id, courseNumber, courseName) {
  sendText(id, "Looking for YouTube link " + YouTubeSy);
  let splited = courseName.split(' ');
  let combined = "+";
  for (let i = 0; splited[i]; i++) {
    combined += splited[i];
    combined += '+';
  }
  sendText(id, "https://www.youtube.com/results?search_query=+" + combined + courseNumber);
}

function facebookHandler(id, courseNumber, courseName) {
  sendText(id, "Looking for facebook link" + facebookSy);
  let nameCheck = courseName.split('(');
  if (nameCheck.length > 1) {
    courseName = nameCheck[0];
  }
  let nameList = courseName.split(' ');
  let len = nameList.length;
  if (len > 1) {
    let tempName = "";
    for (let count = 0; count < len; count++) {
      tempName = tempName + "%20";
      tempName = tempName + nameList[count];
      courseName = tempName;
    }
  } else courseName = "%20" + courseName
  sendText(id, "https://www.facebook.com/search/top/?q=" + courseNumber + courseName + "&epa=SEARCH_BOX");
}

function scansHandler(id, number) {
  sendText(id, "https://testock.tk/course/" + number);
  return;
}

//handler using sheets
function facultyGroupHandler(id, data) {
  let facultyEX = SpreadsheetApp.openByUrl(facultyRidesExel);
  let faculties = facultyEX.getActiveSheet();
  let row = faculties.createTextFinder(data).findNext();
  let i = row.getRow();
  let groupName = faculties.getRange(i, 3).getValue();
  let currLink = faculties.getRange(i, 2).getValue();
  sendText(id, currLink + ' - ' + groupName);
  if (groupName == 'סטודנטים בטכניון') sendText(id, 'https://teams.microsoft.com/l/team/19%3afde92135b254443db1e887147bbfdc09%40thread.skype/conversations?groupId=484ee060-222c-465a-9d1b-65803822e19f&tenantId=f1502c4c-ee2e-411c-9715-c855f6753b84 - Teams Group')
}

//handler using drive
function driveHandler(id, courseNumber, courseName) {
  let found = 0;
  let dApp = DriveApp;

  function sendText_IterateFolder(folderName){
    let folderItr = dApp.getFoldersByName(folderName);
    let folder = folderItr.next();
    let subFolderItr = folder.getFolders();
    while (subFolderItr.hasNext()) {
      let subFolder = subFolderItr.next();
      let currFolderName = subFolder.getName();
      if (currFolderName.indexOf(courseNumber) !== -1) {
        found = true;
        sendText(id, currFolderName);
        sendText(id, subFolder.getUrl());
        return;
      }
    }
  }

  sendText(id, "Searching in CS..");
  sendText_IterateFolder("Technion CS");

  sendText_IterateFolder("קורסים מדעיים");

  sendText_IterateFolder("קורסים הומניים");

  sendText(id, "Searching in Industrial Engineering and Management..");
  sendText_IterateFolder("Technion Drive - Public")

  sendText(id, "Searching in Electrical Engineering..");
  sendText_IterateFolder("הנדסת חשמל טכניון");


  sendText(id, "Searching in Mechanical engineering..");
  sendText_IterateFolder("הנדסת מכונות - דרייב פקולטי");

  sendText(id, "Searching in Physics..");
  sendText_IterateFolder("PhysicsDrive");

  sendText(id, "Searching in Aerospace Engineering..");
  let folderItr = dApp.getFoldersByName("טכניון");
  let folder = folderItr.next();
  let semestersItr = folder.getFolders();
  while (semestersItr.hasNext()) {
    let semesters = semestersItr.next();
    let subFolderItr = semesters.getFolders();
    while (subFolderItr.hasNext()) {
      let subFolder = subFolderItr.next();
      let currFolderName = subFolder.getName();
      if (currFolderName.indexOf(courseName) !== -1) {
        found = true;
        sendText(id, currFolderName);
        sendText(id, subFolder.getUrl());
        return;
      } else if (currFolderName.indexOf(courseNumber) !== -1) {
        found = true;
        sendText(id, currFolderName);
        sendText(id, subFolder.getUrl());
        return;
      }
    }
  }
  if (!(found)) {
    sendText(id, "sorry \u2639, can't find the drive for this course...");
    return;
  } else {
    sendText(id, 'Done');
  }
}

//adds a course to the list. Can be deleted after automation
function courseAdd(id, courseNumber, courseName, link, courses) {
  if (courseNumber == "" || courseNumber == 0) {
    sendText(id, "Wrong course number", mainKeyBoard);
    return;
  }
  let list = courses.createTextFinder(courseNumber).findAll();
  if (list.length >= 1) {
    sendKey(id, "The course is already registered", mainKeyBoard);
  } else {
    let i = courses.getRange(numberOfCourses, numberOfReviews).getValue();
    if (i == numberOfCourses) {
      sendKey(id, 'The list is full', mainKeyBoard);
      return;
    }
    courses.getRange(i, 1).setValue(courseNumber);
    courses.getRange(i, 2).setValue(courseName);
    if (link) courses.getRange(i, 3).setValue(link);
    sendText(id, courseNumber + ' - ' + courseName + " course is added, thank you for the information \uD83D\uDE4F");
    courses.getRange(numberOfCourses, numberOfReviews).setValue(++i);
  }
}

//not so useful feature, probably goes down
function reviewsHandler(id, i, courses, isAll) {
  sendText(id, "Looking for reviews " + reviewsSy);
  let j = 7;
  while (courses.getRange(i, j).getValue()) {
    sendText(id, courses.getRange(i, j).getValue());
    j++;
  }
  if (j == 7) {
    if (!(isAll)) sendText(id, "sorry \u2639 there is no reviews for this course yet");
    return;
  }
}

//important function set(id, data, name, num)
//Description: the function changes the cell in the sheets according to the data and num letiables. 
//That way the bot can "remember" the previous commands in order to complete the commands.
//input: user id, data(string) that determines the state of the student in the sheets,
//name of the user and num that most of the time is the number of the course
function set(id, data, name, num) {
  let app = SpreadsheetApp.openByUrl(userExel);
  let ss = app.getActiveSheet();
  let rowFinder = ss.createTextFinder(id);
  let row = rowFinder.findNext();
  while (row !== null && row.getColumn() !== 1) row = rowFinder.findNext();
  if (row !== null) {
    row = row.getRow();
    // sendText(id, row);//test
    ss.getRange(row, 2).setValue(data);
    if (name) ss.getRange(row, 3).setValue(name);
    if (num) ss.getRange(row, 4).setValue(num);
    return;
  } else {
    //   sendText(id, row);//test
    let next = ss.getRange(2, 4).getValue();
    if (next == numberOfCourses) {
      // Fetch the email address
      let emailAddress = "technobot404@gmail.com";
      // Send Alert Email.
      let message = "The 'mode' list is full!!";
      let subject = 'You have a problem in TBot';
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

//functions that runs once a day and updates the courses according to ug updates
function getCourses() {
  let urlCourses = "https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_";
  let year = "2020";
  let semesterNum = "01";
  let response = UrlFetchApp.fetch(urlCourses + year + semesterNum + ".min.js");
  response = response.getContentText();
  return response;
}

function updateCourses() {
  let str = getCourses();
  let crs = SpreadsheetApp.openByUrl(courseExel).getActiveSheet();
  while (str.indexOf("general") !== -1) {
    let crsSil, crsKdam, crsProf, crsA, crsB;
    str = str.slice(str.indexOf("general"));
    str = str.slice(str.indexOf("פקולטה"));
    str = str.slice(str.indexOf(":"));
    str = str.slice(2);
    let crsFaculty = str.slice(0, str.indexOf('"'));
    str = str.slice(str.indexOf("שם מקצוע"));
    str = str.slice(str.indexOf(":"));
    str = str.slice(2);
    let crsName = str.slice(0, str.indexOf('"'));
    str = str.slice(str.indexOf("מספר מקצוע"));
    str = str.slice(str.indexOf(":"));
    str = str.slice(2);
    let crsNum = str.slice(0, str.indexOf('"'));
    let silIndex = str.indexOf("סילבוס");
    if (silIndex !== -1) {
      str = str.slice(str.indexOf("סילבוס"));
      str = str.slice(str.indexOf(":"));
      str = str.slice(2);
       crsSil = str.slice(0, str.indexOf('"'));
    }
    let kdamIndex = str.indexOf("מקצועות קדם")
    if (kdamIndex !== -1) {
      str = str.slice(str.indexOf("מקצועות קדם"));
      str = str.slice(str.indexOf(":"));
      str = str.slice(2);
       crsKdam = str.slice(0, str.indexOf('"'));
    }
    let profIndex = str.indexOf("אחראים");
    if (profIndex !== -1) {
      str = str.slice(str.indexOf("אחראים"));
      str = str.slice(str.indexOf(":"));
      str = str.slice(2);
       crsProf = str.slice(0, str.indexOf('"'));
    }
    let AIndex = str.indexOf("מועד א");
    if (AIndex !== -1) {
      str = str.slice(str.indexOf("מועד א"));
      str = str.slice(str.indexOf(":"));
      str = str.slice(2);
       crsA = str.slice(0, str.indexOf('"'));
    }
    let BIndex = str.indexOf("מועד ב");
    if (BIndex) {
      str = str.slice(str.indexOf("מועד ב"));
      str = str.slice(str.indexOf(":"));
      str = str.slice(2);
       crsB = str.slice(0, str.indexOf('"'));
    }
    let courseFinder = crs.createTextFinder(crsNum);
    let cell = courseFinder.findNext();
    let nextFreeRow;
    if (!(cell)) {
      nextFreeRow = crs.getRange(1292, 1).getValue();
      crs.getRange(1292, 1).setValue(nextFreeRow + 1);
      crs.getRange(nextFreeRow, 5).setValue(crsFaculty);
      crs.getRange(nextFreeRow, 2).setValue(crsName);
      crs.getRange(nextFreeRow, 1).setValue(crsNum);
      if (silIndex) crs.getRange(nextFreeRow, 7).setValue(crsSil);
      if (kdamIndex) crs.getRange(nextFreeRow, 8).setValue(crsKdam);
      if (profIndex) crs.getRange(nextFreeRow, 9).setValue(crsProf);
      if (AIndex) crs.getRange(nextFreeRow, 10).setValue(crsA);
      if (BIndex) crs.getRange(nextFreeRow, 11).setValue(crsB);
      crs.getRange(1292, 1).setValue(++nextFreeRow);
    } else {
      nextFreeRow = cell.getRow();
      crs.getRange(nextFreeRow, 5).setValue(crsFaculty);
      //crs.getRange(nextFreeRow, 2).setValue(crsName);
      //crs.getRange(nextFreeRow, 1).setValue(crsNum);
      if (silIndex) crs.getRange(nextFreeRow, 7).setValue(crsSil);
      if (kdamIndex) crs.getRange(nextFreeRow, 8).setValue(crsKdam);
      if (profIndex) crs.getRange(nextFreeRow, 9).setValue(crsProf);
      if (AIndex) crs.getRange(nextFreeRow, 10).setValue(crsA);
      if (BIndex) crs.getRange(nextFreeRow, 11).setValue(crsB);
    }
  }
}

function getLinks() {
  let coursesExelNew = "https://docs.google.com/spreadsheets/d/1hkWNJhWBHJfsVWV-0DcMRphsJXE79JvuJAXhvlnC7OY/edit#gid=0";
  let newCrs = SpreadsheetApp.openByUrl(coursesExelNew);
  let crs = newCrs.getSheetByName('Courses');
  let old = SpreadsheetApp.openByUrl(courseExel).getActiveSheet();

  let row = 966;
  let courseNumber = old.getRange(row, 1).getValue();
  while (courseNumber !== -1) {
    let crsName = old.getRange(row, 2).getValue()
    let telegramLink = old.getRange(row, 3).getValue();
    let exelLink = old.getRange(row, 4).getValue();
    let teamsLink = old.getRange(row, 6).getValue();
    if (courseNumber == null || courseNumber == "" || courseNumber == 0) {

    } else {
      let courseFinder = crs.createTextFinder(courseNumber);
      let nextCourse = courseFinder.findNext();
      while (nextCourse !== null && nextCourse.getColumn() !== 1) {
        let nextCourse = courseFinder.findNext();
      }
      if (nextCourse) {
        let courseRow = nextCourse.getRow();
        crs.getRange(courseRow, 3).setValue(telegramLink);
        crs.getRange(courseRow, 4).setValue(exelLink);
        crs.getRange(courseRow, 6).setValue(teamsLink);
      } else {//add course
        let nextFreeRow = crs.getRange(1, 2).getValue();
        crs.getRange(nextFreeRow, 2).setValue(crsName);
        crs.getRange(nextFreeRow, 1).setValue(courseNumber);
        crs.getRange(nextFreeRow, 3).setValue(telegramLink);
        crs.getRange(nextFreeRow, 4).setValue(exelLink);
        crs.getRange(nextFreeRow, 6).setValue(teamsLink);
        crs.getRange(1, 2).setValue(++nextFreeRow);
      }
    }
    courseNumber = old.getRange(++row, 1).getValue();
  }
}


//function that makes an internal keyboard from the numbers in the spreadsheet.
function makeKeyBoard(id, names, numbers) {
  let num = names.length;
  let newKeyBoard = [];
  for (let i = 0; i < num; i++) {
    //sendText(id, names[i] + " - " + numbers[i]);//test
    newKeyBoard.push([{"text": names[i], 'callback_data': numbers[i]}]);
  }
  newKeyBoard.push([{"text": 'Main Menu \ud83c\udfe0', 'callback_data': 'Main Menu \ud83c\udfe0'}]);
  sendText(id, "Select from the list below", newKeyBoard);
}

//keyBoards
let mainKeyBoard = [
  [{text: course}, {text: "My Courses \ud83d\udccc"}],
  [{text: SFS}, {text: help}],
  [{text: ride}, {text: faculty}],
  [{text: usefulLink}],//{text: add}
  [{text: feedback}],
  [{text: About}]
]

let rideKeyBoard = [
  [{text: "אזור ירושליים"}, {text: "אזור תל אביב-יפו והמרכז"}, {text: "אזור חיפה והצפון"}],
  [{text: "אזור השפלה והדרום"}, {text: "אזור השרון"}, {text: "טרמפים בפייסבוק"}],
  [{text: "תפריט ראשי"}]
]
let jeKeyBoard = [
  [{text: "מעלה אדומים"}, {text: "ביתר עילית"}],
  [{text: "ירושלים"}, {text: "בית שמש"}],
  [{text: "רשימת אזורים"}],
  [{text: "תפריט ראשי"}]
]
let teKeyBoard = [
  [{text: "חולון"}, {text: "תל אביב-יפו"}, {text: "קרית אונו"}],
  [{text: "אור יהודה"}, {text: "יהוד-מונוסון"}, {text: "רמת השרון"}],
  [{text: "בת ים"}, {text: "גבעתיים"}, {text: "בני ברק"}],
  [{text: "רמת גן"}, {text: "פתח תקוה"}, {text: "אלעד"}],
  [{text: "אריאל"}, {text: "ראש העין"}, {text: "ראשון לציון"}],
  [{text: "רשימת אזורים"}],
  [{text: "תפריט ראשי"}]
]
let heKeyBoard = [
  [{text: "טבריה"}, {text: "קרית שמונה"}, {text: "צפת"}],
  [{text: "מגדל העמק"}, {text: "עפולה"}, {text: "נשר"}],
  [{text: "חיפה"}, {text: "טירת כרמל"}, {text: "אור עקיבא"}],
  [{text: "קרית אתא"}, {text: "קרית מוצקין"}, {text: "קרית ביאליק"}],
  [{text: "קרית ים"}, {text: "כרמיאל"}, {text: "מעלות-תרשיחא"}],
  [{text: "יקנעם"}, {text: "נהריה"}, {text: "עכו"}],
  [{text: "חדרה"}, {text: "נצרת"}, {text: "בית שאן"}],
  [{text: "רשימת אזורים"}],
  [{text: "תפריט ראשי"}]
]
let soKeyBoard = [
  [{text: "ערד"}, {text: "דימונה"}, {text: "באר שבע"}],
  [{text: "רהט"}, {text: "רמלה"}, {text: "מודיעין-מכבים-רעות"}],
  [{text: "יבנה"}, {text: "רחובות"}, {text: "נס ציונה"}],
  [{text: "לוד"}, {text: "קרית מלאכי"}, {text: "קרית גת"}],
  [{text: "אשדוד"}, {text: "אשקלון"}, {text: "שדרות"}],
  [{text: "אילת"}, {text: "נתיבות"}],
  [{text: "רשימת אזורים"}],
  [{text: "תפריט ראשי"}]
]
let shKeyBoard = [
  [{text: "רעננה"}, {text: "הוד השרון"}, {text: "הרצליה"}],
  [{text: "כפר סבא"}, {text: "נתניה"}, {text: "טירה"}],
  [{text: "רשימת אזורים"}],
  [{text: "תפריט ראשי"}]
]
let usefulKeyBoard = [
  [{text: "Technion Students FAQ (doc)"}, {text: "useful links from facebook (doc)"}],
  [{text: "cheese&fork"}, {text: "scans - cf"}, {text: "testock"}],
  [{text: "moodle " + moodleSy}, {text: "ug " + ugSy}, {text: calendar}],
  [{text: "ASA"}, {text: "אסט"}, {text: "Copiers and printers"}],
  [{text: "MyDegree"}, {text: Corona}],
  [{text: mainMenu}]
]
let printKeyBoard = [
  [{text: "A4 B&W single sided"}, {text: "A4 B&W two sided"}],
  [{text: "A4 Color single sided"}],
  [{text: "A3 B&W single sided"}, {text: "A3 B&W two sided"}],
  [{text: "A3 Color single sided"}],
  [{text: "B&W 2 slides per page, single sided"}, {text: "B&W 2 slides per page, two sided"}],
  [{text: "B&W 4 slides per page, single sided"}, {text: "B&W 4 slides per page, two sided"}],
  [{text: mainMenu}]
]

let coursesKeyBoard = [
  [{text: "סטודנטים בטכניון"}],
  [{text: "מדעי המחשב"}, {text: 'הנדסת חשמל'}, {text: 'הנדסת מכונות'}],
  [{text: 'הנדסה אזרחית וסביבתית'}, {text: 'הנדסת תעשייה וניהול'}, {text: 'הנדסה ביו-רפואית'}],
  [{text: 'הנדסה כימית'}, {text: 'הנדסת ביוטכנולוגיה ומזון'}, {text: 'מדע והנדסה של חומרים'}],
  [{text: 'הפקולטה למתמטיקה'}, {text: 'הפקולטה לכימיה'}, {text: 'הפקולטה לפיסיקה'}],
  [{text: 'הפקולטה לביולוגיה'}, {text: 'רפואה'}, {text: 'ארכיטקטורה ובינוי ערים'}],
  [{text: 'חינוך למדע וטכנולוגיה'}, {text: 'הפקולטה להנדסת אוירונוטיקה וחלל'}],
  [{text: 'חזור'}],
  [{text: "תפריט ראשי"}]
]

let ridesBackKeyBoard = [
  [{text: "רשימת אזורים"}],
  [{text: "תפריט ראשי"}]
]

let allKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}],
  [{text: drive}, {text: testock}],
  [{text: facebook}],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let gallKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}],
  [{text: drive}, {text: courseGroup}, {text: testock}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let tgallKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}],
  [{text: drive}, {text: courseGroup}, {text: testock}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]


let tallKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}],
  [{text: drive}, {text: testock}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let csKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}, {text: cs}],
  [{text: drive}, {text: testock}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let tcsKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}, {text: cs}],
  [{text: drive}, {text: testock}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let gcsKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}, {text: cs}],
  [{text: drive}, {text: courseGroup}, {text: testock}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let tgcsKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}, {text: cs}],
  [{text: drive}, {text: courseGroup}, {text: testock}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let exelKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}],
  [{text: drive}],
  [{text: testock}, {text: "All tests - exel"}],
  [{text: facebook}, {text: 'Panopto'},],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let texelKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}],
  [{text: drive}, {text: 'Teams Group \ud83d\udc6a'}],
  [{text: testock}, {text: "All tests - exel"}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let gexelKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}],
  [{text: drive}, {text: courseGroup}],
  [{text: testock}, {text: "All tests - exel"}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let tgexelKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}],
  [{text: drive}, {text: courseGroup}, {text: 'Teams Group \ud83d\udc6a'}],
  [{text: testock}, {text: "All tests - exel"}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let exelCsKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}, {text: cs}],
  [{text: drive}],
  [{text: testock}, {text: "All tests - exel"}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let texelCsKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}, {text: cs}],
  [{text: drive}, {text: 'Teams Group \ud83d\udc6a'}],
  [{text: testock}, {text: "All tests - exel"}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let gexelCsKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}, {text: cs}],
  [{text: drive}, {text: courseGroup}],
  [{text: testock}, {text: "All tests - exel"}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let tgexelCsKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: "Get all"}],
  [{text: ug}, {text: moodle}, {text: cs}],
  [{text: drive}, {text: courseGroup}, {text: 'Teams Group \ud83d\udc6a'}],
  [{text: testock}, {text: "All tests - exel"}],
  [{text: facebook}, {text: 'Panopto'}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let malagKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: ug}, {text: moodle}],
  [{text: facebook}],
  [{text: "Add telegram group"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let gmalagKeyBoard = [
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: ug}, {text: moodle}],
  [{text: courseGroup}, {text: facebook}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let tmalagKeyBoard = [
  [{text: ug}, {text: moodle}],
  [{text: courseGroup}, {text: facebook}],
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let tgmalagKeyBoard = [
  [{text: ug}, {text: moodle}],
  [{text: courseGroup}, {text: facebook}],
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let sportKeyBoard = [
  [{text: "Course info"}],
  [{text: "Add telegram group"}],
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]

let gsportKeyBoard = [
  [{text: courseGroup}],
  [{text: "Course info"}],
  [{text: "Add to my course list \ud83d\udccd"}, {text: "My Courses \ud83d\udccc"}],
  [{text: mainMenu}, {text: "Search For Another Course"}]
]


let contactKeyBoard = [
  [{text: "Git"}],
  [{text: ContactLinkedIn}, {text: ContactEmail}],
  [{text: mainMenu}]
]

let settingsKeyBoard = [
  [{text: "Gender"}],
  [{text: "Faculty"}],
  [{text: "Topic"}],
  [{text: "Change helper"}],
  [{text: "Back"}],
  [{text: mainMenu}]
]

let genderKeyBoard = [
  [{text: "Male"}],
  [{text: "Female"}],
  [{text: "Back"}],
  [{text: mainMenu}]
]

let topicKeyBoard = [
  [{text: "Studies"}],
  [{text: "Emotional Distress"}],
  [{text: "Military experiences"}],
  [{text: "Violence or harassment"}],
  [{text: "Back"}],
  [{text: mainMenu}]
]

let helpKeyBoard = [
  [{text: "Settings and Preference"}],
  [{text: WantToTalk}],
  [{text: WantToHelp}],
  [{text: mainMenu}]
]

let busiKeyBoard = [
  //[{ text : "Location"}],
  [{text: "Get in Contact"}],
  //[{ text: "Prices"}],
  [{text: mainMenu}]
]

let busiEditKeyBoard = [

  [{text: "Password"}],
  [{text: "Description"}],
  [{text: "Business name"}],
  [{text: "Contact Information"}],
  [{text: mainMenu}]
]

