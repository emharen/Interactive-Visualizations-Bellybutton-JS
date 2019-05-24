function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  // @TODO: Build a Bubble Chart using the sample data


  // Build a Pie Chart

  const url = "/samples/<sample>";

// Fetch the JSON data and console log it
  d3.json(url).then(function(data) {
    console.log(data);
    });


  console.log(sampleData[0]['sample_values'].slice(0, 10))
  console.log(data.sample_values.slice(0, 10))

  var pieData = [{
    values: data.sample_values.slice(0, 10),
    labels: data.otu_ids.slice(0, 10),
    hovertext: labels.slice(0, 10),
    hoverinfo: 'hovertext',
    type: 'pie'
  }];
  var pieLayout = {
    margin: { t: 0, l: 0 },
    title: "Title"
  };
  var Pies = document.getElementById('pie');
  Plotly.plot(Pies, pieData, pieLayout);
  };

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();





