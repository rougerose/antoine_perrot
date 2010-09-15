$(document).ready(function(){
	/**
	 * Grille de mise en page ajoutée aux boutons d'administration de spip
	 */
	
	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#grille").click(function(){
		$("body").toggleClass("grille");
	});
	
	/**
	 * transitions CSS3 non disponibles dans Firefox 3 (max)
	 */
	
	if (typeof getStyleProperty('transition') == 'undefined') {
		// property is supported
		$("#nav li a").addClass("ff3").hover(
			function() {
				$(this).stop().animate({paddingLeft:"30px"},600);
			},
			function() {
				$(this).stop().animate({paddingLeft:"40px"},600);
			}
		);
	}
	
	/**
	 * Slider
	 * http://jqueryfordesigners.com/coda-slider-effect/
	 */
	
	var $panneaux = $("#slider .scrollConteneur > div > div"),
		$conteneur = $("#slider .scrollConteneur"),
		//pas de barre de défilement
		$scroll = $("#slider .scroll").css("overflow","hidden"),
		// défilement horizontal
		horizontal = true;
	
	// pour un défilement horizontal
	if (horizontal) {
		$panneaux.css({
			'float': 'left',
			'position' : 'relative'
		});
		$conteneur.css('width', $panneaux[0].offsetWidth * $panneaux.length);
	}
	
	function selectNav() {
		$(this)
			.parents("ul:first")
				.find("a")
					.removeClass("on")
				.end()
			.end()
			.addClass("on");
	}
	
	$("#slider .navigation").find("a").click(selectNav);
	
	var scrollOptions = {
		target: $scroll,
		items: $panneaux,
		navigation: '.navigation a',
		prev: '',
		next: '',
		axis: 'xy',
		duration: 500,
		easing: 'swing',
	//	onAfter: trigger,
		offset: offset
	}
	
	function trigger(data){
		var el = $("#slider .navigation").find('a[href$="' + data.id + '"]').get(0);
		selectNav.call(el);
	}
	
	if (window.location.hash) {
		trigger({ id: window.location.hash.substr(1) });
	} else {
	//	$("ul.navigation a:first").click();
	}
	
	$("#slider").serialScroll(scrollOptions);
	
	// offset is used to move to *exactly* the right place, since I'm using
	// padding on my example, I need to subtract the amount of padding to
	// the offset.  Try removing this to get a good idea of the effect
	var offset = parseInt((horizontal ? 
	  $conteneur.css('paddingTop') : 
	  $conteneur.css('paddingLeft')) 
	  || 0) * -1;
	
	$.localScroll(scrollOptions);
	
	// finally, if the URL has a hash, move the slider in to position, 
	// setting the duration to 1 because I don't want it to scroll in the
	// very first page load.  We don't always need this, but it ensures
	// the positioning is absolutely spot on when the pages loads.
	scrollOptions.duration = 1;
	$.localScroll.hash(scrollOptions);
	
	
	/**
	 * Visualisation des oeuvres via un aperçu et agrandissement dans le slider
	 */
	
	$(".visuOeuvres").each(function(){
		// récupération de tous les liens de l'aperçu des images
		var $liensApercu = $(this).find("ul.imgApercu li a"),
			delai = 500;
		
		$liensApercu.click(function(){
			// mise en cache une copie de l'élément cliqué, puis transformation en objet jQuery 
			var lien = this,
				$lien = $(this),
				// récupération des éléments nécessaires 
				// pour afficher l'image et sa description dans la zone d'agrandissement
				$urlApercu = $lien.attr("href"),
				$descApercu = $lien.parent().find('.imgDesc').html(),
				// mise en cache de la zone d'agrandissement relative au lien cliqué
				$zoneAgrandissement = $lien.parents("div.panneau").find(".imgAgrandissement"),
				$img = $zoneAgrandissement.find("img"),
				$desc = $zoneAgrandissement.find(".imgDesc"),
				// récupération de la dimension de l'image indiquée dans son url
				// (de la forme chemin/L...xH.../nomdufichier.extension). 
				// L'expression régulière ci-dessous fonctionne mais sort en premier résultat L...xH...
				dimensions = $urlApercu.match(/L(\d+)xH(\d+)/),
				largeur = dimensions[1],
				hauteur = dimensions[2];
				
			if ($lien.is('.on')) {
				return false;
			};
			
			$liensApercu.removeClass("on");
			$lien.addClass("on");
			
			// changement de l'image
			$img.stop().animate({
				opacity: 0,
				width: largeur,
				height: hauteur
			}, delai, function(){
				$(this).attr({ src: $urlApercu, width: largeur, height: hauteur });
				$img.animate({
					opacity: 1
				},delai);
			});
			return false;
		});
	});
	
});


/**
 * @method getStyleProperty
 * @param {String} propName style property to test
 * @param {HTMLElement} element optional optional element to test
 * @return {String | undefined}
 *
 * @example getStyleProperty('borderRadius');
 * http://perfectionkills.com/feature-testing-css-properties/
 */
var getStyleProperty = (function(){

  var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];

  function getStyleProperty(propName, element) {
    element = element || document.documentElement;
    var style = element.style,
        prefixed;

    // test standard property first
    if (typeof style[propName] == 'string') return propName;

    // capitalize
    propName = propName.charAt(0).toUpperCase() + propName.slice(1);

    // test vendor specific properties
    for (var i=0, l=prefixes.length; i<l; i++) {
      prefixed = prefixes[i] + propName;
      if (typeof style[prefixed] == 'string') return prefixed;
    }
  }

  return getStyleProperty;
})();