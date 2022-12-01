
//d3.csv("all_years.csv").then(
d3.csv("totals_sorted.csv").then(

  //object in which data will live
  function(dataset) { // dataset is an object contained in file
    //console.log(dataset)

    // Scatter plot dimensions
    var dimensions = {
      width: 1000,
      height: 800,
      margin: {
        top: 15,
        bottom: 50,
        right: 10,
        left: 50
      }
    }

    const NLColor = "#377eb8"
    const ALColor = "#e41a1c"

    var NLTextLegend = "National League Hits"
    var ALTextLegend = "American League Hits"

    dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    console.log("dataset", dataset)

    var parseDate = d3.timeParse("%Y")

    var dates = dataset.map((d, i) => {
      return {
        date: parseDate(d.Year),
        //nl_hits: +d.NL_hits,
        //nl_runs: +d.NL_runs,
        //nl_hrs: +d.NL_hrs,
        //al_hits: +d.AL_hits,
        //al_runs: +d.AL_runs,
        //al_hrs: +d.AL_hrs
      }
    })

    console.log("dates", dates)
    //console.log("dates[0]", dates[0])

    var xNLAccessor = d => +d.NL_hits
    var xALAccessor = d => +d.AL_hits

    //var years = d3.map(dataset, d => {
    //  console.log("d", d)
    //  console.log("d.Year", d.Year)
    //  console.log("typeof(d.Year)", typeof(d.Year))
    //  console.log("typeof(+d.Year)", typeof(+d.Year))
    //  return +d.Year
    //})
    var years = d3.map(dataset, d => +d.Year)
    //console.log("years", years)


    //var xScale = d3.scaleBand()
    //  .domain(years)
    //  //.range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
    //  //.padding([0.1])
    //  .range([0,dimensions.boundedWidth]).padding(0.2)

    var xDomain = d3.extent(dates, d => d.date)
    //console.log("xDomain", xDomain)

    var xScale = d3.scaleTime()
      .domain(xDomain)
      //.domain(d3.extent(date, d => d.date))
      .range([0,dimensions.boundedWidth])//.padding(0.2)

    var svg = d3.select("#v1")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      //.style("background-color", "green")

    var bounds = svg.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

    var padding = 20

    var NLHrsAccessor = d => +d.NL_hrs
    var ALHrsAccessor = d => +d.AL_hrs
    var yHrsRange = [dimensions.boundedHeight,(2*dimensions.boundedHeight/3) + padding]
    drawGraph(NLHrsAccessor, ALHrsAccessor, yHrsRange, ".line")

    var NLHitsAccessor = d => +d.NL_hits
    var ALHitsAccessor = d => +d.AL_hits
    var yHitsRange = [(2*dimensions.boundedHeight/3), dimensions.boundedHeight/3]
    //var yHitsRange = [(2*dimensions.boundedHeight/3) - padding,dimensions.boundedHeight/3]
    drawGraph(NLHitsAccessor, ALHitsAccessor, yHitsRange, ".line2")

    var NLRunsAccessor = d => +d.NL_runs
    var ALRunsAccessor = d => +d.AL_runs
    var yRunsRange = [(dimensions.boundedHeight/3) - padding,0]
    drawGraph(NLRunsAccessor, ALRunsAccessor, yRunsRange, ".line3")

    function drawGraph(NLAccessor, ALAccessor, yRange, line_id) {
      console.log("executed drawGraph")
      var nl = d3.map(dataset, NLAccessor)

      var al = d3.map(dataset, ALAccessor)

      var max = Math.max(d3.max(nl), d3.max(al))

      var yScale = d3.scaleLinear()
        .domain([0, max])
        .range(yRange)
      
      var NL = bounds.selectAll(line_id)
        .append("g")
        .attr("class", "line")
        .data([dataset])
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", NLColor)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x((d,i) => {
            return xScale(dates[i].date)
          })
          .y(d => yScale(NLAccessor(d))).curve(d3.curveLinear)
         )

      //AL = red
      var AL = bounds.selectAll(line_id)
        .append("g")
        .data([dataset])
        .enter()
        .append("path")
        .attr("class", "line")//added this
        .attr("fill", "none")
        .attr("stroke", ALColor)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x((d,i) => {
            return xScale(dates[i].date)
          })
          .y(d => yScale(ALAccessor(d))).curve(d3.curveLinear)
         )

      var yAxis = d3.axisLeft(yScale)

      var changing_axis = svg.append("g")
        .attr("transform", "translate("+dimensions.margin.left+","+ dimensions.margin.top +")")
        .call(yAxis)
    }

    
    var axisPad = 6 // axis formatting

    var xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeYear.every(4))
      .tickSizeOuter(axisPad*2)
      .tickSizeInner(axisPad*2)

    svg.append("g")
      .attr("transform", "translate("+ dimensions.margin.left + "," + (dimensions.boundedHeight+dimensions.margin.bottom/4) + ")")
      .call(xAxis)
      .selectAll("text")	
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // NL Legend
    bounds.append("circle")
      .attr("cx", 30)
      .attr("cy", 20)
      .attr("r", 6)
      .style("fill", NLColor)

    var NLLegend = bounds
      .append("text")
      .attr("id", "NLLegend")
      .attr("x", 50)
      .attr("y", 20)
      .text(NLTextLegend)
      .style("font-size", "15px")
      .attr("alignment-baseline","middle")

    // AL Legend
    bounds.append("circle")
      .attr("cx", 30)
      .attr("cy", 40)
      .attr("r", 6)
      .style("fill", ALColor)

    var ALLegend = bounds
      .append("text")
      .attr("id", "ALLegend")
      .attr("x", 50)
      .attr("y", 40)
      .text(ALTextLegend)
      .style("font-size", "15px")
      .attr("alignment-baseline","middle")

    // 1973 year line
    bounds.append("line")
      .style("stroke", "black")
      .attr("x1", xScale(1973))
      .attr("y1", 10)
      .attr("x2", xScale(1973))
      .attr("y2", dimensions.height)

    // 1973 label
    bounds.append("text")
      //.attr("id", "ALLegend")
      .attr("x", xScale(1973))
      .attr("y", 5)
      .text("DH rule")
      .style("font-size", "15px")
      .attr("alignment-baseline","middle")
      .attr("text-align","center")
    //

    function update() {
      console.log("updating yScale")
      nl_x = d3.map(dataset, xNLAccessor)
      nl_max_x = d3.max(nl_x)
      al_x = d3.map(dataset, xALAccessor)
      al_max_x = d3.max(al_x)
      max_x = Math.max(d3.max(nl_x), d3.max(al_x))

      console.log("max_x", max_x)
      yScale
        .domain([0, max_x])

      console.log("updating chart")
      NL.transition()
        .attr("d", d3.line()
            .x(d => xScale(+d.Year))
            .y(d => yScale(xNLAccessor(d))).curve(d3.curveLinear)
        )
        
      var al_x = d3.map(dataset, xALAccessor)

      AL.transition()
        .attr("d", d3.line()
            .x(d => xScale(+d.Year))
            .y(d => yScale(xALAccessor(d))).curve(d3.curveCardinal)
        )

      changing_axis.transition()
        .call(yAxis)

      console.log("updating labels")
      d3.select("#NLLegend") 
        .text(NLTextLegend)
      d3.select("#ALLegend") 
        .text(ALTextLegend)
    }

    ////ON CLICK
    //d3.select("#hrs").on("click", function() {
    //  console.log("Hrs clicked")
    //  xNLAccessor = d => +d.NL_hrs
    //  xALAccessor = d => +d.AL_hrs
    //  
    //  NLTextLegend = "National League HRs"
    //  ALTextLegend = "American League HRs"

    //  update()
    //})

    //d3.select("#hits").on("click", function() {
    //  console.log("Hits clicked")
    //  xNLAccessor = d => +d.NL_hits
    //  xALAccessor = d => +d.AL_hits

    //  NLTextLegend = "National League Hits"
    //  ALTextLegend = "American League Hits"
    //  update()
    //})

    //d3.select("#runs").on("click", function() {
    //  console.log("Runs clicked")
    //  xNLAccessor = d => +d.NL_runs
    //  xALAccessor = d => +d.AL_runs

    //  NLTextLegend = "National League Runs"
    //  ALTextLegend = "American League Runs"
    //  update()
    //})

     // APPEND CIRCLE MARKERS //
            //var gcircle = lines.selectAll("circle-group")
            //.data(res_nested).enter()
            //.append("g")
            //.attr('class', 'circle-group')

          //gcircle.selectAll("circle")
            //.data(d => d.values).enter()
            //.append("g")
            //.attr("class", "circle")  
            //.append("circle")
            //.attr("cx", d => xScale(d.date))
            //.attr("cy", d => yScale(d.premium))
            //.attr("r", 2)

    // CREATE HOVER TOOLBOX WITH VERTICAL LINE
    var lineStroke = "2px"
    var toolbox 

      toolbox = bounds.append("div")
      .attr("id", "toolbox")
      .style("position", "absolute")
      .style("width", "100px")
      .style("height", "100px")
      //.style("background-color", "#D3D3D3")
      .style("background-color", "green")
      //.style("left", "100px")
      //.style("top", "100px")
      .style("padding", 6)
      //.style("display", "none")
      .style("display", "block")

    var mouseG = bounds.append("g")
      .attr("class", "mouse-over-effects")

    //Line that follows mouse
    mouseG.append("path")
      .attr("class", "mouse-line")
      //.style("stroke", "#A9A9A9")
      .style("stroke", "green")
      .style("stroke-width", lineStroke)
      .style("opacity", "0")
      .on("mousemove", function() {
        console.log("detected mousemove on mouseG")
      })
    
    var lines = document.getElementsByClassName("line")
    var mousePerLine = mouseG.selectAll(".mouse-per-line")
      .data([dataset])
      .enter()
      .append("g")
      .attr("class", "mouse-per-line")

    mousePerLine.append("circle")
      .attr("r", 4)
      .style("stroke", "orange")
      .style("fill", "none")
      .style("stroke-width", lineStroke)
      .style("opacity", "0")

    // append a rect to catch mose movements on canvas
    mouseG.append("svg:rect")
      .attr("width", dimensions.boundedWidth)
      .attr("height", dimensions.boundedHeight)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout", function () { // on mouse out hide line, circles and text
        console.log("Mouse out... hiding")
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
        d3.selectAll("#toolbox")
          .style("display", "none")
      })
      .on("mouseover", function () { // on mouse in show line, circles and text
        console.log("showing line")
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll("#toolbox")
          .style("display", "block")
      })
      .on('mousemove', function (event, d) { // update toolbox content, line, circles and text when mouse moves
        console.log("update toolbox content", event)
        //console.log("updating toolbox content")
        //console.log("this", this) //this = current DOM element
        var mouse = d3.pointer(event) // Returns a two-element array of numbers [x, y] representing the coordinates of the specified event relative to the specified target.
        //console.log("mouse", mouse)

        d3.selectAll(".mouse-per-line")
          .attr("transform", function (d, i) {
            //console.log("d.Year", d.Year)
            //console.log("i", i)
            //console.log("mouse[0]", mouse[0])
            //var x = xScale(mouse[0])
            //console.log("x", x)
            var xDate = xScale.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
            //console.log("xDate", xDate)

            //console.log("d", d)
            //console.log("i", i)
            //console.log("d.values", d.values)
            //console.log("xDate", xDate)
            //console.log("getFullYear", xDate.getFullYear())
            var year = xDate.getFullYear()

            var bisect = d3.bisector(function (d) { 
              //console.log("getting here ===========>")
              //console.log("d in bisect = ", d)
              return d.Year; 
            }).left // retrieve row index of date on parsed csv

            var idx = bisect(d, year.toString());
            //console.log("idx", idx)
            //console.log("d[idx]", d[idx])


            var yScale = d3.scaleLinear()
              //.domain([0, d3.max(nl_hits)])
              //.domain([0, max_x])
              .domain([0, dimensions.boundedHeight])
              //.range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
              .range([dimensions.boundedHeight,0])
              //.range([dimensions.boundedHeight,2*dimensions.boundedHeight/3])
              //.range(yRange)

            d3.select(".mouse-line")
              .attr("d", function () {

                var data = "M" + xScale(dates[idx].date) + "," + (dimensions.boundedHeight);
                data += " " + xScale(dates[idx].date) + "," + 0;
                //console.log("data", data)
                return data;
              });
            return "translate(" + xScale(+d[idx].Year) + "," + yScale(xALAccessor(d[idx])) + ")"
          });

        //updateToolBoxContent(mouse, res_nested)
        updateToolBoxContent(mouse)

      }) 
    function updateToolBoxContent(mouse) {
      console.log("in updateToolBoxContent")
      console.log("mouse", mouse)

      var xDate = xScale.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
      console.log("xDate", xDate)

      var year = xDate.getFullYear()

      var bisect = d3.bisector(function (d) { 
        //console.log("getting here ===========>")
        //console.log("d in bisect = ", d)
        return d.Year; 
      }).left // retrieve row index of date on parsed csv

    var idx = bisect(dataset, year.toString()); //HERERERERERERERERE

      var element = dataset[idx]
      console.log("==> idx", idx)
      console.log("==> element", element)

      var coordinates = d3.pointer(event)

      console.log("coordinates", coordinates)

      //var page_x = d3.event.pageX + 20
      //var page_y = d3.event.pageY - 20

      //console.log("page_x",page_x)
      //console.log("page_y",page_y) 

      //toolbox.html("toolbox text")
      toolbox.html("some text")
        .style("display", "block")
        .style('left', coordinates[0] + 20)
        .style('top', coordinates[1] - 20)
        .style('font-size', 11.5)
        .text("please show :(")
        //.selectAll()
        //.data(dataset)
        //  .enter()
        //.append("div")
        //.html("some other text")
    }



  }
)
