function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var otuArray = data.samples;
    console.log(otuArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = otuArray.filter(sampleId => sampleId.id == sample);
    console.log(filteredSample);
    //  5. Create a variable that holds the first sample in the array.
    var firstOtuSample = filteredSample[0];
    console.log(firstOtuSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstOtuSample.otu_ids;
    var otuLabels =firstOtuSample.otu_labels;
    var sampleValues = firstOtuSample.sample_values;
    console.log(otuIds);
    console.log(otuLabels);
    console.log(sampleValues);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
   
    var yticks = otuIds.slice(0,10).map(function(num){return "OTU " + num}).reverse();
    console.log(yticks);
    
    // 8. Create the trace for the bar chart. 
    var barData = [{
       x : sampleValues.slice(0,10).sort(function(a,b) {return a-b}),
       y: yticks,
       text: otuLabels,
       type: "bar",
       orientation: "h",
       
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title : "Top 10 Bacteria Culters Found",
      yaxis :{
        title : yticks
        
       }

     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x :otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: 'Earth'
      }
      
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      margin: {
        "l": 70,
        "r": 60,
        "b": 60,
        "t": 60,
        "pad": 10,
        "autoexpand": true
      }
      
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // 3. Create a variable that holds the washing frequency and holds the first sample in the array.
    var firstPersonMetadata = data.metadata.filter(person => person.id ==sample)[0];
    console.log(firstPersonMetadata);
   //create a variable that converts the washing frequency to a floating point number
    var wfreq = parseFloat(firstPersonMetadata.wfreq);
    console.log(wfreq);
    
    // 4. Create the trace for the gauge chart.
   var gaugeData = [{
    type: 'indicator',
    mode: "gauge+number",
    value: wfreq,
    gauge: {
      axis: { range: [0,10], tickwidth: 2, tickcolor: "black" },
      bar: { color: "black" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        {range: [0, 2], color: "red"} ,
        {range: [2, 4], color: "orange"} ,
        {range: [4, 6], color: "yellow"} ,
        {range: [6,8], color: "yellowgreen"},
        {range: [8, 10], color:"green"}
     
      ]
    }
   }];
    
    // 5. Create the layout for the gauge chart.
   var gaugeLayout = { 
    width: 450,
    height: 300,
    margin: { t: 0, r: 25, l: 25, b: 25 },
    font: { color: "black", family: "Arial" }
   };

    // 6. Use Plotly to plot the gauge data and layout.
   Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}
