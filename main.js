$(function(){
  var colorMe     = "#D73737",
      colorClient = "#fefefe";

  var r       = Raphael("chart", 600, 600),
    R         = 250,
    init      = true,
    param     = {stroke: "#fff", "stroke-width": 8},
    hash      = document.location.hash,
    total     = 24,
    marksAttr = {fill: "#444", stroke: "none"};

  var diffAngleHour = 360 / total;
  var diffAngleQuater = 360 / total / 4;

  // Custom Attribute
  r.customAttributes.arc = function(from, to, R) {
    r.circle(300, 300, 2)

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
  var myTime = r.path().attr(param).attr({arc: [timeFromMine, timeToMine, R]});
  
  var outerData = drawMarks(R, total, 3, true, myTime); // drawing "Fat" points
                  drawMarks(R, total * 4, 1, false); // drawing "thin" points
  var outerMarks  = outerData[0],
      outerLabels = outerData[1]; 
  

  R -= 60;

  // INNER (CLIENT TIME)
  var timeFromClient = 8, timeToClient = 17;
  var clientTime = r.path().attr(param).attr({arc: [timeFromClient, timeToClient, R]});

  var innerData = drawMarks(R, total, 3, true, clientTime);
                  drawMarks(R, total * 4, 1, false);

  var innerMarks  = innerData[0],
      innerLabels = innerData[1]; 
  
  

  function updateVal(to, R, hand, from) {
    hand.animate({arc: [from, to, R]}, 450, ">");
  }

  function drawMarks(R, total, radius, drawText, handle) {
    var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)");
    var marksOut = r.set();
    var lablesOut = r.set();
    if(handle)
      marksOut.push(handle);
    for (var value = 0; value < total; value++) {
      var alpha = 360 / total * value,
        a = (90 - alpha) * Math.PI / 180,
        x = 300 + R * Math.cos(a),
        y = 300 - R * Math.sin(a);
      if(drawText){
        labelX = 300 + (R + 17) * Math.cos(a);
        labelY = 300 - (R + 17) * Math.sin(a);
        lablesOut.push(r.text(labelX, labelY, "" + (value) + ":00"));
      }

      marksOut.push(r.circle(x, y, radius).attr(marksAttr).toBack());
    }
    return [marksOut, lablesOut];
  }

  // updateVal(16, 250, myTime, 0);


  // My Time:
  $('input[name="fromMine"').bind('input', function(){
    timeFromMine = $(this).val();
    updateVal(timeToMine, 250, myTime, timeFromMine);
  })

  $('input[name="toMine"').bind('input', function(){
    timeToMine = $(this).val();
    updateVal(timeToMine, 250, myTime, timeFromMine);
  })

  // Client Time:
  var fromClientInput = $('input[name="fromClient"').bind('input', function(){
    timeFromClient = $(this).val();
    updateVal(timeToClient, 190, clientTime, timeFromClient);
  })

  var toClientInput = $('input[name="toClient"').bind('input', function(){
    timeToClient = $(this).val();
    updateVal(timeToClient, 190, clientTime, timeFromClient);
  })

  
  var angle = diffAngleHour

  $('button[name="rotate"').bind('click', function(){
    timeFromClient += 1;
    timeToClient += 1;
    // updateVal(timeToClient, 190, clientTime, timeFromClient);
    
    // clientTime.animate({arc: [timeToClient, 24, R, timeFromClient]}, 800, "bounce");
    innerMarks.animate({ transform: ['R'+angle+', '+ 300 +', ' + 300] }, 800, "bounce")
    innerLabels.animate({ transform: ['R'+angle+', '+ 300 +', ' + 300, 'r-'+angle] }, 800, "bounce")
      // .animate({ transform: ["r-" + angle] }, 1500, "linear")
    fromClientInput.trigger('input')
    toClientInput.trigger('input')
    angle += diffAngleHour;
  })

});