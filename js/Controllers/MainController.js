app.controller('MainController', ['$scope', 'disaster', 'holiday', function($scope, disaster, holiday){
	$scope.type = 'list';

	disaster
		.success(function(data){
			$scope.disasterList = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;

			//下拉選單 - 區域
			$scope.areas = ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', 
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

	holiday
		.success(function(data){
			$scope.holidayUpdateTime = data.updateTime;

			$scope.holidayList = [];

			var TaiwanAreas = ["北部地區", "中部地區", "南部地區", "東部地區", "外島地區"];

			angular.forEach(TaiwanAreas, function(value, key){
				angular.forEach(data[value], function(value2, key2){
					$scope.holidayList.push({area: value, name: value2.Name, content: value2.content, display: value2.content.indexOf('停止') == -1 ? 'label-info' : 'label-danger'});
				})	
			});
		})
		.error(function(err){
			console.log('holiday-error:' + err)
		})
}]);