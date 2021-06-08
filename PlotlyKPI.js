/*globals define*/
define( ["qlik", "jquery","./plotly-latest.min", "css!./style.css","./about"], 
function ( qlik, $ , Plotly) {
	'use strict';
	

	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 0,
					max: 1,
					items:{
							charttype:{
								type: "string",
								component: "dropdown",
								label: "Type of Trend Chart",
								ref: "qDef.charttype",
								options: [{
									value: "area",
									label: "Area Chart"
								}, {
									value: "line",
									label: "Line Chart"
								},{
									value: "bar",
									label: "Bar Chart"
								}],
								defaultValue: "area"
							},
							chartcolor:{
								type:"string",
								label:"Chart Color",
								ref:"qDef.chartcolor",
								defaultValue: "",
								expression:"optional"
							},


					  }
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 1,
					items:{
							
							KPIBgcolor:{
								type:"string",
								label:"KPI Background Color",
								ref:"qDef.KPIBgcolor",
								defaultValue:"",
								expression:"optional"
							},
							prefix:{
								type:"string",
								label:"Add Prefix",
								ref:"qDef.prefix",
								defaultValue:"",
							},
							KPILabelcolor:{
								type:"string",
								label:"KPI Label Color",
								ref:"qDef.KPILabelcolor",
								defaultValue:"black",
								expression:"optional"
							},
							KPILabelsize:{
								type:"string",
								label:"KPI Label Size",
								ref:"qDef.KPILabelsize",
								defaultValue: null	
							},
							KPILabelfontfamily:{
								type: "string",
								component: "dropdown",
								label: "KPI Label Font Family",
								ref: "qDef.KPILabelfontfamily",
								options: [{
									value: "Arial",
									label: "Arial"
								}, {
									value: "Times New Roman",
									label: "Times New Roman"
								},{
									value: "Courier New",
									label: "Courier New"
								},{
									value: "Droid Sans",
									label: "Droid Sans"
								},{
									value: "Droid Serif",
									label: "Droid Serif"
								},{
									value: "Droid Sans Mono",
									label: "Droid Sans Mono"
								},{
									value: "Gravitas One",
									label: "Gravitas One"
								},{
									value: "Overpass",
									label: "Overpass"
								},{
									value: "PT Sans Narrow",
									label: "PT Sans Narrow"
								},{
									value: "Raleway",
									label: "Raleway"
								},{
									value: "Balto",
									label: "Balto"
								}],
								defaultValue: null
							},
							KPIValuecolor:{
								type:"string",
								label:"KPI Value Color",
								ref:"qDef.KPIValuecolor",
								defaultValue:"black",
								expression:"optional"
							},
							KPIValuesize:{
								type:"string",
								label:"KPI Value Size",
								ref:"qDef.KPIValuesize",
								defaultValue:null
							},
							KPIValuefontfamily:{
								type: "string",
								component: "dropdown",
								label: "KPI Value Font Family",
								ref: "qDef.KPIValuefontfamily",
								options: [{
									value: "Arial",
									label: "Arial"
								}, {
									value: "Times New Roman",
									label: "Times New Roman"
								},{
									value: "Courier New",
									label: "Courier New"
								},{
									value: "Droid Sans",
									label: "Droid Sans"
								},{
									value: "Droid Serif",
									label: "Droid Serif"
								},{
									value: "Droid Sans Mono",
									label: "Droid Sans Mono"
								},{
									value: "Gravitas One",
									label: "Gravitas One"
								},{
									value: "Overpass",
									label: "Overpass"
								},{
									value: "PT Sans Narrow",
									label: "PT Sans Narrow"
								},{
									value: "Raleway",
									label: "Raleway"
								},{
									value: "Balto",
									label: "Balto"
								}],
								defaultValue: null
							}
							
						},
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				},
				about: {
                            component: "kpi-about",
                            translation: "About",
                            label: "About"
                        }
		

				//
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element, layout ) {

		
		var id = "container_" + layout.qInfo.qId;
			$element.html("<div id ='"+id+"'></div>");
			
			

		// set the dimensions and margins of the graph
		var margin = {top: 20, right: 20, bottom: 30, left: 50},
		    width1 = $element.width() - margin.left - margin.right,
		    height1 = $element.height() - margin.top - margin.bottom;

		// parse the date / time
		var qHyperCube = layout.qHyperCube;
		var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
		var qMeasureInfo = qHyperCube.qMeasureInfo;
		var qDimensionInfo = qHyperCube.qDimensionInfo;
		var temp = qMeasureInfo[0].qNumFormat.qFmt;
		var fmt = ".3s";
		var pre = qMeasureInfo[0].prefix;
		var filly = 'none';
		var chartt = 'scatter';

		
		debugger;
		console.log(qHyperCube);
		
		// alert(qMeasureInfo);

		if(temp == "#,##0"){ fmt = ","} else if(temp == "#,##0.0"){ fmt = ",.1f"}else if(temp == "#,##0.00"){ fmt = ",.2f"}
		else if(temp == "0%"){ fmt = "%"}else if(temp == "0.0%"){ fmt = ".1%"}else if(temp == "0.00%"){ fmt = ".2%"}else if(temp == "₹ #,##0.00;-₹ #,##0.00"){ fmt = ",.2f"; pre = "₹"}
		

		var xdata = [];
		var ydata = [];
		qMatrix.forEach(function (d){	
			xdata.push(d[0].qText);		  
		});

		if(qDimensionInfo.length == 1){
				qMatrix.forEach(function (d){
					ydata.push(d[1].qNum);  
				});
				if(qDimensionInfo[0].charttype == 'area'){ filly = 'tozeroy'};
				if(qDimensionInfo[0].charttype == 'bar'){ chartt = 'bar'};
		};


		// if (qMeasureInfo.length == 1){
			var m = "number";
		// }
		// else{
		// 	var m = "number+delta";
		// }
		
		if (qMeasureInfo.length == 1 && qDimensionInfo.length == 1){
			var data = [
			  {
			    type: "indicator",
			    mode: m,
			    value: qHyperCube.qGrandTotalRow[0].qNum,
			    number: { prefix: pre , valueformat : fmt,font: {color: qMeasureInfo[0].KPIValuecolor, size: qMeasureInfo[0].KPIValuesize, family: qMeasureInfo[0].KPIValuefontfamily}  },
			    title: { text: qHyperCube.qMeasureInfo[0].qFallbackTitle, 
			    	font: {color: qMeasureInfo[0].KPILabelcolor, size: qMeasureInfo[0].KPILabelsize,family: qMeasureInfo[0].KPILabelfontfamily} },
			    	
			  },
			  {
			    x: xdata,
			    y: ydata,
			    type: chartt,
			    fill: filly,
			    fillcolor: qDimensionInfo[0].chartcolor,
			    line: {
			      color: qDimensionInfo[0].chartcolor
			    },
			    marker: {
			      color: qDimensionInfo[0].chartcolor
			    },
			  }
			];
		}
		else if (qMeasureInfo.length == 1){
			var data = [
			  {
			    type: "indicator",
			    mode: m,
			    value: qHyperCube.qGrandTotalRow[0].qNum,
			    number: { prefix: pre, valueformat : fmt, font: {color: qMeasureInfo[0].KPIValuecolor, size: qMeasureInfo[0].KPIValuesize, family: qMeasureInfo[0].KPIValuefontfamily} },
			    title: { text: qHyperCube.qMeasureInfo[0].qFallbackTitle, 
			    	font: {color: qMeasureInfo[0].KPILabelcolor, size: qMeasureInfo[0].KPILabelsize, family: qMeasureInfo[0].KPILabelfontfamily} },
			    
			  }
			];
			
		    }
		

		
			
		
		
		

		var layout = { paper_bgcolor: qMeasureInfo[0].KPIBgcolor, width: $element.width(), height: $element.height(),margin: {
		    l: 0,
		    r: 0,
		    b: 0,
		    t: 0,
		    pad: 0
		  }, xaxis: { 
			autorange: true,
		    showgrid: false,
		    zeroline: false,
		    showline: false,
		    autotick: true,
		    ticks: '',
		    showticklabels: false},
		             yaxis: {
		    autorange: true,
		    showgrid: false,
		    zeroline: false,
		    showline: false,
		    autotick: true,
		    ticks: '',
		    showticklabels: false
		  }};

		const config = {
		  'displayModeBar': false // this is the line that hides the bar.
		};


		Plotly.newPlot(id, data, layout, config);






			
		}
	};
} );
