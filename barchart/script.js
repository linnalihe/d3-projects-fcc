const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then(({ data }) => {
  const width = 800,
    height = 400;
  const container = d3.select(".container").style("text-align", "center");

  const chart = d3
    .select(".chart")
    .append("svg")
    .attr("width", width + 100)
    .attr("height", height + 100);

  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", 80)
    .text("Gross Domestic Product");

  chart
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 80)
    .text("Years");

  const dObj = data.map((d) => {
    return { date: d[0], gdp: d[1] };
  });

  const barWidth = width / dObj.length;

  const parseDate = d3.timeParse("%Y-%m-%d");

  const xAccessor = (d) => parseDate(d["date"]),
    yAccessor = (d) => d["gdp"];

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dObj, xAccessor))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dObj, yAccessor)])
    .range([height, 0]);

  let xAxis = d3.axisBottom(xScale);

  chart
    .append("g")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", "translate(60, 450)");

  let yAxis = d3.axisLeft(yScale);
  chart
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis)
    .attr("transform", "translate(60, 50)");

  d3.select("svg")
    .selectAll("rect")
    .data(dObj)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("id", (d, i) => "bar" + i)
    .attr("data-date", (d) => d["date"])
    .attr("data-gdp", (d) => d["gdp"])
    .attr("x", (d) => xScale(parseDate(d["date"])))
    .attr("y", (d) => yScale(d["gdp"]))
    .attr("width", barWidth)
    .attr("height", (d) => height - yScale(d["gdp"]))
    .style("fill", "#eab676")
    .attr("transform", "translate(60, 50)")
    .on("mouseover", (e, d) => {
      d3.select(e.path[0]).style("fill", "#fff");
      d3.select("#tooltip")
        .attr("height", 100)
        .attr("width", 100)
        .style("opacity", 0.5)
        .text("Date: " + d["date"] + "\nGDP: " + d["gdp"])
        .attr("data-date", d["date"])
        .style("display", "block")
        .style("position", "absolute")
        .style("right", yScale(d["gdp"]) + 350 + "px")
        .style("top", "375px")
        .style("border", "2px solid black");
    })
    .on("mouseout", (e) => {
      d3.select(e.path[0]).style("fill", "#eab676");
      d3.select("#tooltip").text("").style("display", "none");
    });
});
