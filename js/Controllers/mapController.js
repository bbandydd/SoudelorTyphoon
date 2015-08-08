app.controller('mapController', ['$scope', function mapController($scope){
    var map = new google.maps.Map(d3.select('#map').node(),{
        zoom: 17, 
        center: new google.maps.LatLng(25.042355, 121.532904) 
    });

    d3.json("https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json", function(data){
        var overlay = new google.maps.OverlayView();

        overlay.onAdd = function(){
            var layer = d3.select(this.getPanes().overlayMouseTarget).append('div')
                .attr('class', 'stations');

            overlay.draw = function(){
                var projection = this.getProjection(),
                padding = 16;

                var metaData = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;

                var marker = layer.selectAll('svg')
                .data(d3.entries(metaData))
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
}]);