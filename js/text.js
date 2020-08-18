// API KEY 8231200b8dfbf3e1f53605d85706f0d5
// Chiamate API possibili : https://developers.themoviedb.org/3​ concentrarsi su Search/Movies
// Esempio di richiesta API : https://api.themoviedb.org/3/movie/550?api_key=8231200b8dfbf3e1f53605d85706f0d5

/* MILESTONE 4
    Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp,
    creando un layout completo simil-Netflix:
    ● Un header che contiene logo e search bar
    ● Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma
    di “card” in cui lo sfondo è rappresentato dall’immagine di copertina (​ consiglio
    la poster_path con w342 ) ​
    ● Andando con il mouse sopra una card (on hover), appaiono le informazioni
    aggiuntive già prese nei punti precedenti più la overview */

function flag(lingua){
    var bandiera="";
    if(lingua == "it" || lingua == "en" || lingua == "nl" || lingua == "ja" || lingua == "fr"){
        bandiera = "<img class='flag' src='./img/" + lingua + ".png'/>";
    } else{
        bandiera = lingua;
    }
    return bandiera
}

function poster(immagine){
    var link= "";
    if(immagine == null){
        link = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Noimage.svg/739px-Noimage.svg.png";
    } else{
        link = "https://image.tmdb.org/t/p/w200" + immagine;
    } return link
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
        var immagine = risultatiRicerca[x].poster_path;
        var lingua = risultatiRicerca[x].original_language;
        var bandiera = flag(lingua);
        var datiFilm = {
            titolo : risultatiRicerca[x].title || risultatiRicerca[x].name,
            titoloOriginale: risultatiRicerca[x].original_title || risultatiRicerca[x].original_name ,
            lingua: bandiera,
            voto: stellePiene + stelleVuote,
            poster: poster(immagine), 
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