// Define a function to initialize the webpage

function init() {
  // Reference to the dropdown for Test Subject ID 
  let dropdown = d3.select("#selDataset");
  // Load the JSON data from webpage
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      // to populate the dropdown menu with sample names
      let sampleNames = data.names;
      sampleNames.forEach((sample) => {
          dropdown.append("option").text(sample).property("value", sample);
      });
      console.log(sampleNames)

      // Initial charts with the first sample
      let initialSample = sampleNames[0];
      createCharts(initialSample);
      displayMetadata(initialSample);
  });
};

init();


// Define a function to create Bar charts based on the top ten sample
function createCharts(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      // Filter data for the selected sample
      let selectedSample = data.samples.filter(s => s.id === sample)[0];
      console.log(selectedSample)

      // Horizontal bar chart for top 10 data for each samples
      let barData = [{
          type: "bar",
          x: selectedSample.sample_values.slice(0, 10).reverse(),
          y: selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
          text: selectedSample.otu_labels.slice(0, 10).reverse(),
          orientation: "h"
      }];
      let barLayout = {
          title: "Top 10 OTUs Found",
          xaxis: { title: "Sample Values" }
      };
      Plotly.newPlot("bar", barData, barLayout);
 

         // Bubble chart to see all data in each sample
         let bubbleData = [{
          type: "scatter",
          x: selectedSample.otu_ids,
          y: selectedSample.sample_values,
          text: selectedSample.otu_labels,
          mode: "markers",
          marker: {
              size: selectedSample.sample_values,
              color: selectedSample.otu_ids
          }
      }];
      let bubbleLayout = {
          title: "OTU Bubble Chart",
          xaxis: { title: "OTU ID" },
          yaxis: { title: "Sample Values" }
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
};


// Define a function to display demographic info
function displayMetadata(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let metadata = data.metadata.filter(m => m.id == sample)[0];
      console.log(metadata)
      let metadataPanel = d3.select("#sample-metadata");
      // to only show the current data in the panel
      metadataPanel.html("");
      Object.entries(metadata).forEach(([name, value]) => {
          metadataPanel.append("p").text(`${name}: ${value}`);
      });
  });
}


// Function to update all the plots when new dropdown selection made
function optionChanged(newSample) {
  createCharts(newSample);
  displayMetadata(newSample);
};