
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

    //var nl_hits = d3.map(dataset, d => +d.NL_hits)
    var nl_x = d3.map(dataset, xNLAccessor)
    var nl_max_x = d3.max(nl_x)
    //console.log("nl_x", nl_x)

    var al_x = d3.map(dataset, xALAccessor)
    var al_max_x = d3.max(al_x)
    //console.log("al_hits", al_x)

    var max_x = Math.max(d3.max(nl_x), d3.max(al_x))
    //console.log("al_max_x", al_max_x)
    //console.log("nl_max_x", nl_max_x)
    //console.log("max_x", max_x)

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

    var yScale = d3.scaleLinear()
      //.domain([0, d3.max(nl_hits)])
      .domain([0, max_x])
      //.range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
      .range([dimensions.boundedHeight,0]);

    var svg = d3.select("#v1")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      //.style("background-color", "green")

    var bounds = svg.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)


    //NL = blue
    // select path - three types: curveBasis, curveStep, curveCardinal
    var NL = bounds.selectAll(".line")
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
        .y(d => yScale(xNLAccessor(d))).curve(d3.curveLinear)
       )

    //NL.selectAll("circle")
    //  .append("g")
    //  .data(dataset)
    //  .enter()
    //  .append("circle")
    //  .attr("r", 1.5)
    //  .attr("cx", d => xScale(+d.Year))
    //  .attr("cy", d => yScale(xNLAccessor(d)))
    //  .style("fill", "black")

    //AL = red
    var AL = bounds.selectAll(".line")
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
        .y(d => yScale(xALAccessor(d))).curve(d3.curveLinear)
       )

    //AL.selectAll("circle")
    //  .append("g")
    //  .data(dataset)
    //  .enter()
    //  .append("circle")
    //  .attr("r", 1.5)
    //  .attr("cx", d => xScale(+d.Year))
    //  .attr("cy", d => yScale(xALAccessor(d)))
    //  .style("fill", "black")

    //var xAxis = d3.axisBottom(xScale)
    //  .tickValues(xScale.domain().filter(function(d,i){ return !(i%4)})).tickSizeOuter(0)

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

    var yAxis = d3.axisLeft(yScale)

    var changing_axis = svg.append("g")
      .attr("transform", "translate("+dimensions.margin.left+","+ dimensions.margin.top +")")
      .call(yAxis)

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

    //ON CLICK
    d3.select("#hrs").on("click", function() {
      console.log("Hrs clicked")
      xNLAccessor = d => +d.NL_hrs
      xALAccessor = d => +d.AL_hrs
      
      NLTextLegend = "National League HRs"
      ALTextLegend = "American League HRs"

      update()
    })

    d3.select("#hits").on("click", function() {
      console.log("Hits clicked")
      xNLAccessor = d => +d.NL_hits
      xALAccessor = d => +d.AL_hits

      NLTextLegend = "National League Hits"
      ALTextLegend = "American League Hits"
      update()
    })

    d3.select("#runs").on("click", function() {
      console.log("Runs clicked")
      xNLAccessor = d => +d.NL_runs
      xALAccessor = d => +d.AL_runs

      NLTextLegend = "National League Runs"
      ALTextLegend = "American League Runs"
      update()
    })


    // CREATE HOVER TOOLTIP WITH VERTICAL LINE
    var lineStroke = "2px"

    var tooltip = bounds.append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background-color", "#D3D3D3")
      .style("padding", 6)
      .style("display", "none")

    var mouseG = bounds.append("g")
      .attr("class", "mouse-over-effects")

    //Line that follows mouse
    mouseG.append("path")
      .attr("class", "mouse-line")
      //.style("stroke", "#A9A9A9")
      .style("stroke", "green")
      .style("stroke-width", lineStroke)
      .style("opacity", "0")
    
    var lines = document.getElementsByClassName("line")
    var mousePerLine = mouseG.selectAll(".mouse-per-line")
      .data([dataset])
      .enter()
      .append("g")
      .attr("class", "mouse-per-line")

    mousePerLine.append("circle")
      .attr("r", 4)
      .style("stroke", "black")
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
        console.log("Mouse out... should hide line. It does not work")
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
        d3.selectAll("#tooltip")
          .style("display", "none")
      })
      .on("mouseover", function () { // on mouse in show line, circles and text
        console.log("showing line")
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll("#tooltip")
          .style("display", "block")
      })
      .on('mousemove', function (event, d) { // update tooltip content, line, circles and text when mouse moves
        console.log("update tooltip content", event)
        //console.log("updating tooltip content")
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
            console.log("xDate", xDate)

            console.log("d", d)
            console.log("i", i)
            console.log("d.values", d.values)
            console.log("xDate", xDate)
            console.log("getFullYear", xDate.getFullYear())
            var year = xDate.getFullYear()

            var bisect = d3.bisector(function (d) { 
              console.log("getting here ===========>")
              console.log("d in bisect = ", d)
              return d.Year; 
            }).left // retrieve row index of date on parsed csv

            var idx = bisect(d, year.toString());
            console.log("idx", idx)
            console.log("d[idx]", d[idx])

            d3.select(".mouse-line")
              .attr("d", function () {

                var data = "M" + xScale(dates[idx].date) + "," + (dimensions.boundedHeight);
                data += " " + xScale(dates[idx].date) + "," + 0;
                console.log("data", data)
                return data;
              });
            return "translate(" + xScale(+d[idx].Year) + "," + yScale(xALAccessor(d[idx])) + ")"
          });

        //updateTooltipContent(mouse, res_nested)
        //updateTooltipContent(mouse)

      }) 
    function updateTooltipContent(mouse) {
      console.log("in updateToolTipContent")
      console.log("mouse", mouse)

    }





  }
)
