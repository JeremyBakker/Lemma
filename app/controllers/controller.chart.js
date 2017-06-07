"use strict";

module.exports = function($scope, $document, DataStorageFactory, firebaseCredentials) {
	$scope.printChart = function() {

		let cx;
		let cy;
		
		let firebaseValues = firebaseCredentials.getfirebaseCredentials();
		let firebaseControlData = DataStorageFactory.getSetData();
		let path = firebaseControlData.originalFirebaseControlData.data.name;	

		let d3 = require('../../lib/node_modules/d3/d3.min.js');

		d3.json(`${firebaseValues.databaseURL}${path}.json`, function(error, data) {

			var svg = d3.select("#svg"),
				width = +svg.attr("width"),
				height = +svg.attr("height");

			var zoom = d3.zoom()
				.scaleExtent([1, 40])
				.translateExtent([[-100, -100], [width + 90, height + 100]])
				.on("zoom", zoomed);

			let xDomain = d3.extent(data, function(element) {
			return element.termFrequency - 0.002;
			});
			let xScale = d3.scaleLinear()
				.domain(xDomain)
				.range([-1, width + 500]);

			let yDomain = d3.extent(data, function(element){
			return element.inverseDocumentFrequency + 0.05;
			});

			let yScale = d3.scaleLinear()
				.domain(yDomain)
				.range([height - 20, 1]);

		    let defaultCircleRadius = 5;

		    let xAxis = d3.axisBottom(xScale)
		    	.ticks(10, ",f")
		    	.tickSize(height)
		    	.tickPadding(8-height);
		    
		    svg.append("text")
				.attr("class", "x label")
				.attr("text-anchor", "end")
				.attr("x", width-10)
				.attr("y", 35)
				.text("tf-idf");

		    let yAxis = d3.axisRight(yScale)
		    	.ticks(10)
		    	.tickSize(width)
		    	.tickPadding(8-width);

		    let view = svg.append("rect")
		    	.attr("class", "view")
		    	.attr("x", 0.5)
		    	.attr("y", 0.5)
		    	.attr("width", width - 15)
		    	.attr("height", height - 15)
		    	.attr("opacity", 0);

		    let gX = svg.append("g")
		    	.attr("class", "axis axis-x")
		    	.call(xAxis);

		    let gY = svg.append("g")
		    	.attr("class", "axis axis-y")
		    	.call(yAxis);

			let dots = svg.selectAll('g.dots')
					.data(data)
					.enter()
					.append('g')
					.attr('class', 'dots')
					.attr('transform', function(d) {
						cx = xScale(d.termFrequency);
						cy = yScale(d.inverseDocumentFrequency);
						return 'translate(' + cx + ',' + cy + ')';
						})
						.style('stroke', '#000')
						.style('fill', 'grey');

			dots.append('circle')
				.attr('r', 5);

		    svg.call(zoom);

		    function zoomed() {
		    	view.attr("transform", d3.event.transform);
		    	gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
		    	gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
		    	dots.attr('transform', function(d) {
		    		cx = d3.event.transform.applyX(xScale(d.termFrequency));
		    		cy = d3.event.transform.applyY(yScale(d.inverseDocumentFrequency));
		    		return 'translate(' + cx + ',' + cy + ')';
		    	});
			}

			dots.on("mouseover", function(d) {
				d3.select(this).select('circle').attr('r', 10).style('fill', 'blue');

				d3.select("#tooltip")
				  .select("#document")
				  .text(d.document);
				  
				d3.select("#tooltip")
				  .select("#word")
				  .text(d.word);

				d3.select("#tooltip")
				  .select("#tfIdf")
				  .text((d.tfIdf).toFixed(4));

				d3.select(".tooltipWord").classed("hidden", false);
				d3.select(".tooltipDocument").classed("hidden", false);
				d3.select(".tooltipTfIdf").classed("hidden", false);
			});

			dots.on("mouseout", function() {
				d3.select(this).select('circle').attr('r',5).style('fill', 'grey');
				d3.select(".tooltipWord").classed("hidden", true);
			});
			
			$scope.callResetted = function resetted() {
				svg.transition()
					.duration(750)
					.call(zoom.transform, d3.zoomIdentity);
					console.log("resetted called");
			};

	    });
	};
};