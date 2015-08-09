app.factory('disaster', ['$http', function disaster($http){
	return $http.get('http://bbandydd.github.io/SoudelorTyphoon/json_bak/GetDisasterSummary.json')
		.success(function(data){
			return data;
		})
		.error(function(err){
			return err;
		});
}]);