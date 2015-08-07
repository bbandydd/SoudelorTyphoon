app.factory('disaster', ['$http', function disaster($http){
	return $http.get('https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json')
		.success(function(data){
			return data;
		})
		.error(function(err){
			return err;
		});
}]);