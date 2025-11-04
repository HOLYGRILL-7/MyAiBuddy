let reminderCount = 0;
let hasCodedToday = false;
let reminderInterval = null;
let streak = parseInt(localStorage.getItem('codingStreak')) || 0;
let lastCodedDate = localStorage.getItem('lastCodedDate') || null;

//speak message
const speakMessage = (message) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.3; //speed 0.1 - 10
        utterance.pitch = 0.6; //pitch 0 - 2
        utterance.volume = 1.0; //volume 0 - 1

//trying to get a range of voices
const setVoice = () => {
    const voices = speechSynthesis.getVoices();
    if(voices.length > 0) {
        utterance.voice = voices[2];
        speechSynthesis.speak(utterance);

    }
}

//making sure voices are loaded
if(speechSynthesis.getVoices().length > 0){
    setVoice();
}else{
    speechSynthesis.onvoiceschanged = setVoice
}
 
    }
}


//display streak when page loads
const updateStreakDisplay = () => {
    const streakDisplay = document.getElementById('streak-display');
    if (streak > 0) {
        streakDisplay.textContent = `🔥 ${streak} day streak!`;
    } else {
        streakDisplay.textContent = "Start your streak today!";
    }
}

const showReminder = () => {
//dont bother if they have coded today
    if(hasCodedToday) return;
       
    reminderCount++;

    let message;
    if (reminderCount === 1) {
        message = "Yo!, have you coded today?"
    } else if (reminderCount === 2) {        
        message = "Okay, I'm getting concerned. CODE SOMETHING.";
    } else if (reminderCount === 3) {
        message = "Just checking in...any code yet?"
    } else if (reminderCount === 4) {
        message = "whistling...want me to keep quiet? Get up and go write some code.";        
    } else if (reminderCount >= 5) {
        message = "Bismark, I'm not getting off your back, just 10mins come on!" +  reminderCount;
    }
   
    const notif = new Notification(message);
    speakMessage(message);

     //setTimeout(function, delay)
    setTimeout(() => {
        notif.close()
    }, 3000);

}

//Midnight Reset Function
const resetAtMidnight = () => {
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, //for tomorrow
        0, 0, 0 //midnight
    )

    const TimeUntilMidnight = night.getTime() - now.getTime();

    setTimeout(() => {

        //check if they coded yesterday
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000). toDateString();

        if (lastCodedDate !== yesterday && lastCodedDate !== today){
            //streak broken
            streak = 0;
            localStorage.setItem("codingStreak", streak);
            new Notification('Streak Broken!', {
                body: "You didn't code yesterday. Start fresh today!"
            });
        }

        hasCodedToday = false;
        reminderCount = 0;


    //make buttons clickable again for this day
    document.getElementById("done-btn").textContent = "DONE! I Coded Today 🎉"
    document.getElementById("done-btn").disabled = false;

    if(!reminderInterval && Notification.permission === "granted"){
        reminderInterval = setInterval(showReminder, 10 * 60 * 1000);
    }

    //Good morning notification
    new Notification("Good morning Bismark! ☀️", {
        body:"His mercies are new every morning, and so is your code today, you got this"
    })
    speakMessage("Good morning Bismark!, His mercies are new every morning, and so is your code today, you got this");

    // update display after midnight
    updateStreakDisplay();

    resetAtMidnight(); //keep the cycle going forever with this inside call
    }, TimeUntilMidnight);

}


document.getElementById("notify-btn").addEventListener("click", ()=>{
    // check if browser supports notification
    if(!("Notification" in window)) {
        alert("Your browser does not support notifications")
        return;
    }


    //if notifications is granted
    if (Notification.permission === "granted") {
       showReminder();
    } else if(Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if(permission === "granted"){
        showReminder();

            }
        })
    }
}

);



document.getElementById("done-btn").addEventListener("click", () => {

       const today = new Date().toDateString();
    
    // Check if this is a new day
    if (lastCodedDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastCodedDate === yesterday) {
            // Consecutive day - increase streak!
            streak++;
        } else if (lastCodedDate === null) {
            // First time ever
            streak = 1;
        } else {
            // Missed days - reset streak
            streak = 1;
        }
        
        localStorage.setItem('codingStreak', streak);
        localStorage.setItem('lastCodedDate', today);
        lastCodedDate = today;
    }

    hasCodedToday = true;
    reminderCount = 0; //resets reminders to 0

    //stop the interval
    if(reminderInterval){
        clearInterval(reminderInterval);
    }

    //celebrate notification
    let celebrationMessage = "You did it! I am proud of you Bismark! 🎉";
    if (streak > 1) {
        celebrationMessage = `🔥 ${streak} DAYS IN A ROW! You're on fire! 💪`;
    }


    new Notification(celebrationMessage, {
        body: "See you tomorrow for more coding"
    });

    speakMessage(celebrationMessage);

    //change the text in the button
    document.getElementById("done-btn").textContent = "✅ Coded Today!"
    document.getElementById("done-btn").disabled = true;

       // update the display
    updateStreakDisplay();
})

//AUTO Reminder after every 5 minutes
//starts after permissions is allowed

if(Notification.permission === "granted"){
     reminderInterval = setInterval(showReminder, 10 * 60 * 1000);
}

resetAtMidnight(); // kick start the cycle
updateStreakDisplay();