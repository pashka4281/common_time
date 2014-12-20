$(function(){
  var timeZones = [["(GMT-12:00) International Date Line West", -12], ["(GMT-11:00) Midway Island, Samoa", -11], ["(GMT-10:00) Hawaii", -10], ["(GMT-09:00) Alaska", -9], ["(GMT-08:00) Pacific Time (US & Canada)", -8], ["(GMT-08:00) Tijuana, Baja California", -8], ["(GMT-07:00) Arizona", -7], ["(GMT-07:00) Chihuahua, La Paz, Mazatlan", -7], ["(GMT-07:00) Mountain Time (US & Canada)", -7], ["(GMT-06:00) Central America", -6], ["(GMT-06:00) Central Time (US & Canada)", -6], ["(GMT-06:00) Guadalajara, Mexico City, Monterrey", -6], ["(GMT-06:00) Saskatchewan", -6], ["(GMT-05:00) Bogota, Lima, Quito, Rio Branco", -5], ["(GMT-05:00) Eastern Time (US & Canada)", -5], ["(GMT-05:00) Indiana (East)", -5], ["(GMT-04:00) Atlantic Time (Canada)", -4], ["(GMT-04:00) Caracas, La Paz", -4], ["(GMT-04:00) Manaus", -4], ["(GMT-04:00) Santiago", -4], ["(GMT-03:30) Newfoundland", -3.5], ["(GMT-03:00) Brasilia", -3], ["(GMT-03:00) Buenos Aires, Georgetown", -3], ["(GMT-03:00) Greenland", -3], ["(GMT-03:00) Montevideo", -3], ["(GMT-02:00) Mid-Atlantic", -2], ["(GMT-01:00) Cape Verde Is.", -1], ["(GMT-01:00) Azores", -1], ["(GMT+00:00) Casablanca, Monrovia, Reykjavik", 0], ["(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London", 0], ["(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", 1], ["(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", 1], ["(GMT+01:00) Brussels, Copenhagen, Madrid, Paris", 1], ["(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb", 1], ["(GMT+01:00) West Central Africa", 1], ["(GMT+02:00) Amman", 2], ["(GMT+02:00) Athens, Bucharest, Istanbul", 2], ["(GMT+02:00) Beirut", 2], ["(GMT+02:00) Cairo", 2], ["(GMT+02:00) Harare, Pretoria", 2], ["(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", 2], ["(GMT+02:00) Jerusalem", 2], ["(GMT+02:00) Minsk", 2], ["(GMT+02:00) Windhoek", 2], ["(GMT+03:00) Kuwait, Riyadh, Baghdad", 3], ["(GMT+03:00) Moscow, St. Petersburg, Volgograd", 3], ["(GMT+03:00) Nairobi", 3], ["(GMT+03:00) Tbilisi", 3], ["(GMT+03:30) Tehran", 3.5], ["(GMT+04:00) Abu Dhabi, Muscat", 4], ["(GMT+04:00) Baku", 4], ["(GMT+04:00) Yerevan", 4], ["(GMT+04:30) Kabul", 4.5], ["(GMT+05:00) Yekaterinburg", 5], ["(GMT+05:00) Islamabad, Karachi, Tashkent", 5], ["(GMT+05:30) Sri Jayawardenapura", 5.5], ["(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", 5.5], ["(GMT+05:45) Kathmandu", 5.75], ["(GMT+06:00) Almaty, Novosibirsk", 6], ["(GMT+06:00) Astana, Dhaka", 6], ["(GMT+06:30) Yangon (Rangoon)", 6.5], ["(GMT+07:00) Bangkok, Hanoi, Jakarta", 7], ["(GMT+07:00) Krasnoyarsk", 7], ["(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", 8], ["(GMT+08:00) Kuala Lumpur, Singapore", 8], ["(GMT+08:00) Irkutsk, Ulaan Bataar", 8], ["(GMT+08:00) Perth", 8], ["(GMT+08:00) Taipei", 8], ["(GMT+09:00) Osaka, Sapporo, Tokyo", 9], ["(GMT+09:00) Seoul", 9], ["(GMT+09:00) Yakutsk", 9], ["(GMT+09:30) Adelaide", 9.5], ["(GMT+09:30) Darwin", 9.5], ["(GMT+10:00) Brisbane", 10], ["(GMT+10:00) Canberra, Melbourne, Sydney", 10], ["(GMT+10:00) Hobart", 10], ["(GMT+10:00) Guam, Port Moresby", 10], ["(GMT+10:00) Vladivostok", 10], ["(GMT+11:00) Magadan, Solomon Is., New Caledonia", 11], ["(GMT+12:00) Auckland, Wellington", 12], ["(GMT+12:00) Fiji, Kamchatka, Marshall Is.", 12], ["(GMT+13:00) Nuku'alofa", 13]];

  // Setting options for timeZone selectors (keeping list here in js no prevent polluting html with huge duplicate lists of options)
  $(timeZones).each(function(i, zoneData){
    $('.zoneSelector').append( $("<option value='" + zoneData[1] + "'>" + zoneData[0] + "</option>") );
  })

  var r       = Raphael("chart", 600, 600),
    R         = { inner: 190, outer: 250 },
    param     = { stroke: "#fff", "stroke-width": 8 },
    hash      = document.location.hash,
    total     = 24;

  var colorMine   = $('#myTime .colorIndicator');
  var colorClient = $('#clientTime .colorIndicator');

  var diffAngleHour   = 360 / total;
  var diffAngleQuater = 360 / total / 4;
  r.circle(300, 300, 2) // marking the center of circles

  // Custom attribute function
  r.customAttributes.arc = function(from, to, R) {
    // arc start points:
    var alpha1 = diffAngleHour * from,
      a1 = (90 - alpha1) * Math.PI / 180,
      x1 = 300 + R * Math.cos(a1),
      y1 = 300 - R * Math.sin(a1);

    // arc end points:
    var alpha2 = diffAngleHour * to,
      a2 = (90 - alpha2) * Math.PI / 180,
      x2 = 300 + R * Math.cos(a2),
      y2 = 300 - R * Math.sin(a2);

    var color = "hsb(".concat(Math.round(R) / 200, ",", to / total, ", .75)");

    var path = [["M", x1, y1], ["A", R, R, 0, +((alpha2 -alpha1) > 180), 1, x2, y2]];
    return { path: path, stroke: color };
  };

  // OUTER (MY TIME)
  var timeFromMine = 8, timeToMine = 17;
  var myTime      = r.path().attr(param).attr({arc: [timeFromMine, timeToMine, R.outer]});
  var outerData   = drawPoints(R.outer, total, 3, true, myTime); // drawing "Fat" points
                    drawPoints(R.outer, total * 4, 1, false);    // drawing "thin" points

  // INNER (CLIENT TIME)
  var timeFromClient = 8, timeToClient = 17;
  var clientTime  = r.path().attr(param).attr({arc: [timeFromClient, timeToClient, R.inner]});
  var innerData   = drawPoints(R.inner, total, 3, true, clientTime); // drawing "Fat" points
                    drawPoints(R.inner, total * 4, 1, false);        // drawing "thin" points


  function drawPoints(R, total, radius, drawText, handle) {
    var color     = "hsb(".concat(Math.round(R) / 200, ", 1, .75)");
    var marksSet  = r.set();
    var labelsSet = r.set();
    if(handle)
      marksSet.push(handle);
    for (var value = 0; value < total; value++) {
      var alpha = 360 / total * value,
        a = (90 - alpha) * Math.PI / 180,
        x = 300 + R * Math.cos(a),
        y = 300 - R * Math.sin(a);
      if(drawText){
        labelX = 300 + (R + 17) * Math.cos(a);
        labelY = 300 - (R + 17) * Math.sin(a);
        labelsSet.push(r.text(labelX, labelY, "" + (value) + ":00"));
      }

      marksSet.push(r.circle(x, y, radius).attr({ fill: "#444", stroke: "none" }).toBack());
    }
    return [marksSet, labelsSet];
  }

  function updateVal() {
    myTime.animate({arc: [timeFromMine, timeToMine, R.outer]}, 450, ">");
    clientTime.animate({arc: [timeFromClient, timeToClient, R.inner]}, 450, ">");
  }

  // My Time:
  $('.zoneSelector[name="myTime"]').bind('change', function(){
    var angle = -($(this).val()) * diffAngleHour;
    rotateCircle(angle, outerData);
  }).trigger('change')

  $('input[name="fromMine"').bind('input', function(){
    timeFromMine = $(this).val();
    updateVal()
  })

  $('input[name="toMine"').bind('input', function(){
    timeToMine = $(this).val();
    updateVal()
  })

  // Client Time:
  $('.zoneSelector[name="clientTime"]').bind('change', function(){
    var angle = -($(this).val()) * diffAngleHour;
    rotateCircle(angle, innerData);
  }).trigger('change')

  var fromClientInput = $('input[name="fromClient"').bind('input', function(){
    timeFromClient = $(this).val();
    updateVal()
  })

  var toClientInput = $('input[name="toClient"').bind('input', function(){
    timeToClient = $(this).val();
    updateVal()
  })

  function rotateCircle(angle, circleData){
    circleData[0].animate({ transform: ['R'+angle+', '+ 300 +', ' + 300] }, 1300, "elastic")  // CircleData[0] -- marks
    circleData[1].animate({ transform: ['R'+angle+', '+ 300 +', ' + 300, 'r'+ -Math.sign(angle) *  Math.abs(angle)] }, 1300, "elastic") // CircleData[0] -- labels
  }

});