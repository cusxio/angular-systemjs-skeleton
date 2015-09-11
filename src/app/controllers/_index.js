
import { navCtrl } from './nav.js';
import { aboutCtrl } from './about.js';
import  { contactCtrl }from './contact.js';

var app = angular.module('seedApp.controllers', []);

app.controller('navCtrl', navCtrl);
app.controller('aboutCtrl', aboutCtrl);
app.controller('contactCtrl', contactCtrl);

export default app;