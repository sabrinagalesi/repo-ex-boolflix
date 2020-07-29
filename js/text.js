// API KEY 8231200b8dfbf3e1f53605d85706f0d5
// Chiamate API possibili : https://developers.themoviedb.org/3​ concentrarsi su Search/Movies
// Esempio di richiesta API : https://api.themoviedb.org/3/movie/550?api_key=8231200b8dfbf3e1f53605d85706f0d5

/* MILESTONE 3
    In questa milestone come prima cosa aggiungiamo la copertina del film o della serie
    al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo
    perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
    Dovremo prendere quindi l’URL base delle immagini di TMDB:
    https://image.tmdb.org/t/p/​ per poi aggiungere la dimensione che vogliamo generare
    (troviamo tutte le dimensioni possibili a questo link:
    https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400​ ) per poi aggiungere la
    parte finale dell’URL passata dall’API.
    Esempio di URL che torna la copertina di BORIS:
    https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg */

function flag(lingua){
    var bandiera="";
    if(lingua == "it" || lingua == "en" || lingua == "nl" || lingua == "ja" || lingua == "fr"){
        bandiera = "<img class='flag' src='./img/" + lingua + ".png'/>";
    } else{
        bandiera = lingua;
    }
    return bandiera
}

function boxInformations(success, compileTemplate){
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
        var lingua = risultatiRicerca[x].original_language;
        var bandiera = flag(lingua);
        var datiFilm = {
            titolo : risultatiRicerca[x].title || risultatiRicerca[x].name,
            titoloOriginale: risultatiRicerca[x].original_title || risultatiRicerca[x].original_name ,
            lingua: bandiera,
            voto: stellePiene + stelleVuote,
            poster: "https://image.tmdb.org/t/p/w200" + risultatiRicerca[x].poster_path, 
        }
        var htmlGenerato = compileTemplate(datiFilm);
        $("#main-page").append(htmlGenerato);
        $(".box-film").mouseenter(function(){
            $(this).find(".information-film").show();
            $(this).find(".poster").hide();
        })
        $(".box-film").mouseleave(function(){
            $(this).find(".information-film").hide();
            $(this).find(".poster").show();
        })
    };
}

function ricercaFilm(){
    var htmlTemplate = $("#contenitore-film").html();
    var compileTemplate = Handlebars.compile(htmlTemplate);
    var valoreRicerca = $("#search-bar").val();
    console.log(valoreRicerca);
    $(".box-film").remove(); //Prima di generare altre ricerce, eliminiamo tutti i film cercati precedentemente
    $.ajax({ // Faccio una chiamata ajax per cercare tutti i film che coincidono con quello che ho scritto
        url: "https://api.themoviedb.org/3/search/movie",
        data: {
            api_key: "8231200b8dfbf3e1f53605d85706f0d5",
            language: "it-IT",
            query: valoreRicerca,
        },
        success: function(success) {
            boxInformations(success, compileTemplate);
        },
        error: function(error){
            console.log(error);
        }
    })
    $.ajax({
        url: "https://api.themoviedb.org/3/search/tv",
        data: {
            api_key: "8231200b8dfbf3e1f53605d85706f0d5",
            language: "it_IT",
            query: valoreRicerca,
        },
        success: function(success){
            boxInformations(success,compileTemplate);
        },
        error: function(error){
            console.log(error);
        },
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