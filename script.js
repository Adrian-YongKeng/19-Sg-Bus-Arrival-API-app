const busStopIdInput = document.getElementById("busStopId");
const arrivalInfo = document.getElementById("arrivalInfo");

async function fetchBusArrival(busStopId) {
  const response = await fetch(`https://sg-bus-arrivals.sigma-schoolsc1.repl.co/?id=${busStopId}`);
  if (response.ok) {//ok status (200)
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching bus arrival data.");
  }
}

function formatArrivalData(arrivalData) {
  const buses = arrivalData.services;
  const formattedData = [];

  for (const bus of buses) {
    let arrivalTimeString ;
    
    if (bus.next_bus_mins <= 0) {
      arrivalTimeString = "Arriving";
    } else {
      arrivalTimeString = `${bus.next_bus_mins} min(s)`;
    }
    
    formattedData.push(` 
    <div>
     <strond>Bus ${bus.bus_no}</strong>: ${arrivalTimeString}
    </div>
    `)
  }
  formattedData.push(`<div>${buses.length} buses</div>`);
  return formattedData.join("");
}

let intervalId; //store the interval ID
function displayBusArrival(busStopId) {
 //Clear the previous interval if it exists 
  if (intervalId) {
    clearInterval(intervalId);
  }
//function to fetch and update arrival data
//const updateBusArrivalData = () => {
  function updateBusArrivalData() {
  arrivalInfo.innerHTML = "Loading...";
  fetchBusArrival(busStopId)
    .then((arrivalData) => {
      const formattedArrivalData = formatArrivalData(arrivalData);
    arrivalInfo.innerHTML = formattedArrivalData;
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  }
  updateBusArrivalData(); //fetch and update data immediately
  intervalId = setInterval(updateBusArrivalData,7000);//7000milliseconds= 7seconds
}

function getBusTiming () {
  const busStopId = busStopIdInput.value;
  displayBusArrival(busStopId);
}