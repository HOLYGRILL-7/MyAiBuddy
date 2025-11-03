let reminderCount = 0;
let hasCodedToday = false;
let reminderInterval = null;

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
    //setTimeout(function, delay)
    const notif = new Notification(message)
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
    hasCodedToday = true;
    reminderCount = 0; //resets reminders to 0

    //stop the interval
    if(reminderInterval){
        clearInterval(reminderInterval);
    }

    //celebrate notification
    new Notification("You did it!. I am proud of you Bismark!", {
        body: "See you tomorrow for more coding"
    });

    //change the text in the button
    document.getElementById("done-btn").textContent = "✅ Coded Today!"
    document.getElementById("done-btn").disabled = true;
})

//AUTO Reminder after every 5 minutes
//starts after permissions is allowed

if(Notification.permission === "granted"){
     reminderInterval = setInterval(showReminder, 10 * 60 * 1000);
}

resetAtMidnight(); // kick start the cycle