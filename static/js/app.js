function buildMetadata(sample) {
  //
  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
    // Use d3 to select the panel with id of `#sample-metadata`
  var metaselect = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
  metaselect.html("");
    // Use `Object.entries` to add each key and value pair to the panel
  d3.json(url).then(function(data) {
    Object.entries(data).forEach(([key, value]) => {
      metaselect.append("h6").text(`${key}: ${value}: `);
    })
  })
}
   

function buildCharts(sample) {

// Use `d3.json` to fetch the sample data for the plots
  var chartURL = "/samples/" + sample;
  d3.json(chartURL).then(function(data) {
    // Build a Bubble Chart using the sample data
    var trace1 = [{
        x: data.otu_ids,
        y: data.sample_values,
        mode: 'markers',
        text: data.otu_labels,
        marker: {
            color: data.otu_ids,
            size: data.sample_values,

            colorscale: "Earth"
        }}];
    var layout = {
        showlegend: false,
        height: 600,
    };

    Plotly.newPlot('bubble', trace1, layout);
    // Build a Pie Chart

    var pieData = [{
        values: data.sample_values.slice(0, 10),
        labels: data.otu_ids.slice(0, 10),
        hovertext: data.otu_labels.slice(0, 10),
        hoverinfo: 'hovertext',
        type: 'pie',
    }];

    var pieLayout = {
        showlegend: true,
    };
    Plotly.newPlot('pie', pieData, pieLayout);

})}


// Initialize the dashboard
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
  function optionChanged(sample) {
    // Fetch new data each time a new sample is selected
    buildCharts(sample);
    buildMetadata(sample);
}
//
init(); 