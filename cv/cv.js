//

$("div.education .titre, div.projet .titre, div.travail .titre").click(function() {
    $(this).next().toggle("0.5s");
    console.log("clicketyclick");
});