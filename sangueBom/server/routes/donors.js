'use strict';

var donors = require('../controllers/donors');

module.exports = function(app){

	//==== Adicionar Doador
	app.route('/donors/create').post(donors.create);

};