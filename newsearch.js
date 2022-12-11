function search(text){
    console.log("search");
    if (text === ""){
        listLiveries();
    }
    else if (lastvalue.length < text.lenth) {
        var liveries = document.getElementById("liverylist").childNodes;
        liveries.forEach(function(e){
            if (e.style.display == "block"){
                console.log("seen");
                if (!(e.innerText.toLowerCase().includes(text.toLowerCase()))){
                    e.style.display = "none";
                }
            }
        })
    }
    else if (lastvalue.length > text.lenth) {
        var liveries = document.getElementById("liverylist").childNodes;
        liveries.forEach(function(e){
            if (e.style.display == "none"){
                if (e.innerText.toLowerCase().includes(text.toLowerCase())){
                    e.style.display = "block";
                }
            }
        })
    }
    lastvalue = text;
}