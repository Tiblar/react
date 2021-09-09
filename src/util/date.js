export function getDisplayDate(year, month, day, clock) {
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  let compDate = new Date(year, month - 1, day);
  let diff = today.getTime() - compDate.getTime();
  if (compDate.getTime() === today.getTime()) {
    return "Today at " + clock;
  } else if (diff <= 24 * 60 * 60 * 1000) {
    return "Yesterday at " + clock;
  } else {
    return day + "/" + month + "/" + year;
  }
}

export function getShortDate(date) {

  let seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  interval = seconds / 604800;
  if (interval > 1) {
    return Math.floor(interval) + "w";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  return Math.floor(seconds) + "s";
}

export function formatDate(timestamp) {
  let date = new Date(timestamp);

  return getDisplayDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    })
  );
}

export function formatBreakDate(timestamp) {
  let date = new Date(timestamp);
  let displayDate = getDisplayDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      })
  );

  if(displayDate.startsWith("Today")) return "Today";
  if(displayDate.startsWith("Yesterday")) return "Yesterday";

  return displayDate;
}

/**
 * @param duration number of seconds
 * @returns {string}
 */
export function videoTime(duration)
{
  let hrs = ~~(duration / 3600);
  let mins = ~~((duration % 3600) / 60);
  let secs = ~~duration % 60;

  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

export function formatFullDate(timestamp) {
  let date = new Date(timestamp);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return (
    monthNames[date.getMonth()] +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear() +
    " at " +
    date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    })
  );
}

export function timeTillTime(datetime) {
  datetime = new Date(datetime).getTime();
  let now = new Date().getTime();

  if(isNaN(datetime)) return "";

  let milisec_diff = datetime - now;
  if (datetime < now) {
    return "";
  }

  let days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
  let hours = Math.floor(milisec_diff / 1000 / 60 / 60);
  let minutes = Math.floor(milisec_diff / 1000 / 60);

  let string = "";
  if(days > 0){
    string += days + " day" + (days === 1 ? "" : "s") + " ";
  }

  if(hours > 0){
    string += hours + " hour" + (hours === 1 ? "" : "s") + " ";
  }

  if(hours === 0 && minutes > 0){
    string += minutes + " minute" + (minutes === 1 ? "" : "s") + " ";
  }

  if(days === 0 && hours === 0 && minutes === 0){
    string = "A few seconds left."
  }

  return string;
}

export function dateRound(previous) {

  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = (new Date()) - new Date(previous);

  if (elapsed < msPerMinute) {
    let t = Math.round(elapsed/1000);
    return t + " second" + (t === 1 ? "" : "s") + ' ago';
  }

  else if (elapsed < msPerHour) {
    let t = Math.round(elapsed/msPerMinute);
    return t + " minute" + (t === 1 ? "" : "s") + ' ago';
  }

  else if (elapsed < msPerDay ) {
    let t = Math.round(elapsed/msPerHour);
    return t + " hour" + (t === 1 ? "" : "s") + ' ago';
  }

  else if (elapsed < msPerMonth) {
    let t = Math.round(elapsed/msPerDay);
    return t + " day" + (t === 1 ? "" : "s") + ' ago';
  }

  else if (elapsed < msPerYear) {
    let t = Math.round(elapsed/msPerMonth);
    return t + " month" + (t === 1 ? "" : "s") + ' ago';
  }

  else {
    let t = Math.round(elapsed/msPerYear);
    return t + " year" + (t === 1 ? "" : "s") + ' ago';
  }
}

export function secondsToTime(e){
  let h = Math.floor(e / 3600).toString().padStart(2,'0'),
      m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
      s = Math.floor(e % 60).toString().padStart(2,'0');

  if(h.endsWith("0") && h.startsWith("0")){
    return m + ':' + s;
  }

  return h + ':' + m + ':' + s;
}
