var players = [];
var inFight = [];
var winners = [];
var game = '';

(function(){
  var app = angular.module('tournamentApp',['ngRoute']);
  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
      .when('/',{templateUrl:"../views/main.html",controller:"showController"})
      .when('/winner',{templateUrl:"../views/winner.html",controller:"winnerController"})
      .when('/:game',{templateUrl:"../views/tournament.html",controller:"tournamentController"})
    }
  ]);

  app.controller('showController',function($scope, $location) {
    players = [];
    inFight = [];
    winners = [];
    $scope.getGame = function(game) {
      game = game.target.attributes[1].value;
      window.sessionStorage.setItem("game", JSON.stringify(game));
    },
    $scope.addPlayer = function() {
      var playerName = $('.playerName').val();
      players.push(playerName);
      window.sessionStorage.setItem("players", JSON.stringify(players));
      $('.playersList').append('<li class="playerLi">' + playerName + '</li>');
    },
    $scope.clearList = function() {
      players = [];
      $('.playersList').text('');
    },
    /*var deleteLi = function (){
      console.log(players);
      $(this).closest('li').remove();
      var itemtoRemove = $(this).closest('li').text();
      players.splice($.inArray(itemtoRemove, players),1);
      console.log(players);
    },*/
    $scope.start = function() {
      game = JSON.parse(sessionStorage.getItem("game"));
      if (players.length > 8) {
        alert("Too much players, select 8 from them");
      } else if (players.length < 4){
        alert("You need at least 4 players");
      } else if (players.length <= 8) {
        $location.url('/' + game);
      };
    }
  });

  app.controller('tournamentController',function($scope, $location) {
    var startFights = function() {  
      $scope.players = JSON.parse(sessionStorage.getItem("players"));
      inFight = [];
      $scope.player1 = $scope.players[Math.floor(Math.random() * $scope.players.length)];
      inFight.push($scope.player1);
      var find = $scope.players.indexOf($scope.player1);
      $scope.players.splice(find,1);
      $scope.player2 = $scope.players[Math.floor(Math.random() * $scope.players.length)];
      inFight.push($scope.player2);
      var find2 = $scope.players.indexOf($scope.player2);
      $scope.players.splice(find2,1);
      window.sessionStorage.setItem("players", JSON.stringify($scope.players));
      window.sessionStorage.setItem("inFight", JSON.stringify(inFight));
    };
    startFights();
    $scope.submit = function() {
      var winner = $('.result').val();
      winners.push(winner);
      window.sessionStorage.setItem("winners", JSON.stringify(winners));
      if ($scope.players.length == 1) {
        var playerLeft = $scope.players[0]
        winners.push(playerLeft);
        $scope.players = [];
        window.sessionStorage.setItem("players", JSON.stringify($scope.players));
        window.sessionStorage.setItem("winners", JSON.stringify(winners));
        alert("Next Round");
        finalLaps();
      } else if ($scope.players.length == 0 && winners.length == 1) {
        alert(winners[0] + " has won");
        var winner = winners[0];
        $location.url('/winner');
      } else if ($scope.players.length > 1) {
        alert("next fight");
        startFights();
      } else if ($scope.players.length == 0) {
        alert("Next Round");
        finalLaps();
      };
    };
    var finalLaps = function() {
      $scope.players = winners;
      winners = [];
      inFight = [];
      if ($scope.players.length == 1) {
        var playerLeft = $scope.players[0]
        winners.push(playerLeft);
        $scope.players = [];
        alert("Next Round");
        finalLaps();
      };
      $scope.player1 = $scope.players[0];
      inFight.push($scope.player1);
      $scope.players.splice(0,1);
      $scope.player2 = $scope.players[0];
      inFight.push($scope.player2);
      $scope.players.splice(0,1);
      window.sessionStorage.setItem("players", JSON.stringify($scope.players));
      window.sessionStorage.setItem("inFight", JSON.stringify(inFight));
    };
  });

  app.controller('winnerController',function($scope, $location) {
    $scope.winner = JSON.parse(sessionStorage.getItem("winners"))[0];
    $scope.recall = function(){
      $location.url('/');
    };
  });

  app.directive('playersDirective', function(){
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: './views/players.html'
    };
  });

})();