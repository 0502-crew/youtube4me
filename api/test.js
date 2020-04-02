/**
           * Parse the duration.
           * Example PT5H57M51S = 5 hours 57 minutes 51 seconds
           * But it does not have a value if the value is 0. Eg. PT5H51S = 5 hours 0 minutes 51 seconds
           */
          let duration = 'PT5M';
          let hours = '00';
          let minutes = '00';
          let seconds = '00';
          console.log(duration);
          duration = duration.replace('PT', '');
          console.log(duration);
          const hoursIndex = duration.indexOf('H');
          if (hoursIndex > -1) {
            hours = duration.substr(0, hoursIndex);
            if (hours.length === 1) {
              hours = '0' + hours;
            }
            duration = duration.slice(hoursIndex+1);
          }
          const minutesIndex = duration.indexOf('M');
          if (minutesIndex > -1) {
            minutes = duration.substr(0, minutesIndex);
            if (minutes.length === 1) {
              minutes = '0' + minutes;
            }
            duration = duration.slice(minutesIndex+1);
          }
          const secondsIndex = duration.indexOf('S');
          if (secondsIndex > -1) {
            seconds = duration.substr(0, secondsIndex);
            if (seconds.length === 1) {
              seconds = '0' + seconds;
            }
            duration = duration.slice(secondsIndex+1);
          }
          console.log(duration);
          console.log(`${hours}:${minutes}:${seconds}`)