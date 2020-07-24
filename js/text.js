// API KEY 8231200b8dfbf3e1f53605d85706f0d5
// Chiamate API possibili : https://developers.themoviedb.org/3​ concentrarsi su Search/Movies
// Esempio di richiesta API : https://api.themoviedb.org/3/movie/550?api_key=8231200b8dfbf3e1f53605d85706f0d5

/* MILESTONE 2: 
    Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
    permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
    lasciando le restanti vuote (troviamo le icone in FontAwesome).
    Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze
    piene (o mezze vuote :P)
    Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della
    nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della
    nazione ritornata dall’API (le flag non ci sono in FontAwesome).
    Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca
    dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando
    attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di
    risposta diversi, simili ma non sempre identici) 
    Font Awesome: star <i class="far fa-star"></i> vuote
                    <i class="fas fa-star"></i> piene */



function ricercaFilm(){
    var htmlTemplate = $("#contenitore-film").html();
    var compileTemplate = Handlebars.compile(htmlTemplate);
    var valoreRicerca = $("#search-bar").val();
    console.log(valoreRicerca);
    $(".box-film").remove(); //Prima di generare altre ricerce, eliminiamo tutti i film cercati precedentemente
    $.ajax({ // Faccio una chiamata ajax per cercare tutti i film che coincidono con quello che ho scritto
        url: "https://api.themoviedb.org/3/search/movie?",
        data: {
            api_key: "8231200b8dfbf3e1f53605d85706f0d5",
            language: "it-IT",
            query: valoreRicerca,
        },
        success: function (success) {
            console.log(success.results);
            var risultatiRicerca = success.results;
            for(var x = 0; x < risultatiRicerca.length; x++){ //Listo l'array che mi restituisce la ricerca
                console.log(risultatiRicerca[x]);
                var numeroStelle = Math.ceil(risultatiRicerca[x].vote_average / 2);
                var stellePiene = "";
                var stelleVuote = "";
                for(var y = 0; y < numeroStelle; y++){
                     stellePiene += '<i class="fas fa-star"></i>';
                }
                var vuote = 5 - numeroStelle;
                for(var z = 0; z < vuote; z++){
                    stelleVuote += '<i class="far fa-star"></i>'
                }
                var datiFilm = {
                    titolo : risultatiRicerca[x].title,
                    titoloOriginale: risultatiRicerca[x].original_title ,
                    lingua: risultatiRicerca[x].original_language,
                    voto: stellePiene + stelleVuote,
                }
                var htmlGenerato = compileTemplate(datiFilm);
                $("#main-page").append(htmlGenerato);
            }
        },
        error: function(error){
            console.log(error);
        }
    })
    $("#search-bar").val(""); // Resetto l'input tutte le volte che scrivo qualcosa e invio
}

$(document).ready(function(){

    $("#go").click(function(){
        ricercaFilm();
    })

    $("#search-bar").keyup(function(e){ //Avviamo questa funzione una volta che abbiamo cliccato il tasto invio
        if(e.keyCode === 13){
            ricercaFilm();
        }
    })
})