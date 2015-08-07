app.controller('MainController', ['$scope', 'disaster', function($scope, disaster){
	$scope.type = 'list';

	disaster
		.success(function(data){
			$scope.disasterList = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;
			console.log($scope.disasterList);

			//下拉選單 - 區域
			$scope.areas = ['中山區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', 
				'北投區', '內湖區', '南港區', '文山區'];

			//下拉選單 - 災害類型
			$scope.disasterTypes = [];

			angular.forEach($scope.disasterList, function(value, key){
				if ($scope.disasterTypes.indexOf(value["PName"][0]) == -1)
					$scope.disasterTypes.push(value["PName"][0]);
			});
		})
		.error(function(err){
			console.log("disaster-error:" + err);
		})
}]);