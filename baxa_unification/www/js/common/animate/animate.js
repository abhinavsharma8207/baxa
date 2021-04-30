/* Created by Karan Gandhi*/

/*Intialize the localStorage value animateInput*/

function initAnimate() {

  if (localStorage.getItem('animateInput') == undefined) {
    localStorage.setItem('animateInput', false);
  }
}
initAnimate();

/*
* Initialize the animation in Quote Page using
* $scope.animateClass = animateNgClass('bounceInUp', 'animationduration25');
* bounceInUp for Footer INPUT
* bounceInDown for Header INPUT d
*/

function animateNgClass(animation, duration) {
  if (localStorage.getItem('animateInput') === 'true') {
    localStorage.setItem('animateInput', false);
    var animateClass = ['animated', animation, duration];
    } else {
    var animateClass = [];
  }
  return animateClass;
}

/*
* Use the following command in Navigation
* For ng-click/$state.go navigation add function before the $state.go setAnimate($ionicHistory);
* For href navigation add ng-click="setNowAnimate()"
* $scope.setNowAnimate = function() {
*        setAnimate($ionicHistory);
*      }
*/

function setAnimate($ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true
  });
  localStorage.setItem('animateInput', true);  
}
