
// sends a POST request to the Uber API to get a Ride Estimate.
export const uberRequestEstimate = (startLatitude, startLongitude, endLatitude, endLongitude) =>
    fetch("https://cors-anywhere.herokuapp.com/https://api.uber.com/v1.2/requests/estimate", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer KA.eyJ2ZXJzaW9uIjoyLCJpZCI6IkRuYzhjNWJiUS9hY0pDelh6bWxNekE9PSIsImV4cGlyZXNfYXQiOjE1MjM1NDQ0MTEsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.puIrNw2owaDLTvZW_GWzrL3vMAtYsr1_VWjQCzsMFTI"
      },
      body: JSON.stringify({
      "start_latitude": `${startLatitude}`,
       "start_longitude": `${startLongitude}`,
       "end_latitude": `${endLatitude}`,
       "end_longitude": `${endLongitude}`
     })
    })
    .then(res => res.json())
