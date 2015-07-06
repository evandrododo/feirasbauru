/**
 *  Arquivo que configura e exibe o mapa através do OpenLayers
 *
 *  As informações no OpenLayers seguem o fluxo de informação:
 *  - Source
 *    Camada onde ficam as informações de Features ( pontos/polígonos )
 *  - Style
 *    Camada que define graficamente como serão plotados os pontos da Source
 *  - Layer
 *    Camadas finais que gerenciam, encapsulam e exibem o conteúdo
 *    
 */

$(document).ready(function () {

	// Define um namespace para o mapa
	window.mapa = {};
	// Define uma variavel local para que o código fique menos ~verborrágico~
	var mapa = window.mapa;

	// Carrega o mapa ~dark~
	mapa.layerMapa = new ol.layer.Tile({
		source: new ol.source.XYZ({
			attributions: [
				new ol.Attribution({ 
					html: 'Evandro Carreira - Geoprocessamento divertido'
				}),
        		ol.source.OSM.ATTRIBUTION
      		],
      		url: 'http://s.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
    	})
	});

	/* Core do OpenLayers - Ativa o mapa */
	mapa.map = new ol.Map({
		target: 'mapaTarget',
		controls: [],
		layers: [
			mapa.layerMapa
		],
		view: new ol.View({
			center: ol.proj.transform([-49.06307, -22.32821], 'EPSG:4326', 'EPSG:3857'),
			zoom: 15,
			minZoom: 13,
			maxZoom: 20
		})
	});
});
