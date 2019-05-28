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
 // BONUS: Build the Gauge Chart
  var level = data.WFREQ;

        // Trig to calc meter point
        var degrees = 180 - (level * 20),
            radius = .7;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var data = [{
                type: 'scatter',
                x: [0],
                y: [0],
                marker: { size: 28, color: '850000' },
                showlegend: false,
                name: 'speed',
                text: level,
                hoverinfo: 'text+name'
            },
            {
                values: [45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 50],
                rotation: 90,
                text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3',
                    '1-2', '0-1', ''
                ],
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: ['#84B589', 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                        '#F4F1E4', '#F8F3EC', 'rgba(255, 255, 255, 0)',
                    ]
                },
                labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3',
                    '1-2', '0-1', ''
                ],
                hoverinfo: 'label',
                hole: .5,
                type: 'pie',
                showlegend: false
            }
        ];

        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],

            title: 'Belly Button Wash Frequency (Per Week)',
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            }
        };
        Plotly.newPlot('gauge', data, layout);
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