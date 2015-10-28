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
	//	source: new ol.source.OSM()
		
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

        mapa.aerialLayer = new ol.layer.Tile ({
            source: new ol.source.BingMaps({
                key: 'Al-vZDA_YaFdgkTvi2V_X8OIdDW8cD9CZ34nO93XS-cqWDY6p5RoJHkTV0P_nkRm',
                imagerySet: 'AerialWithLabels',
                maxZoom: 19
            }),
                preload: 20,
                opacity: 1
        });

	// Mostra a posição do mouse
	var mousePositionControl = new ol.control.MousePosition({
	  coordinateFormat: ol.coordinate.createStringXY(4),
	  projection: 'EPSG:4326',
	  className: 'custom-mouse-position',
	  target: document.getElementById('mouse-position'),
	  undefinedHTML: ''
	});
	/* Core do OpenLayers - Ativa o mapa */
	mapa.map = new ol.Map({
		target: 'mapaTarget',
		controls: [
      mousePositionControl,
      new ol.control.FullScreen(),
      new ol.control.Rotate(),
      new ol.control.OverviewMap(),
      new ol.control.Rotate()
    ],
		layers: [
			//mapa.layerMapa
      mapa.aerialLayer
		],
		view: new ol.View({
			center: ol.proj.transform([-49.06307, -22.32821], 'EPSG:4326', 'EPSG:3857'),
			zoom: 15,
//			minZoom: 13,
			maxZoom: 20
		})
	});


	/* Plota as feiras */
	
	mapa.feirasSource = new ol.source.Vector({
    		format: new ol.format.GeoJSON(),
    		loader: function(extent, resolution, projection) {
      			//monta url com bounding box
		      	var url = '/js/pontos.json';
      				$.ajax({
        				url: url,
        				success: function(data) {
						console.log(data);
          					var features = (new ol.format.GeoJSON()).readFeatures(data);
          					mapa.feirasSource.addFeatures(features);
        				},
        				beforeSend: function(data) {
            					mapa.feirasSource.clear();
        				},
        				dataType: 'json'
      				});

    		},
    		projection: 'EPSG:4326',
    		strategy: ol.loadingstrategy.bbox
  	});	

	/* Style dos Pontos */
  	mapa.stylePlanoFeiras = function(feature, resolution) {
		var style = [new ol.style.Style({
        		fill:  new ol.style.Fill({
          			color: [255,255,255, 0.2]
        		}),
        		stroke: new ol.style.Stroke({
          			color: [255,0,0, 0.8],
          			width: 6
        		})
    		})];
      		return style;
        };

        /* Define os layers com base no source */
        mapa.layerFeiras = new ol.layer.Vector({
            source: mapa.feirasSource,
            name: 'Feiras',
            style: mapa.stylePlanoFeiras
        });

        mapa.map.addLayer(mapa.layerFeiras);
        mapa.map.addControl(new ol.control.Zoom());

        geolocation = new ol.Geolocation({
            projection: mapa.map.getView().getProjection(),
            tracking: true
        });     

        geolocation.once('change', function(evt) {
            mapa.map.getView().setCenter(geolocation.getPosition());
            mapa.map.getView().setZoom(17);
        });

});
