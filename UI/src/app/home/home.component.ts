import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  data: any;

  attributes: string[] = ['---------------------Remove Filter-------------------','end_year', 'topic', 'sector', 'region', 'pestle', 'source', 'country', 'start_year'];
  selectedAttribute: string = '';
  selectedValue: string = '';
  attributeValues: string[] = []; // Values for the second dropdown
  chartOptions1: any; // Declare chartOptions without a specific type
  chartOptions2: any;
  chartOptions3: any;
  chartOptions4: any;
  chartOptions5: any;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    
    this.fetchData();
  }

  fetchData() {
    // Use the selected attribute and value to fetch data
    if (this.selectedAttribute && this.selectedValue) {
      this.apiService.getData(this.selectedAttribute, this.selectedValue).subscribe((response) => {
        this.data = response.result;
        

        
        this.prepareChartData1(response.countByStartYear);        
        this.prepareChartData2(response.countryRelavance);
        this.prepareChartData3(response.sectorLikelihood);
        this.prepareChartData4(response.StackBarChart);
        this.prepareChartData5(response.ScatterChart);
      });
    } else {
      
      this.apiService.getData().subscribe((response) => {
        this.data = response.result;
        

        
        this.prepareChartData1(response.countByStartYear);
        this.prepareChartData2(response.countryRelavance);
        this.prepareChartData3(response.sectorLikelihood);
        this.prepareChartData4(response.StackBarChart);
        this.prepareChartData5(response.ScatterChart);
      });
    }
  }

  onAttributeChange() {
    // Clear the selected value and fetch values for the second dropdown based on the selected attribute
    this.selectedValue = '';
    this.attributeValues = []; // Clear existing values

    if (this.selectedAttribute) {
      // Fetch values dynamically based on the selected attribute
      this.apiService.getAttributeValues(this.selectedAttribute).subscribe((values) => {
        this.attributeValues = values;
      });
    }
  }

  prepareChartData1(countByStartYear: { [key: string]: number }) {
    // Filter out entries with null key and only include entries with numeric keys
    const validChartData = Object.entries(countByStartYear)
      .filter(([year]) => year !== 'null' && !isNaN(Number(year)))
      .map(([year, count]) => ({ x: year, y: count }));
  
    // Check if there are valid entries before updating chartOptions
    if (validChartData.length > 0) {
      this.chartOptions1 = {
        series: [
          {
            name: "Count by Start Year",
            data: validChartData
          }
        ],
        chart: {
          height: 240,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: 'Count By Start Year',
          align: 'center',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333333',
          },
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5
          }
        },
        xaxis: {
          type: "category",
          categories: validChartData.map(item => item.x)
        }
      };
    } else {
      // If there are no valid entries, set chartOptions to null or an empty object
      this.chartOptions1 = null; // or this.chartOptions = {};
    }
  }
  

  prepareChartData2(countryRelavance: { [country: string]: number }) {
    
  
    // Transform the countryRelavance directly for your bar chart
    const chartData = Object.keys(countryRelavance).map(country => countryRelavance[country]);
  
    this.chartOptions2 = {
      series: [{
        name: 'basic',
        data: chartData
      }],
      chart: {
        type: 'bar',
        height: 250,
      },
      title: {
        text: 'Relevance of Countries',
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333333',
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: Object.keys(countryRelavance),
      },
    };
  }
  

  prepareChartData3(sectorLikelihood: { [sector: string]: number }) {
   
  
    // Transform the sectorLikelihood data for the pie chart
    const chartData = Object.values(sectorLikelihood);
    const sectorNames = Object.keys(sectorLikelihood).map(sector => (sector === "" ? "Undefined" : sector));
  
  
  
    // Prepare the chart options
    this.chartOptions3 = {
      series: chartData,
      chart: {
        type: 'pie',
        height: 250,
      },
      title: {
        text: 'Likelihood of Sectors',
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333333',
        },
      },
      labels: sectorNames, 
      dataLabels: {
        enabled: false,
        
      },
    };
  }
  
  prepareChartData4(stackBarChartData:[]) {
    
  // Extracting data for ApexCharts
  const categories = stackBarChartData.map(item => item[0]);
  const likelihoodData = stackBarChartData.map(item => item[1]);
  const relevanceData = stackBarChartData.map(item => item[2]);

  // Creating the chart
  this.chartOptions4 = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 250,
    },
    title: {
      text: 'Likelihood and Relavance Based on Sector',
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333333',
      },
    },
    xaxis: {
      categories: categories,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    series: [
      {
        name: 'Likelihood',
        data: likelihoodData,
      },
      {
        name: 'Relevance',
        data: relevanceData,
      },
    ],
  };  

}
prepareChartData5(scatterChartData: []) {
  // Extracting data for ApexCharts
  const xValues = scatterChartData.map(item => item[0]);
  const yValuesLikelihood = scatterChartData.map(item => item[1]);
  const yValuesRelevance = scatterChartData.map(item => item[2]);

  // Creating the chart options
  this.chartOptions5 = {
    chart: {
      type: 'scatter',
      height: 250,
    },
    xaxis: {
      title: {
        text: 'Sector',
      },
    },
    yaxis: {
      title: {
        text: 'Values',
      },
    },
    series: [
      {
        name: 'Likelihood',
        data: xValues.map((x, index) => ({
          x: x,
          y: yValuesLikelihood[index],
        })),
      },
      {
        name: 'Relevance',
        data: xValues.map((x, index) => ({
          x: x,
          y: yValuesRelevance[index],
        })),
      },
    ],
  };
}

}
