const config = require('./config.js');
const axios = require('axios');

/**
 * generateMidpoint() returns a midpoint based on two coordinates in the format
 * of "{ latitude: 37.4228642, longitude: -122.0851557 }"
 * and returns a midpoint in the same format, based on the walking path)
 */

module.exports.generateMidpoint = (coord1, coord2) => {
  // Make an API request from Google for directions
  const origin = `${coord1[0]},${coord1[1]}`;
  const dest = `${coord2[0]},${coord2[1]}`;
  const APIKEY = config.google.APIKEY;

  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${APIKEY}&mode=walking`;

  return axios.get(directionsUrl)
    .then((res) => {
      // Get the line from point A to point B
      var polyline = res.data.routes[0].overview_polyline.points;
      var coordinates = decodePolyline(polyline);
      var mid = Math.floor(coordinates.length/2);
      return coordinates[mid];
    })
    .catch((err) => {
      console.error(err);
    });
};

const decodePolyline = (t, e) => {
  // transforms something like this geocFltrhVvDsEtA}ApSsVrDaEvAcBSYOS_@...
  // to an array of coordinates
  let n;
  let o;
  let u = 0;
  let l = 0;
  let r = 0;
  let h = 0;
  let i = 0;
  let a = null;
  const d = [];
  const c = Math.pow(10, (e || 5));

  for (;u < t.length;) {
    a = null;
    h = 0;
    i = 0;
    do {
      a = t.charCodeAt(u) - 63;
      u += 1;
      i |= (31 & a) << h;
      h += 5;
    }
    while (a >= 32);
    n = (1 & i) ? (~(i >> 1)) : i >> 1;
    h = 0;
    i = 0;
    do {
      a = t.charCodeAt(u) - 63;
      u += 1;
      i |= (31 & a) << h;
      h += 5;
    }
    while (a >= 32);
    o = (1 & i) ? (~(i >> 1)) : i >> 1;
    l += n;
    r += o;
    d.push([l / c, r / c]);
  }
  return d.map(time => ({ latitude: time[0], longitude: time[1] }));
};

// var google = [37.4228642, -122.0851557];
// var home = [37.77594788029151, -122.3985733197085];
// generateMidpoint(google, home);
