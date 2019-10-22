var token = "";
var url = "https://api.telegram.org/bot" + token;
var webAppUrl = "https://script.google.com/macros/s/AKfycbxEQjmNaZczXm-iLT7kDVA0tnrhcnkd1O0uovvCC4qeFrfXw6GK/exec";
var numberOfCourses = 1400; 
var numberOfReviews = 2*26; 

//symbols
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

var ride = "Ride groups (טרמפים) \ud83d\ude97";
var faculty = "Faculty groups \ud83c\udfeb";
var add = "Add course \ud83d\udcd7";
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


function getMe() {
  var response =  UrlFetchApp.fetch(url + "/getMe");
  Logger.log(response.getContentText());
}

function getUpdates() {
  var response =  UrlFetchApp.fetch(url + "/getUpdates");
  Logger.log(response.getContentText());
}

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

function doPost(e){
  var userEX = SpreadsheetApp.openByUrl("");
  var users = userEX.getActiveSheet();
  var coursesEX = SpreadsheetApp.openByUrl("")
  var courses = coursesEX.getActiveSheet();
  var contents = JSON.parse(e.postData.contents);
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
    else{
      var list = courses.createTextFinder(data).findAll();
      if (list.length == 1){
        sendOpt(id, name, courses, list[0].getRow());
      }
    }
  }
  else if (contents.message){
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
   
    if (text == "/start" || text == "hey" || text == 'היי' || text == "hello" || text == 'hi'){
      sendText(id, "Hi " + name + " \ud83d\udc4b, welcome to Tbot \ud83d\udcd6");
      sendKey(id, "How may I help you?", mainKeyBoard);
      set(id, 0, name, 0);
    }    
    else if (text == 'תפריט ראשי' || text == 'Main menu' || text == mainM){
      sendKey(id, "How may I help you?", mainKeyBoard);
      set(id, 0, name, 0);
    }
    else if (text == ride || text == 'רשימת אזורים'){
      sendKey(id, "Send the required city name or choose your region from the list below " + downSy, rideKeyBoard);
      set(id, "Ride");
    }
    else if (text == course || text == 'Another course'){
      removeKey(id, "Please insert the course number or course name in hebrew");
      set(id, "Course", name, 0);
    }
    else if (text == usefulLink){
      sendKey(id,"Here are some useful links for you" ,usefulKeyBoard);   
      set(id, 0);
    }
    else if (text == faculty){
      sendKey(id, "Choose your faculty from the list below ", coursesKeyBoard);
      set(id, 'faculty');
    }
    else if (text == feedback || text == "/feedback"){
      removeKey(id, "You can send your feedback now");
      set(id, 'feedback');
    }
    else if (text == calendar){
      sendKey(id,"http://www.admin.technion.ac.il/dpcalendar/Student.aspx" ,usefulKeyBoard);   
      set(id, 0);
    }
    else if (text == "אזור תל אביב-יפו והמרכז" || text == "אזור ירושליים" || text == "אזור חיפה והצפון" 
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
    }
    else if (text == "טרמפים בפייסבוק"){
      sendText(id, "https://www.facebook.com/groups/301410316636087/"+" - "+"טרמפים יוצאים מהטכניון");
      sendText(id, "https://www.facebook.com/groups/135704829788347/"+ " - " + "טרמפים נכנסים לטכניון");
      sendKey(id, "מה תרצה לעשות כעת?",  ridesKeyBoard);
    }
    else if (text == drive || text == courseGroup || text == reviews || text == 'Get all' || text == facebook
             || text == youTube || text == ug || text == cs || text == 'All tests - exel'
             || text == moodle || text == testock ||  text == "Course info"){
      getDone(id, name, text, users, courses);
    }
    else if (text == 'Write a review'){
      removeKey(id, "Please write  your review");
      set(id, text);
    }
    else if (text == add){
      set(id, 'Add course');
      removeKey(id, "Please insert the course number, course name and group link in the following format:"
               + " course number-course name-group link");
    }
    else if (text == 'Add telegram group'){
      set(id, text);
      sendText(id, "Please insert the group link");
      sendText(id, "Note: to get a group link you need to open a group, then go to: Manage group (or click the edit symbol using smartphone) -> Group type -> Copy link");
      sendText(id, "Don't forget to make the group visible so new members will see messages that were sent before they joined");
    }  
    else if (text == "scans - cf"){
     sendText(id, "https://tscans.cf/");
    }
    else if (text == 'Technion Students FAQ (doc)'){
      sendText(id,"https://docs.google.com/document/d/1XGWWns6IZy9QpsAhWZu_WxIQTXYbRVeAV3XGr6pcMpc/edit?fbclid=IwAR1bBn5g3NBdxf2JFPbeWinOmQ3F0qa2KxlQGlMZ5wPyr31l0yRfo7ESPLc");
    }
    else if (text == 'useful links from facebook (doc)'){
      sendText(id,"https://docs.google.com/document/d/1tR8X8YawbK_h2VwQU1k1Fz4q12B0nWxOMSqxE_hV2sw/"+
               "edit?fbclid=IwAR1cQkxt1PG-gFwF_QWPG80u9ZNYuVwwBlWwmCes5MLst1ERmAIGijH8BRM");
    }
    else if (text == 'cheese&fork'){
      sendKey(id,"https://cheesefork.cf/",usefulKeyBoard);
    }
    else if (text == 'testock'){
      sendKey(id,"https://testock.tk/courses",usefulKeyBoard);
    }
    else if (text == 'ug '+ugSy) {
      sendKey(id, 'https://ug3.technion.ac.il/rishum/search',usefulKeyBoard );
    } 
    else if (text == 'moodle '+moodleSy){
      sendKey(id, 'https://moodle.technion.ac.il/',usefulKeyBoard );
    }
    else if (text == 'אסט'){
      sendKey(id,"http://www.asat.org.il/",usefulKeyBoard);
    }
    else if (text == 'ASA'){
      sendKey(id,"https://www.asatechnion.co.il/",usefulKeyBoard);
    }
    else{ //find id and get data
      var row = users.createTextFinder(id).findAll();
      if (row.length == 1){
        if (row[0]){
          var idRow = row[0].getRow();
          var mode = users.getRange(idRow, 2).getValue();
          if (!(mode)){
            sendKey(id, "How may I help you?", mainKeyBoard);
          }
          else if (mode == 'feedback'){
              // Fetch the email address
              var emailAddress = "technobot404@gmail.com";
              // Send Alert Email.
              var message = text; 
              var subject = 'You have a new feedback from technoBot user';
              MailApp.sendEmail(emailAddress, subject, message);
              sendText(id, "Thank you for your feedback! \uD83D\uDE4F");
              set(id, 0, name, 0);
              sendKey(id, "What would you like to do next?", mainKeyBoard);
          }
          else if (mode == 'Ride'){
            var RidesEX = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1FBPyg4vIb42EH0DpUbSIDEFiCcJGfCsmdHXsipyxyQU/edit#gid=0");
            var Rides = RidesEX.getActiveSheet();
            var list = Rides.createTextFinder(text).findAll()
            if (list.length > 0){
              var row = list[0].getRow();
              var name = Rides.getRange(row,1).getValue();
              var link = Rides.getRange(row,3).getValue();
              sendText(id, link + ' - ' + name);
            }
          }
          else if (mode == 'Add course'){
            if (!(courseNumber) || !(courseName)){
              sendText(id, "Wrong format. please inset your review in the followog format: course number-course name-group link");
              sendKey(id, "What would you like to do next?", mainKeyBoard);
            }
            else{
              courseAdd(id, courseNumber, courseName, courseLink, courses);
              set(id, 0);
              sendKey(id, "What would you like to do next?", mainKeyBoard);
            }
          }
          else if (mode == 'Write a review'){
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
              var j = 6;
              while (courses.getRange(courseRow,j).getValue()){
                j++;
              }
              courses.getRange(courseRow,j).setValue(text);
              sendText(id, "Your review is added to " + courseNumber + ' ' + courseName);
              sendKey(id, "What would you like to do next?", mainKeyBoard);
              set(id, 0, name, 0);
            }
          }
          else if (mode == 'Add telegram group'){
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
          }
          else if (mode == 'Add exams exel'){
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
          }
          else if (mode == 'faculty'){
            facultyGroupHandler(id, text);
          }
          else if (mode == 'Course'){
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
                    courseNames.push(courseName);
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
          }
        }
      }
    }
  }
}

function sendOpt(id, name, courses, courseRow){
  var exel = false;
  var cs = false;
  set(id, 'Course', name, courseRow);
  var courseNumber = courses.getRange(courseRow, 1).getValue();
  var courseName = courses.getRange(courseRow, 2).getValue();
  var mode = courses.getRange(courseRow, 5).getValue();
  var link = courses.getRange(courseRow, 3).getValue();
  if (mode == 1){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", gmalagKeyBoard);
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
  if (exel && cs){
    sendText(id, courseName + " - "+ courseNumber );
    if (link) sendKey(id, "choose the required information", gexelCsKeyBoard);
    else sendKey(id, "choose the required information", exelCsKeyBoard);
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
    var csCourse = false;
    if ((courseNumber.indexOf('236') !== -1) || (courseNumber.indexOf('234') !== -1)){
      csCourse = true;
    }
    switch(command){
      case drive:
        sendText(id, "Looking for a link to the drive "+ driveSy);
        driveHandler(id, courseNumber, courseName);
        break;
      case courseGroup:
        sendText(id, "Looking for telegram group" + groupSy);
        if (group) sendText(id, group);
        else sendText(id, "There is no telegram group for this course yet. you can open and add a groupby using 'Add group'")
        break;
      case testock:
        sendText(id, "Looking for a link to the test scans " + scansSy);
        scansHandler(id, courseNumber);
        break;
      case 'All tests - exel':
        sendText(id, "Looking for a link to the tests exel " + groupSy);
        sendText(id, exel);
        break;
      case reviews:
        reviewsHandler(id, courseRow, courses, 0);
        break;
      case facebook:
        facebookHandler(id, courseNumber, courseName);
        break;
      case youTube:
        youtubeHandler(id, courseNumber, courseName)
        break;
      case ug:
        sendText(id, "Looking for ug link " + ugSy);
        sendText(id, "https://ug3.technion.ac.il/rishum/course/"+courseNumber);
        break;
      case cs:
        sendText(id, "Looking for computer science link " + csSy);
        sendText(id, "https://webcourse.cs.technion.ac.il/"+courseNumber);
        break;
      case moodle:
        sendText(id, "Looking for moodle link " + moodleSy);
        sendText(id, "https://moodle.technion.ac.il/course/search.php?search="+courseNumber);
        break;
      case  "Course info":
        sendText(id, "Looking for info link ");
        sendText(id, "https://asatechnion.co.il/courses/syllabus"+courses.getRange(courseRow, 4).getValue()+".pdf");
        break;
      case 'Get all':
        if (group){
          sendText(id, "Looking for a link to the telegram group " + groupSy);
          sendText(id, group);
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

function facultyGroupHandler(id, data){
  var facultyEX = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1FBPyg4vIb42EH0DpUbSIDEFiCcJGfCsmdHXsipyxyQU/edit#gid=0");
  var faculties = facultyEX.getActiveSheet();
  var row = faculties.createTextFinder(data).findNext();
  var i = row.getRow();
  var groupName = faculties.getRange(i,3).getValue();
  var currLink = faculties.getRange(i,2).getValue();
  sendText(id, currLink + ' - ' + groupName);
}

function scansHandler(id, number){
  sendText(id, "https://testock.tk/course/"+number);
  return;
}


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
    }
  }
  if (found) return;
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
      }
    }
  }
  if (found) return;
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
  

function reviewsHandler(id, i, courses, isAll){
  sendText(id, "Looking for reviews " + reviewsSy);
  var j = 6;
  while (courses.getRange(i,j).getValue()){
    sendText(id, courses.getRange(i,j).getValue());
    j++;
  }
  if (j==6){
    if (!(isAll)) sendText(id, "sorry \u2639 there is no reviews for this course yet");
    return;
  }
}

function set(id, data, name, num){
  var app = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1-dDwwSXJZTNGSPZXEI4QVKT2hivW8TE7FXb3A9esKBc/edit?usp=sharing");
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
    var next = ss.getRange(1, 4).getValue();
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
    ss.getRange(1, 4).setValue(++next);
    return;
  }
}

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
  [{text: course }],
  [{ text: ride}, { text: usefulLink}, { text: faculty }],
  [{ text: feedback }, { text: add }]
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
  [{ text: "רמת גן" }, { text: "פתח תקוה" }, { text: "אלעד" }],
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
  [{ text: "ASA" }, { text: "אסט" }], 
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
  [{ text: 'הפקולטה למתמטיקה' }, { text: 'הפקולטה לכימיה' }, { text: 'הפקולטה לפיסיקה' }, {text: 'הפקולטה לביולוגיה'}],
  [{ text: 'רפואה' }, { text: 'ארכיטקטורה ובינוי ערים' }, { text: 'חינוך למדע וטכנולוגיה' }],
  [{ text: "תפריט ראשי" }]
]

var ridesBackKeyBoard = [
  [{ text: "רשימת אזורים" }],
  [{ text: "תפריט ראשי" }]
]

var allKeyBoard = [
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: testock }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var gallKeyBoard = [
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: courseGroup }, { text: testock }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var csKeyBoard = [
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: testock }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var gcsKeyBoard = [
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: courseGroup }, { text: testock }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var exelKeyBoard = [
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var gexelKeyBoard = [
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }],
  [{ text: drive }, { text: courseGroup }],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var exelCsKeyBoard = [
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var gexelCsKeyBoard = [
  [{ text: "Get all" }],
  [{ text: ug }, { text: moodle }, { text: cs }],
  [{ text: drive }, { text: courseGroup }],
  [{ text: testock }, { text: "All tests - exel" }],
  [{ text: facebook }, { text: youTube },  { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var malagKeyBoard = [
  [{ text: ug }, { text: moodle }],
  [{ text: facebook }, { text: reviews }],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var gmalagKeyBoard = [
  [{ text: ug }, { text: moodle }],
  [ { text: courseGroup }, { text: facebook }, { text: reviews }],
  [{ text: "Write a review" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var sportKeyBoard = [
  [{ text: reviews }],
  [{ text: "Course info"}],
  [{ text: "Write a review" }, { text: "Add telegram group" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]

var gsportKeyBoard = [
  [{ text: courseGroup }, { text: reviews }],
  [{ text: "Course info"}],
  [{ text: "Write a review" }],
  [{ text: "Another course" }],
  [{ text: mainM }]
]
  

var allBackKeyBoard = [
  [{ text: "Back"}],
  [{ text: mainM}]
]
