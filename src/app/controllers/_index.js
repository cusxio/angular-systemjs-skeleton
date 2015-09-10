
import { navCtrl } from './nav.js';
import { aboutCtrl } from './about.js';

var app = angular.module('seedApp.controllers', []);

app.controller('navCtrl', navCtrl);
app.controller('aboutCtrl', aboutCtrl);