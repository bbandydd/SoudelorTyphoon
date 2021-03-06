app.controller('MainController', ['$scope', 'disaster', 'holiday', function($scope, disaster, holiday){
	$scope.type = 'list';

	$scope.typeSearch = '';

	disaster
		.success(function(data){
			$scope.disasterList = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;

			//下拉選單 - 區域
			$scope.areas = [
				{'name': '中正區', 'count': 0}, 
				{'name': '大同區', 'count': 0}, 
				{'name': '中山區', 'count': 0}, 
				{'name': '松山區', 'count': 0}, 
				{'name': '大安區', 'count': 0}, 
				{'name': '萬華區', 'count': 0}, 
				{'name': '信義區', 'count': 0}, 
				{'name': '士林區', 'count': 0}, 
				{'name': '北投區', 'count': 0}, 
				{'name': '內湖區', 'count': 0}, 
				{'name': '南港區', 'count': 0},
				{'name': '文山區', 'count': 0} 
			];

			var tmpCount = [{
				'中正區': 0, 
				'大同區': 0, 
				'中山區': 0, 
				'松山區': 0, 
				'大安區': 0, 
				'萬華區': 0, 
				'信義區': 0, 
				'士林區': 0, 
				'北投區': 0, 
				'內湖區': 0, 
				'南港區': 0, 
				'文山區': 0
			}];


			//下拉選單 - 災害類型
			$scope.disasterTypes = [];

			angular.forEach($scope.disasterList, function(value, key){
				if ($scope.disasterTypes.indexOf(value["PName"][0]) == -1)
					$scope.disasterTypes.push(value["PName"][0]);

				tmpCount[0][value.CaseLocationDistrict[0]] = tmpCount[0][value.CaseLocationDistrict[0]] + 1;
			});

			angular.forEach($scope.areas, function(value, key){
				value.count = tmpCount[0][value.name];
			})

			//圓餅圖
			var w = 800;
			var h = 800;
			var r = h / 2;
			var color = d3.scale.category20();

			var vis = d3.select('#chart')
				.append("svg:svg").data([$scope.areas]).attr("width", w).attr('height', h)
				.append('svg:g').attr('transform', 'translate(' + r + ',' + r + ')');

			var pie = d3.layout.pie().value(function(d){
				return d.count;
			})

			var arc = d3.svg.arc().outerRadius(r);

			var arcs = vis.selectAll('g.slice').data(pie).enter()
				.append('svg:g').attr('class', 'slice');

			arcs.append('svg:path')
				.attr('fill', function(d, i){
					return color(i);
				})
				.attr('d', function(d){
					return arc(d);
				})

			arcs.append('svg:text')
				.attr('transform', function(d){
					d.innerRadius = 200;
					d.outerRadius = r;
					return 'translate(' + arc.centroid(d) + ')';
				})
				.attr('text-anchor', 'middle').text(function(d, i){
					return $scope.areas[i].name;
				})

		})
		.error(function(err){
			console.log("disaster-error:" + err);
		})

	holiday
		.success(function(data){
			$scope.holidayUpdateTime = data.updateTime;

			$scope.holidayList = [];

			$scope.TaiwanAreas = ["北部地區", "中部地區", "南部地區", "東部地區", "外島地區"];

			angular.forEach($scope.TaiwanAreas, function(value, key){
				angular.forEach(data[value], function(value2, key2){
					$scope.holidayList.push({area: value, name: value2.Name, content: value2.content, display: value2.content.indexOf('已達停止') == -1 ? 'label-info' : 'label-danger'});
				})	
			});
		})
		.error(function(err){
			console.log('holiday-error:' + err)
		})

	//地圖呈現
	
	$scope.mapchange = function(){
	    $scope.type='map';
	    $('.stations').remove(); //移除原本畫圖遮罩
	    $scope.generateMap();
	    
	    setTimeout(function(){ google.maps.event.trigger(map, 'resize'); }, 1000);
	  };

	var map = new google.maps.Map(d3.select('#map').node(),{
        zoom: 17, 
        center: new google.maps.LatLng(25.042355, 121.532904) 
    });

	$scope.generateMap = function(){
		d3.json("http://bbandydd.github.io/SoudelorTyphoon/json_bak/GetDisasterSummary.json", function(data){
	        var overlay = new google.maps.OverlayView();

	        overlay.onAdd = function(){
	            var layer = d3.select(this.getPanes().overlayMouseTarget).append('div')
	                .attr('class', 'stations');

	            overlay.draw = function(){
	                var projection = this.getProjection(),
	                padding = 16;

	                var originData = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;

	                var searchData = [];

	                angular.forEach(originData, function(value, key){
	                	if ($scope.typeSearch == '')
	                		searchData.push(value);
	                	else{
	                		if ($scope.typeSearch == value.PName[0])
	                			searchData.push(value);
	                	}

	                });

	                var marker = layer.selectAll('svg')
	                .data(d3.entries(searchData))
	                    .each(transform)
	                    .enter().append('svg:svg')
	                    .each(transform)
	                    .attr('class', 'marker');

	                marker.append('svg:circle')
	                    .attr('r', 6)
	                    .attr('cx', padding)
	                    .attr('cy', padding);

	                marker.append('svg:text')
	                    .attr('x', padding + 7)
	                    .attr('y', padding)
	                    .attr('dy', '.31em')
	                    .text(function(d){
	                        return d.value.CaseDescription[0];
	                });
	                function transform(d) {
	                   
	                  d = new google.maps.LatLng(d.value.Wgs84Y [0], d.value.Wgs84X[0]);
	                  d = projection.fromLatLngToDivPixel(d);
	                
	                  return d3.select(this)
	                      .style("left", (d.x - padding) + "px")
	                      .style("top", (d.y - padding) + "px");
	                }
	            };
	            
		    };

		    overlay.setMap(map);
		});
	};
    

}]);