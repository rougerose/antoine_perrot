$(document).ready(function(){
	//Grille de mise en page ajoutée aux boutons d'administration de spip
	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#grille").click(function(){
		$("body").toggleClass("grille");
	});
});