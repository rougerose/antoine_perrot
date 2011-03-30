$(document).ready(function(){
	// fonction(s) qui... fonctionne(nt) y compris après chargement d'un page en ajax
	// http://www.mail-archive.com/spip-zone@rezo.net/msg08173.html
	initInlineForms();
	onAjaxLoad(initInlineForms);


	/**
	 * Grille de mise en page ajoutée aux boutons d'administration de spip
	 */
	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#grille").click(function(){
		$("body").toggleClass("grille");
	});

	// $("body").toggleClass("grille");


	/**
	 *	Ajout d'une icone "loupe" sur les images cliquables
	 *
	 **/
/*	$("a.icone-lien").append('<span class="icone-loupe"></span>').children("span").css({ 'opacity':0 });
	$("a.icone-lien").hover(
		function(){
			$(this).children("span.icone-loupe").stop().show().animate({
				opacity: 1
			},500);
		},
		function(){
			$(this).children("span.icone-loupe").stop().animate({
				opacity: 0
			}, 500);
		});
*/
	/**
	 *	Les messages d'informations sur les erreurs de saisies
	 *	des formulaires masque les champs.
	 *	Lorsque l'utilisateur clique dans le champ pour corriger,
	 *	le message d'erreur est automatique masqué.
	 */

	$(".formulaire_spip").delegate("li.erreur","click",function(){
		$(this).find("span").hide();
		$(this).removeClass("erreur");
	});


	/**
	 * transitions CSS3 non disponibles dans Firefox 3 (max)
	 */

	if (typeof getStyleProperty('transition') == 'undefined') {
		// property is unsupported
		// simulation CSS3 pour firefox 3
		$("#nav li a").addClass("ff3");
		$("#nav li.off a.ff3").hover(
			function() {
				$(this).stop().animate({paddingLeft:"20px"},600);
			},
			function() {
				$(this).stop().animate({paddingLeft:"40px"},600);
			}
		);
	}


	/**
	 * Slider
	 * script est un mix entre deux sources principales :
	 * http://jqueryfordesigners.com/coda-slider-effect/
	 * et
	 * http://jqueryfordesigners.com/jquery-infinite-carousel/
	 */

	$("#slider").each(function(){
		var slider = $(this),
			scroll = $(".scroll"),
			conteneur = $(".scrollConteneur"),
			panneaux = $(".panneau"),
			pages = panneaux.length,
			nav = $(".navigation a"),
			pageCourante = 1,
			p = 1,
			panneauLargeur = panneaux.outerWidth(),
			horizontal = true,
			delai = 700;

		// pas de barre défilement sur le div.scroll
		scroll.css("overflow","hidden");


		// défilement horizontal du slider
		if (horizontal) {
			panneaux.css({ 'float': 'left', 'position' : 'relative' });
			conteneur.css('width', panneauLargeur * pages);
		}

		// hauteur du premier panneau
		var panneauHauteur = panneaux.eq((pageCourante - 1)).outerHeight();

		// premier bouton de la navigation sélectionné
		nav.eq(0).addClass("actif");

		// boutons de navigation gauche et droite
		// et application de la hauteur du premier panneau
		if (pages > 1) {
			scroll
				.before('<span id="sbg" class="scrollBouton gauche">&nbsp;</span>')
				.after('<span id="sbd" class="scrollBouton droite">&nbsp;</span>');
		}

		scroll
		//	.before('<span id="sbg" class="scrollBouton gauche">&nbsp;</span>')
		//	.after('<span id="sbd" class="scrollBouton droite">&nbsp;</span>')
			.css({ height:panneauHauteur });



		// navigation via les boutons
		$('span.scrollBouton.gauche', this).click(function () {
			p--; if (p < 1) p = pages;
			var el = nav.eq(p-1); selectNav.call(el);
			return gotoPage(pageCourante - 1);
		});
		$('span.scrollBouton.droite', this).click(function () {
			p++; if (p > pages) p = 1;
			var el = nav.eq(p-1); selectNav.call(el);
			return gotoPage(pageCourante + 1);
		});

		function gotoPage(page) {
			var dir = page < pageCourante ? -1 : 1,
				n = Math.abs(pageCourante - page),
				left = panneauLargeur * dir * n;

			if (page < 1) {
				left = Math.abs(left*pages);
				page = pages;
			} else if (page > pages) {
				left = - (panneauLargeur * pages);
				page = 1;
			}
			p = page;
			pageCourante = page;

			// modification de la hauteur du scroll en fonction de celle du panneau affiché
			var hauteurPanneau = panneaux.eq(pageCourante-1).outerHeight();

			scroll.animate({
				scrollLeft: '+=' + left,
				height: hauteurPanneau
			},delai);
		}

		nav.each(function (a) {
			$(this).bind("click",function(){
				selectNav.call($(this));
				gotoPage(a + 1);
			});
		});

		function selectNav () {
			$(this)
				.parents("ul")
					.find("a")
						.removeClass("actif")
					.end()
				.end()
			.addClass("actif");
		}

		// l'url comporte un hash, on affiche l'œuvre directement
		if (window.location.hash) {
			var afficher = '[hash=' + window.location.hash + ']';
			$("#slider .navigation a").filter(afficher).click();
		}
	});

	/**
	 * Animation de pseudo tooltips
	 * inspiré de http://jqueryfordesigners.com/coda-popup-bubbles/
	 */
	$(".tooltip").each(function(){
		var trigger = $("a",this);
		var texteInfo = trigger.html();

		var delai = 250;
		var hideDelay = 500;
		var hideDelayTimer = null;
		var beingShown = false;
		var shown = false;
		var direction;
		var marge;

		if ($(this).is(".next")) {
			$(this).prepend('<div class="next info">'+ texteInfo +'</div>');
			largeurNext = $(".next.info").outerWidth();
			$(".next.info").addClass("a").css({
				marginLeft: '-' + largeurNext + 'px',
				top:30
			});
		}
		if ($(this).is(".back")) {
			$(this).append('<div class="back info">'+ texteInfo +'</div>');
			largeurBack = $(".back.info").outerWidth();
			$(".back.info").css({top:30});
		}

		var info = $(".info",this).css('opacity',0);

		trigger.mouseover(function(){
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
			if (beingShown || shown) {
				// don't trigger the animation again
				return;
			} else {
				// reset position of info box
				beingShown = true;

				info.show().animate({
					top:0,
					opacity: 1
				}, delai, 'swing', function(){
					beingShown = false;
					shown = true;
				});
			}
		}).mouseout(function(){
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
			hideDelayTimer = setTimeout(function () {
				hideDelayTimer = null;

				if (info.is(".next")) {
					direction = '+=';
				} else {
					direction = '-='
				}

				info.animate({
					top:30,
					opacity: 0
				}, delai, 'swing', function () {
					shown = false;
					info.css('display', 'none');
				});
			}, hideDelay);
		});
	});

	/**
	 *	Plugin Mediabox (colorbox)
	 *	pour afficher titre et descriptif de l'image
	 */
/*	$("a.mediabox").colorbox({
		title: function(){
			var $id = $(this).parent().attr("id").slice(9);
			var titre = "";
			// $.getJSON est asynchrone,
			// du coup il faut utiliser $.ajax avec async:false en paramètre pour récupérer les données
			// voir http://stackoverflow.com/questions/31129/how-can-i-return-a-variable-from-a-getjson-function
			$.ajax({
				url: 'spip.php?page=liste-documents.json',
				async: false,
				dataType: 'json',
				success: function (json) {
					for (var i=0; i < json.total_documents; i++){
						var obj = json.document[i];
						if (obj.id == $id) {
							titre = '<h3>' + obj.titre + '</h3>' + '<p>' + obj.descriptif + obj.date + '</p>';
							return titre;
						}
					}
				}
			});
			return titre;
		}
	});
*/
});

/**
 * Inline Forms :
 * label dans les champs de saisie
 * légèrement adapté à partir de http://www.zurb.com/playground/inline-form-labels
 */

var initInlineForms = function() {
	$(".formulaire_spip .text, .formulaire_spip .password").each(function () {
		if($(this).val() !== "") {
			$(this).parent().find("label").addClass("has-text");
		}
		$(this).focus(function () {
			$(this).parent().find("label").addClass("focus");
		});
		$(this).keypress(function () {
			$(this).parent().find("label").addClass("has-text").removeClass("focus");
		});
		$(this).blur(function () {
			if($(this).val() == "") {
				$(this).parent().find("label").removeClass("has-text").removeClass("focus");
			}
		});
	});
}

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