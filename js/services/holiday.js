app.factory('holiday', ['$http', function holiday($http){
    return $http.get('http://gonsakon.github.io/HolidayAPI/holiday.json')
        .success(function(data){
            return data;
        })
        .error(function(err){
            return err;
        })
}]);